const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const csv = require('csv-parser');

const prisma = new PrismaClient();

// Map Peerspace categories to OMG Rentals categories
const categoryMap = {
  'photo': 'Photoshoot',
  'video': 'Film Production',
  'meeting': 'Meeting',
  'party': 'Party',
  'workshop': 'Workshop',
  'event': 'Social Event',
  'popup': 'Popup',
  'production': 'Film Production',
  'studio': 'Content Studio',
  'default': 'Social Event'
};

function determineCategory(title, description) {
  const text = `${title} ${description}`.toLowerCase();
  
  if (text.includes('photo') || text.includes('shoot')) return 'Photoshoot';
  if (text.includes('film') || text.includes('production')) return 'Film Production';
  if (text.includes('meeting') || text.includes('conference')) return 'Meeting';
  if (text.includes('party') || text.includes('celebration')) return 'Party';
  if (text.includes('workshop') || text.includes('class')) return 'Workshop';
  if (text.includes('popup') || text.includes('retail')) return 'Popup';
  if (text.includes('music') || text.includes('recording')) return 'Music Recording';
  if (text.includes('fitness') || text.includes('yoga')) return 'Fitness Class';
  if (text.includes('performance') || text.includes('stage')) return 'Performance';
  if (text.includes('corporate')) return 'Corporate Event';
  if (text.includes('art') || text.includes('gallery')) return 'Art Exhibition';
  if (text.includes('studio')) return 'Content Studio';
  if (text.includes('luxury') || text.includes('elegant')) return 'Luxury Event';
  
  return 'Social Event';
}

function extractPriceFromTitle(title) {
  // Look for price patterns like "$50/hr" or "$100 per hour"
  const priceMatch = title.match(/\$(\d+)(?:\/hr|per hour| hr)/i);
  if (priceMatch) {
    return parseInt(priceMatch[1]);
  }
  // Default hourly rate if not found
  return Math.floor(Math.random() * (150 - 50 + 1)) + 50; // $50-$150/hr
}

function generateCapacity(title, description) {
  const text = `${title} ${description}`.toLowerCase();
  
  // Look for capacity mentions
  const capacityMatch = text.match(/(\d+)\s*(?:guests|people|capacity|attendees)/i);
  if (capacityMatch) {
    return parseInt(capacityMatch[1]);
  }
  
  // Default based on space type
  if (text.includes('intimate') || text.includes('small')) return Math.floor(Math.random() * 20) + 5;
  if (text.includes('large') || text.includes('spacious')) return Math.floor(Math.random() * 100) + 50;
  
  return Math.floor(Math.random() * (50 - 10 + 1)) + 10; // 10-50 people
}

async function importListings(limit = 50) {
  console.log(`🚀 Starting import of ${limit} listings...`);
  
  // Create a demo user first
  let demoUser = await prisma.user.findFirst({
    where: { email: 'demo@omgrentals.com' }
  });
  
  if (!demoUser) {
    demoUser = await prisma.user.create({
      data: {
        name: 'Demo Host',
        email: 'demo@omgrentals.com',
        hashedPassword: 'demo-password-not-used',
        userType: 'host',
      }
    });
    console.log('✅ Created demo user');
  }
  
  const listings = [];
  let count = 0;
  let uniqueUrls = new Set();
  
  return new Promise((resolve, reject) => {
    fs.createReadStream('peerspace_listings.csv')
      .pipe(csv())
      .on('data', (row) => {
        // Only process rows with valid URLs (actual listings, not reviews)
        if (row.URL && row.URL.startsWith('https://www.peerspace.com/pages/listings/') && 
            !uniqueUrls.has(row.URL) && count < limit) {
          
          uniqueUrls.add(row.URL);
          
          const title = row['Page Title'] || 'Event Space';
          const description = row.Description || 'Beautiful event space available for rent by the hour.';
          const image = row['images/0'] || 'https://images.unsplash.com/photo-1497366216548-37526070297c';
          
          const hourlyRate = extractPriceFromTitle(title);
          const capacity = generateCapacity(title, description);
          const category = determineCategory(title, description);
          
          listings.push({
            title: title.replace(/,.*$/, '').substring(0, 100), // Clean title
            description: description.substring(0, 500),
            imageSrc: image,
            images: [
              row['images/0'],
              row['images/1'],
              row['images/2'],
              row['images/3'],
              row['images/4']
            ].filter(Boolean),
            category,
            capacity,
            roomCount: Math.floor(Math.random() * 3) + 1,
            bathroomCount: Math.floor(Math.random() * 2) + 1,
            squareFootage: Math.floor(Math.random() * (2000 - 500 + 1)) + 500,
            hourlyRate,
            minimumHours: Math.floor(Math.random() * 2) + 2, // 2-3 hours
            cleaningFee: Math.floor(hourlyRate * 0.5), // 50% of hourly rate
            locationValue: 'US', // Los Angeles
            instantBook: Math.random() > 0.5,
            sameDayBooking: Math.random() > 0.3,
            wifiAvailable: true,
            parking: ['street', 'garage', 'lot'][Math.floor(Math.random() * 3)],
            accessibility: Math.random() > 0.7,
            userId: demoUser.id,
          });
          
          count++;
        }
      })
      .on('end', async () => {
        try {
          console.log(`\n📊 Found ${listings.length} unique listings to import`);
          console.log('⏳ Creating listings in database...\n');
          
          let successCount = 0;
          let errorCount = 0;
          
          for (const listingData of listings) {
            try {
              await prisma.listing.create({ data: listingData });
              successCount++;
              if (successCount % 10 === 0) {
                console.log(`✅ Created ${successCount}/${listings.length} listings...`);
              }
            } catch (error) {
              errorCount++;
              console.error(`❌ Error creating listing: ${listingData.title.substring(0, 50)}...`);
            }
          }
          
          console.log(`\n🎉 Import complete!`);
          console.log(`✅ Successfully created: ${successCount} listings`);
          if (errorCount > 0) {
            console.log(`❌ Errors: ${errorCount}`);
          }
          
          // Show category breakdown
          const categoryCounts = {};
          listings.forEach(l => {
            categoryCounts[l.category] = (categoryCounts[l.category] || 0) + 1;
          });
          
          console.log(`\n📈 Category Breakdown:`);
          Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
            console.log(`   ${cat}: ${count}`);
          });
          
          await prisma.$disconnect();
          resolve({ success: successCount, errors: errorCount });
        } catch (error) {
          reject(error);
        }
      })
      .on('error', reject);
  });
}

// Get limit from command line argument or default to 50
const limit = parseInt(process.argv[2]) || 50;

importListings(limit)
  .then(({ success, errors }) => {
    console.log(`\n✨ Done! Visit your app to see the new listings.`);
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Import failed:', error);
    process.exit(1);
  });
