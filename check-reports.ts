import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkReports() {
  try {
    console.log('Checking reports and their user associations...');
    
    // Get all reports
    const reports = await prisma.report.findMany({
      include: {
        user: true
      }
    });
    
    console.log(`Total reports: ${reports.length}`);
    
    // Count reports with and without users
    const reportsWithUsers = reports.filter(report => report.userId !== null);
    const reportsWithoutUsers = reports.filter(report => report.userId === null);
    
    console.log(`Reports with users: ${reportsWithUsers.length}`);
    console.log(`Reports without users: ${reportsWithoutUsers.length}`);
    
    // Show some examples
    if (reportsWithUsers.length > 0) {
      console.log('\nReports with users:');
      reportsWithUsers.slice(0, 5).forEach(report => {
        console.log(`  - Report ID: ${report.reportId}, Title: ${report.title}, User: ${report.user?.email || 'Unknown'}`);
      });
    }
    
    if (reportsWithoutUsers.length > 0) {
      console.log('\nReports without users:');
      reportsWithoutUsers.slice(0, 5).forEach(report => {
        console.log(`  - Report ID: ${report.reportId}, Title: ${report.title}, User ID: ${report.userId}`);
      });
    }
    
    // Get a specific user and their reports
    const user = await prisma.user.findFirst({
      include: {
        reports: true
      }
    });
    
    if (user) {
      console.log(`\nSample user: ${user.email}`);
      console.log(`User's reports: ${user.reports.length}`);
      user.reports.forEach(report => {
        console.log(`  - Report ID: ${report.reportId}, Title: ${report.title}`);
      });
    }
  } catch (error) {
    console.error('Error checking reports:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkReports();