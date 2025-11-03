const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting update: Moving all listings to Los Angeles, California...\n');

  try {
    // Update all listings to Los Angeles
    const result = await prisma.listing.updateMany({
      data: {
        locationValue: 'la', // Los Angeles city code from useCities hook
      },
    });

    console.log(`✅ Successfully updated ${result.count} listings to Los Angeles, California`);
    console.log('\n📍 All listings now located in: Los Angeles, California');
    console.log('🧪 City filter is now testable!\n');

  } catch (error) {
    console.error('❌ Error updating listings:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
