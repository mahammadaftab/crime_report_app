import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

async function createCustomAdmin() {
  const prisma = new PrismaClient();
  
  // Get email and password from command line arguments
  const email = process.argv[2] || 'admin@gmail.com';
  const password = process.argv[3] || '123456789';
  const name = process.argv[4] || 'Mahammad Aftab';
  
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create the admin user
    const admin = await prisma.admin.create({
      data: {
        email: email,
        name: name,
        password: hashedPassword,
        role: 'ADMIN',
        emailVerified: true, // Set to true to skip email verification
        verificationOTP: '111111',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
    
    console.log('✅ Admin user created successfully!');
    console.log('Email:', admin.email);
    console.log('Name:', admin.name);
    console.log('Password: [REDACTED] (you provided this)');
    console.log('Verification OTP: 111111 (for future reference)');
    
    // Create an admin profile
    const adminProfile = await prisma.adminProfile.create({
      data: {
        adminId: admin.id,
        department: 'Administration',
        position: 'Administrator',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
    
    console.log('✅ Admin profile created successfully!');
    console.log('Department:', adminProfile.department);
    console.log('Position:', adminProfile.position);
    
  } catch (error: unknown) {
    console.error('❌ Error creating admin user:', (error as Error).message);
    
    // Check if it's a duplicate email error
    if (typeof error === 'object' && error !== null && 'code' in error && (error as { code?: string }).code === 'P2002') {
      console.log('⚠️  Admin user might already exist. Try a different email or check your database.');
    }
    
    // Check if it's a connection error
    if (typeof error === 'object' && error !== null && 'message' in error && (error as { message?: string }).message?.includes('Can\'t reach database server')) {
      console.log('⚠️  Database connection failed. Please check your database connection or try using a local database.');
      console.log('💡 Try these solutions:');
      console.log('   1. Check if your Neon database is running');
      console.log('   2. Verify your DATABASE_URL in .env file');
      console.log('   3. Try using a local PostgreSQL database for development');
    }
  } finally {
    await prisma.$disconnect();
  }
}

// Show usage instructions
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Usage: node create-custom-admin.js [email] [password] [name]

Examples:
  node create-custom-admin.js
  node create-custom-admin.js admin@example.com mypassword "Admin User"
  node create-custom-admin.js newadmin@company.com securepass123 "New Admin"

Note: If no arguments are provided, defaults will be used.
  `);
  process.exit(0);
}

createCustomAdmin();