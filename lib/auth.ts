import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function getUserFromSession() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return null;
  }
  
  // First check in User table
  let user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      emailVerified: true,
    },
  });
  
  // If not found in User table, check in Admin table
  if (!user) {
    user = await prisma.admin.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
      },
    });
  }
  
  return user;
}

export async function isUserVerified(email: string) {
  // First check in User table
  let user = await prisma.user.findUnique({
    where: { email },
    select: { emailVerified: true },
  });
  
  // If not found in User table, check in Admin table
  if (!user) {
    user = await prisma.admin.findUnique({
      where: { email },
      select: { emailVerified: true },
    });
  }
  
  return user?.emailVerified || false;
}