const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function createCustomAdmin() {
  const prisma = new PrismaClient();
  
  // Get email and password from command line arguments
  const email = process.argv[2] || 'moosa123@gmail.com';
  const password = process.argv[3] || 'Moosa@123';
  const name = process.argv[4] || 'ADMIN MOOSA';
  
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
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    
    // Check if it's a duplicate email error
    if (error.code === 'P2002') {
      console.log('⚠️  Admin user might already exist. Try a different email or check your database.');
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