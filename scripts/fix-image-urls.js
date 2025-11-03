const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Map of event categories to relevant Unsplash search terms
const categoryImageMap = {
  'Photoshoot': 'studio photography space',
  'Meeting': 'modern meeting room office',
  'Party': 'party venue celebration space',
  'Workshop': 'workshop classroom training room',
  'Wedding': 'elegant wedding venue ballroom',
  'Corporate Event': 'corporate event conference room',
  'Film Production': 'film studio production space',
  'Popup Shop': 'retail popup shop space',
  'Rehearsal': 'rehearsal practice studio',
  'Podcast': 'podcast recording studio',
  'Social Event': 'social event gathering space',
  'Fitness': 'fitness studio gym space',
  'Art Gallery': 'art gallery exhibition space',
  'Conference': 'conference hall auditorium',
  'Product Launch': 'modern event space venue'
};

async function fixImageUrls() {
  try {
    console.log('🔍 Finding all listings with Peerspace image URLs...\n');
    
    const listings = await prisma.listing.findMany({
      where: {
        imageSrc: {
          contains: 'peerspace'
        }
      },
      select: {
        id: true,
        title: true,
        category: true,
        imageSrc: true
      }
    });

    console.log(`Found ${listings.length} listings with Peerspace URLs\n`);

    let updated = 0;
    for (const listing of listings) {
      // Get search term for this category, default to generic event space
      const searchTerm = categoryImageMap[listing.category] || 'event space venue';
      
      // Use Unsplash Source API with specific dimensions and search term
      // This provides random high-quality images without authentication
      const newImageUrl = `https://source.unsplash.com/1200x800/?${encodeURIComponent(searchTerm)}`;
      
      await prisma.listing.update({
        where: { id: listing.id },
        data: { imageSrc: newImageUrl }
      });

      console.log(`✅ Updated: ${listing.title}`);
      console.log(`   Old: ${listing.imageSrc.substring(0, 80)}...`);
      console.log(`   New: ${newImageUrl}`);
      console.log('');
      
      updated++;
    }

    console.log(`\n🎉 Successfully updated ${updated} listings!`);
    console.log('All Peerspace image URLs have been replaced with Unsplash images.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

fixImageUrls();
