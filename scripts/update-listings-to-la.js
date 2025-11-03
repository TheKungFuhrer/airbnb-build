const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting to update all listings to Los Angeles...\n');

  try {
    // Get count of listings before update
    const beforeCount = await prisma.listing.count();
    console.log(`Found ${beforeCount} listings to update`);

    // Update all listings to Los Angeles
    const result = await prisma.listing.updateMany({
      data: {
        locationValue: 'la', // Los Angeles city code from useCities hook
      },
    });

    console.log(`\n✅ Successfully updated ${result.count} listings to Los Angeles, California`);

    // Verify the update
    const laListings = await prisma.listing.count({
      where: {
        locationValue: 'la',
      },
    });

    console.log(`\n📍 Verification: ${laListings} listings now have Los Angeles as location`);

    // Show a sample of updated listings
    const sampleListings = await prisma.listing.findMany({
      take: 5,
      select: {
        id: true,
        title: true,
        locationValue: true,
      },
    });

    console.log('\n📋 Sample of updated listings:');
    sampleListings.forEach((listing, index) => {
      console.log(`${index + 1}. ${listing.title} - Location: ${listing.locationValue}`);
    });

  } catch (error) {
    console.error('❌ Error updating listings:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
