// Test script to verify signup API changes
import { readFileSync } from 'fs';
import { join } from 'path';

const filePath = join(__dirname, 'app', 'api', 'auth', 'signup', 'route.ts');
const fileContent = readFileSync(filePath, 'utf-8');

console.log('Checking signup route file...');

// Check if the file contains the updated error handling
if (fileContent.includes('let existingAdmin = null;') && 
    fileContent.includes('if (!userExists) {') && 
    fileContent.includes('Error checking existing admin')) {
  console.log('✅ File has been updated with error handling');
} else {
  console.log('❌ File does not contain expected error handling');
}

// Check for direct admin table access outside try-catch
const directAdminAccess = fileContent.match(/prisma\.admin\.findUnique/g);
if (directAdminAccess && directAdminAccess.length > 0) {
  console.log(`⚠️  Found ${directAdminAccess.length} direct admin table accesses`);
} else {
  console.log('✅ No direct admin table accesses found outside try-catch');
}

console.log('File check complete.');