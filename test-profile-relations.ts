import prisma from "@/lib/prisma";

async function testProfileRelations() {
  try {
    // Test creating a user profile
    const user = await prisma.user.findFirst();
    if (user) {
      console.log("Found user:", user);
      
      // Try to create or update a user profile
      const userProfile = await prisma.userProfile.upsert({
        where: { userId: user.id },
        update: {
          phone: "123-456-7890",
          address: "123 Main St",
          dateOfBirth: new Date("1990-01-01"),
        },
        create: {
          userId: user.id,
          phone: "123-456-7890",
          address: "123 Main St",
          dateOfBirth: new Date("1990-01-01"),
        },
      });
      
      console.log("User profile created/updated:", userProfile);
    } else {
      console.log("No user found");
    }
    
    // Test creating an admin profile
    const admin = await prisma.admin.findFirst();
    if (admin) {
      console.log("Found admin:", admin);
      
      // Try to create or update an admin profile
      const adminProfile = await prisma.adminProfile.upsert({
        where: { adminId: admin.id },
        update: {
          phone: "987-654-3210",
          department: "IT Department",
          position: "System Administrator",
        },
        create: {
          adminId: admin.id,
          phone: "987-654-3210",
          department: "IT Department",
          position: "System Administrator",
        },
      });
      
      console.log("Admin profile created/updated:", adminProfile);
    } else {
      console.log("No admin found");
    }
  } catch (error) {
    console.error("Error testing profile relations:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testProfileRelations();