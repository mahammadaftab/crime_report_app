//@ts-nocheck
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter an email and password");
        }

        // Check in User table first
        let user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        // If not found in User table, check in Admin table
        if (!user) {
          const admin = await prisma.admin.findUnique({
            where: {
              email: credentials.email,
            },
          });
          
          if (!admin) {
            throw new Error("No user found with this email");
          }
          
          // Check if email is verified
          if (!admin.emailVerified) {
            throw new Error("Please verify your email before signing in");
          }
          
          const passwordMatch = await bcrypt.compare(
            credentials.password,
            admin.password
          );
          
          if (!passwordMatch) {
            throw new Error("Incorrect password");
          }
          
          return {
            id: admin.id.toString(),
            email: admin.email,
            name: admin.name,
            role: admin.role,
          };
        }

        // Check if email is verified for regular user
        if (!user.emailVerified) {
          throw new Error("Please verify your email before signing in");
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!passwordMatch) {
          throw new Error("Incorrect password");
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        // @ts-ignore
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };