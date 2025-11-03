const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Curated high-quality Unsplash images for event spaces
// These are direct image URLs that won't have 503 errors
const stableImages = {
  'Photoshoot': [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1200&h=800&fit=crop',
  ],
  'Meeting': [
    'https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&h=800&fit=crop',
  ],
  'Party': [
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&h=800&fit=crop',
  ],
  'Workshop': [
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&h=800&fit=crop',
  ],
  'Film Production': [
    'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=1200&h=800&fit=crop',
  ],
  'Social Event': [
    'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1519167758481-83f29da8c43e?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1464047736614-af63643285bf?w=1200&h=800&fit=crop',
  ],
  'Default': [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=1200&h=800&fit=crop',
  ]
};

async function fixImageUrls() {
  try {
    console.log('🔍 Finding all listings...\n');
    
    const listings = await prisma.listing.findMany({
      select: {
        id: true,
        title: true,
        category: true,
        imageSrc: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    console.log(`Found ${listings.length} listings\n`);

    const categoryCounters = {};

    let updated = 0;
    for (const listing of listings) {
      const category = listing.category || 'Default';
      
      // Initialize counter for this category
      if (!categoryCounters[category]) {
        categoryCounters[category] = 0;
      }

      // Get images array for this category
      const images = stableImages[category] || stableImages['Default'];
      
      // Get image using counter (cycle through available images)
      const imageIndex = categoryCounters[category] % images.length;
      const newImageUrl = images[imageIndex];
      
      // Increment counter
      categoryCounters[category]++;

      await prisma.listing.update({
        where: { id: listing.id },
        data: { imageSrc: newImageUrl }
      });

      console.log(`✅ Updated: ${listing.title.substring(0, 60)}...`);
      console.log(`   Category: ${category}`);
      console.log(`   Image: ${newImageUrl}`);
      console.log('');
      
      updated++;
    }

    console.log(`\n🎉 Successfully updated ${updated} listings!`);
    console.log('All listings now have stable, high-quality Unsplash images.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

fixImageUrls();
