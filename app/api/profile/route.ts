import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { User, Admin } from "@prisma/client";
import cache from "@/lib/cache";

// Utility: standardized API responses
function response(
  data: object,
  status: number = 200,
  headers: Record<string, string> = {}
) {
  return NextResponse.json(
    {
      success: status >= 200 && status < 300,
      timestamp: new Date().toISOString(),
      ...data,
    },
    { status, headers }
  );
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return response({ error: "Unauthorized" }, 401);
    }

    // Check cache first
    const cacheKey = `profile_${session.user.email}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log("Returning cached profile data");
      return response({ user: cachedData });
    }

    // First check in User table
    let userResult: (User & { userProfile: { id: number; userId: number; phone: string | null; address: string | null; dateOfBirth: Date | null; createdAt: Date; updatedAt: Date; } | null }) | null = null;
    let isAdmin = false;
    let profile = null;
    let user = null;
    let rewards = null;
    let reports = null; // Add reports variable
    
    try {
      userResult = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
          userProfile: true,
        },
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      // If there's an error with the user table, return a basic user object
      userResult = null;
    }

    // If not found in User table, check in Admin table
    if (!userResult) {
      try {
        const adminResult = await prisma.admin.findUnique({
          where: { email: session.user.email },
          include: {
            adminProfile: true,
          },
        });
        
        if (adminResult) {
          isAdmin = true;
          user = {
            id: adminResult.id,
            email: adminResult.email,
            name: adminResult.name,
            role: adminResult.role,
            emailVerified: adminResult.emailVerified || false,
            createdAt: adminResult.createdAt,
            updatedAt: adminResult.updatedAt,
          };
          profile = adminResult.adminProfile;
        }
      } catch (error) {
        console.error("Error fetching admin:", error);
      }
    } else {
      user = {
        id: userResult.id,
        email: userResult.email,
        name: userResult.name,
        role: userResult.role,
        emailVerified: userResult.emailVerified || false,
        createdAt: userResult.createdAt,
        updatedAt: userResult.updatedAt,
      };
      profile = userResult?.userProfile || null;
      
      // Get user rewards
      try {
        const userRewards = await prisma.userReward.findMany({
          where: { userId: userResult.id },
          include: {
            rewardHistory: {
              include: {
                report: true,
              },
              orderBy: {
                createdAt: 'desc',
              },
              take: 10, // Limit to last 10 rewards
            },
          },
        });
        
        // Handle case where user has no reward record yet
        if (userRewards.length > 0) {
          rewards = userRewards[0];
        } else {
          // Try to create a default reward record if it doesn't exist
          try {
            const newReward = await prisma.userReward.create({
              data: {
                userId: userResult.id,
                points: 0,
                totalReports: 0,
                totalEarnings: 0.0,
              },
            });
            rewards = newReward;
          } catch (createError) {
            console.error("Error creating user reward:", createError);
            rewards = null;
          }
        }
      } catch (rewardError) {
        console.error("Error fetching user rewards:", rewardError);
        // If there's an error with rewards, continue without them
        rewards = null;
      }
      
      // Get user reports
      try {
        reports = await prisma.report.findMany({
          where: { 
            userId: userResult.id 
          },
          orderBy: { 
            createdAt: 'desc' 
          },
          include: {
            // Include reward history for each report
            rewardHistories: {
              include: {
                userReward: true
              }
            }
          }
        });
      } catch (reportError) {
        console.error("Error fetching user reports:", reportError);
        reports = [];
      }
    }

    if (!user) {
      return response({ error: "User not found" }, 404);
    }

    // Prepare user data to return
    const userData = {
      ...user,
      profile,
      rewards,
      reports, // Include reports in the response
      isAdmin,
    };

    // Cache the result for 1 minute (since profile data can change frequently)
    cache.set(cacheKey, userData);

    // Return user data without sensitive information
    return response({
      user: userData,
    });
  } catch (error: unknown) {
    console.error("Profile GET error:", error);
    return response({ error: "Internal server error" }, 500);
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return response({ error: "Unauthorized" }, 401);
    }

    const body = await request.json();
    const { name, email, currentPassword, newPassword, phone, address, dateOfBirth } = body;

    // First check in User table
    let user: User | Admin | null = null;
    let isAdmin = false;
    
    try {
      user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
    } catch (error) {
      console.error("Error fetching user:", error);
    }

    // If not found in User table, check in Admin table
    if (!user) {
      try {
        user = await prisma.admin.findUnique({
          where: { email: session.user.email },
        });
        isAdmin = true;

      } catch (error) {
        console.error("Error fetching admin:", error);
      }
    }

    if (!user) {
      return response({ error: "User not found" }, 404);
    }

    // Prepare update data
    const updateData: Partial<User | Admin> = {};
    
    // Update name if provided and different
    if (name && name !== user.name) {
      updateData.name = name;
    }
    
    // Update email if provided and different
    if (email && email !== user.email) {
      // Check if new email is already taken
      try {
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });
        
        const existingAdmin = await prisma.admin.findUnique({
          where: { email },
        });
        
        if (existingUser || existingAdmin) {
          return response({ error: "Email is already in use" }, 409);
        }
      } catch (error) {
        console.error("Error checking email uniqueness:", error);
      }
      
      updateData.email = email;
    }
    
    // Update password if provided
    if (newPassword) {
      // Verify current password is provided
      if (!currentPassword) {
        return response({ error: "Current password is required to change password" }, 400);
      }
      
      // Verify current password is correct
      const passwordMatch = await bcrypt.compare(currentPassword, user.password);
      if (!passwordMatch) {
        return response({ error: "Current password is incorrect" }, 400);
      }
      
      // Validate new password
      if (newPassword.length < 8) {
        return response({ error: "New password must be at least 8 characters long" }, 400);
      }
      
      // Hash new password
      updateData.password = await bcrypt.hash(newPassword, 12);
    }

    // Update user in appropriate table
    if (isAdmin) {
      try {
        await prisma.admin.update({
          where: { id: user.id },
          data: updateData,
        });
      } catch (error) {
        console.error("Error updating admin:", error);
        return response({ error: "Failed to update profile" }, 500);
      }
      
      // Update or create admin profile
      if (phone || address) {
        const profileData: Record<string, string> = {};
        if (phone) profileData.phone = phone;
        if (address) profileData.department = address; // Using department field for address in admin
        
        try {
          const existingProfile = await prisma.adminProfile.findUnique({
            where: { adminId: user.id },
          });
          
          if (existingProfile) {
            await prisma.adminProfile.update({
              where: { adminId: user.id },
              data: profileData,
            });
          } else {
            await prisma.adminProfile.create({
              data: {
                adminId: user.id,
                ...profileData,
              },
            });
          }
        } catch (error) {
          console.error("Error updating admin profile:", error);
        }
      }
    } else {
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: updateData,
        });
      } catch (error) {
        console.error("Error updating user:", error);
        return response({ error: "Failed to update profile" }, 500);
      }
      
      // Update or create user profile
      if (phone || address || dateOfBirth) {
        const profileData: Record<string, string | Date> = {};
        if (phone) profileData.phone = phone;
        if (address) profileData.address = address;
        if (dateOfBirth) profileData.dateOfBirth = new Date(dateOfBirth);
        
        try {
          const existingProfile = await prisma.userProfile.findUnique({
            where: { userId: user.id },
          });
          
          if (existingProfile) {
            await prisma.userProfile.update({
              where: { userId: user.id },
              data: profileData,
            });
          } else {
            await prisma.userProfile.create({
              data: {
                userId: user.id,
                ...profileData,
              },
            });
          }
        } catch (error) {
          console.error("Error updating user profile:", error);
        }
      }
    }

    // Clear cache for this user
    cache.delete(`profile_${session.user.email}`);

    // Fetch updated user with profile and rewards
    let finalUserResult: { id?: number; email?: string; name?: string; role?: string; emailVerified?: boolean; createdAt?: Date; updatedAt?: Date; password?: string; verificationOTP?: string | null; otpExpiresAt?: Date | null } | null = null;
    let finalProfile = null;
    let finalRewards = null;
          
    if (isAdmin) {
      try {
        finalUserResult = await prisma.admin.findUnique({
          where: { id: user.id },
          include: {
            adminProfile: true,
          },
        });
        finalProfile = (finalUserResult as { adminProfile?: unknown } | null)?.adminProfile || null;
      } catch (error) {
        console.error("Error fetching admin profile:", error);
      }
    } else {
      try {
        finalUserResult = await prisma.user.findUnique({
          where: { id: user.id },
          include: {
            userProfile: true,
          },
        });
        finalProfile = (finalUserResult as { userProfile?: unknown } | null)?.userProfile || null;
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
      
      // Get user rewards
      try {
        const userRewards = await prisma.userReward.findMany({
          where: { userId: user.id },
          include: {
            rewardHistory: {
              include: {
                report: true,
              },
              orderBy: {
                createdAt: 'desc',
              },
              take: 10, // Limit to last 10 rewards
            },
          },
        });
        
        if (userRewards.length > 0) {
          finalRewards = userRewards[0];
        }
      } catch (rewardError) {
        console.error("Error fetching user rewards:", rewardError);
        // If there's an error with rewards, continue without them
        finalRewards = null;
      }
    }

    // Return updated user data without sensitive information
    if (finalUserResult) {
      // Create a new object without sensitive fields
      const safeUser = {
        id: finalUserResult.id,
        email: finalUserResult.email,
        name: finalUserResult.name,
        role: finalUserResult.role,
        emailVerified: finalUserResult.emailVerified || false,
        createdAt: finalUserResult.createdAt,
        updatedAt: finalUserResult.updatedAt
      };
      
      // Cache the updated profile data
      const updatedUserData = {
        id: safeUser.id,
        email: safeUser.email,
        name: safeUser.name,
        role: safeUser.role,
        emailVerified: safeUser.emailVerified || false,
        createdAt: safeUser.createdAt,
        updatedAt: safeUser.updatedAt,
        profile: finalProfile,
        rewards: finalRewards,
        isAdmin,
      };
      
      cache.set(`profile_${finalUserResult.email || session.user.email}`, updatedUserData);
      
      return response({
        message: "Profile updated successfully",
        user: updatedUserData,
      });
    } else {
      return response({ error: "Failed to fetch updated user data" }, 500);
    }
  } catch (error: unknown) {
    console.error("Profile PUT error:", error);
    return response({ error: "Internal server error" }, 500);
  }
}