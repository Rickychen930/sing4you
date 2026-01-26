import dotenv from 'dotenv';
import { Database } from '../config/database';
import { HeroSettingsModel } from '../models/HeroSettingsModel';
import { SectionModel } from '../models/SectionModel';
import { PerformanceModel } from '../models/PerformanceModel';
import { TestimonialModel } from '../models/TestimonialModel';
import { SEOSettingsModel } from '../models/SEOSettingsModel';
import { AdminUserModel } from '../models/AdminUserModel';
import { CategoryModel } from '../models/CategoryModel';
import { VariationModel } from '../models/VariationModel';
import { MediaModel } from '../models/MediaModel';
// Note: bcrypt is not needed here - AdminUserModel pre-save hook handles password hashing

dotenv.config();

export const seedDatabase = async (): Promise<void> => {
  try {
    // Connect to database
    const dbUri = process.env.MONGODB_URI || 'mongodb+srv://sings4you:<db_password>@sings4you.qahkyi2.mongodb.net/christinasings4u';
    
    if (dbUri.includes('<db_password>')) {
      console.error('❌ Please set MONGODB_URI in .env file!');
      process.exit(1);
    }

    const database = Database.getInstance();
    await database.connect(dbUri);
    console.log('✅ Connected to MongoDB');
    
    // Wait a bit to ensure connection is stable
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🗑️  Clearing existing data...');
    await HeroSettingsModel.getModel().deleteMany({});
    await SectionModel.getModel().deleteMany({});
    await PerformanceModel.getModel().deleteMany({});
    await TestimonialModel.getModel().deleteMany({});
    await SEOSettingsModel.getModel().deleteMany({});
    await MediaModel.getModel().deleteMany({});
    await VariationModel.getModel().deleteMany({});
    await CategoryModel.getModel().deleteMany({});
    // Don't delete admin users

    // 1. Hero Settings
    console.log('📝 Seeding Hero Settings...');
    await HeroSettingsModel.getModel().create({
      title: 'Christina Sings4U',
      subtitle: 'Professional Singer for Your Special Occasions',
      backgroundImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920&h=1080&fit=crop',
      ctaWhatsApp: {
        text: 'Book via WhatsApp',
        link: 'https://wa.me/61410606328',
      },
      ctaEmail: {
        text: 'Contact via Email',
        link: 'mailto:bookings@christinasings4u.com.au',
      },
    });
    console.log('✅ Hero Settings created');

    // 2. Performance Sections
    console.log('📝 Seeding Performance Sections...');
    const sections = await SectionModel.getModel().create([
      {
        title: 'Solo Performances',
        slug: 'solo-performances',
        description: 'Experience the power and beauty of a single voice. Perfect for intimate gatherings, cocktail parties, and small events.',
        type: 'solo',
        media: [
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=600&fit=crop',
        ],
        priceRange: '$500 - $1,500',
      },
      {
        title: 'Duo Performances',
        slug: 'duo-performances',
        description: 'Harmonious duets that bring magic to your event. Two voices creating unforgettable moments.',
        type: 'duo',
        media: [
          'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&h=600&fit=crop',
        ],
        priceRange: '$800 - $2,000',
      },
      {
        title: 'Wedding Ceremonies',
        slug: 'wedding-ceremonies',
        description: 'Make your special day unforgettable with beautiful wedding songs. From ceremony to reception, I\'ll help create magical moments.',
        type: 'wedding',
        media: [
          'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&h=600&fit=crop',
        ],
        priceRange: '$1,200 - $3,000',
      },
      {
        title: 'Corporate Events',
        slug: 'corporate-events',
        description: 'Professional performances for corporate gatherings, product launches, and business events.',
        type: 'corporate',
        media: [
          'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop',
        ],
        priceRange: '$1,000 - $2,500',
      },
    ]);
    console.log(`✅ Created ${sections.length} performance sections`);

    // 3. Upcoming Performances
    console.log('📝 Seeding Upcoming Performances...');
    const performances = await PerformanceModel.getModel().create([
      {
        eventName: 'Jazz Night at Opera Bar',
        venueName: 'Opera Bar Sydney',
        city: 'Sydney',
        state: 'NSW',
        date: new Date('2024-02-15'),
        time: '19:00',
        ticketLink: 'https://example.com/tickets',
      },
      {
        eventName: 'Wedding Showcase Event',
        venueName: 'Royal Botanic Gardens',
        city: 'Sydney',
        state: 'NSW',
        date: new Date('2024-02-20'),
        time: '16:00',
      },
      {
        eventName: 'Corporate Gala Dinner',
        venueName: 'Sydney Harbour Yacht Club',
        city: 'Sydney',
        state: 'NSW',
        date: new Date('2024-03-01'),
        time: '18:30',
      },
    ]);
    console.log(`✅ Created ${performances.length} upcoming performances`);

    // 4. Testimonials
    console.log('📝 Seeding Testimonials...');
    const testimonials = await TestimonialModel.getModel().create([
      {
        clientName: 'Sarah & Michael Thompson',
        eventType: 'Wedding',
        message: 'Christina made our wedding day absolutely perfect! Her voice is incredible and she performed our favorite songs beautifully. Highly recommended!',
        rating: 5,
      },
      {
        clientName: 'James Wilson',
        eventType: 'Corporate Event',
        message: 'Professional, punctual, and exceptionally talented. Our corporate event was a huge success thanks to Christina\'s performance.',
        rating: 5,
      },
      {
        clientName: 'Emma Rodriguez',
        eventType: 'Birthday Party',
        message: 'What an amazing voice! Christina brought so much joy to our celebration. Everyone was impressed!',
        rating: 5,
      },
      {
        clientName: 'David Chen',
        eventType: 'Anniversary',
        message: 'The perfect choice for our 25th anniversary celebration. Christina\'s performance was elegant and heartfelt.',
        rating: 5,
      },
      {
        clientName: 'Lisa & John Mitchell',
        eventType: 'Wedding',
        message: 'Absolutely magical! Christina performed our ceremony and reception, and it was everything we dreamed of.',
        rating: 5,
      },
    ]);
    console.log(`✅ Created ${testimonials.length} testimonials`);

    // 5. Categories
    console.log('📝 Seeding Categories...');
    const categories = await CategoryModel.getModel().create([
      {
        name: 'Solo Performances',
        description: 'Experience the power and beauty of a single voice. Perfect for intimate gatherings, cocktail parties, and small events.',
        order: 1,
      },
      {
        name: 'Duo Performances',
        description: 'Harmonious duets that bring magic to your event. Two voices creating unforgettable moments.',
        order: 2,
      },
      {
        name: 'Wedding Ceremonies',
        description: 'Make your special day unforgettable with beautiful wedding songs. From ceremony to reception, I\'ll help create magical moments.',
        order: 3,
      },
      {
        name: 'Corporate Events',
        description: 'Professional performances for corporate gatherings, product launches, and business events.',
        order: 4,
      },
      {
        name: 'PocketRocker',
        description: 'Compact and powerful performances perfect for smaller venues and intimate settings.',
        order: 5,
      },
    ]);
    console.log(`✅ Created ${categories.length} categories`);

    // 6. Variations (linked to Categories)
    console.log('📝 Seeding Variations...');
    const variations = await VariationModel.getModel().create([
      // Solo Performances variations
      {
        categoryId: categories[0]._id,
        name: 'Acoustic Solo',
        shortDescription: 'Intimate acoustic performances with guitar accompaniment.',
        longDescription: 'Perfect for small gatherings and intimate settings. Christina performs beautiful acoustic renditions of your favorite songs with live guitar accompaniment. Ideal for cocktail parties, private dinners, and cozy events.',
        slug: 'acoustic-solo',
        order: 1,
      },
      {
        categoryId: categories[0]._id,
        name: 'Jazz Standards',
        shortDescription: 'Classic jazz standards and timeless favorites.',
        longDescription: 'Experience the elegance of jazz with Christina\'s renditions of classic standards. From "Summertime" to "Fly Me to the Moon", these timeless favorites bring sophistication to any event.',
        slug: 'jazz-standards-solo',
        order: 2,
      },
      {
        categoryId: categories[0]._id,
        name: 'Contemporary Pop',
        shortDescription: 'Modern pop hits and chart-topping favorites.',
        longDescription: 'From Adele to Ed Sheeran, Christina brings contemporary pop hits to life with her powerful and emotive voice. Perfect for events that want a modern, energetic vibe.',
        slug: 'contemporary-pop-solo',
        order: 3,
      },
      // Duo Performances variations
      {
        categoryId: categories[1]._id,
        name: 'Vocal Duet',
        shortDescription: 'Beautiful harmonies with a second vocalist.',
        longDescription: 'Two voices creating magical harmonies. Perfect for events that want the richness of multiple voices while maintaining an intimate feel. Great for ceremonies and special moments.',
        slug: 'vocal-duet',
        order: 1,
      },
      {
        categoryId: categories[1]._id,
        name: 'Singer & Guitarist',
        shortDescription: 'Vocals paired with live guitar accompaniment.',
        longDescription: 'Christina performs alongside a talented guitarist, creating a full and rich sound perfect for both intimate and larger gatherings. The combination of voice and guitar brings warmth and authenticity to any event.',
        slug: 'singer-guitarist-duo',
        order: 2,
      },
      // Wedding Ceremonies variations
      {
        categoryId: categories[2]._id,
        name: 'Ceremony Performance',
        shortDescription: 'Beautiful songs for your wedding ceremony.',
        longDescription: 'Make your wedding ceremony unforgettable with carefully selected songs performed live. From the processional to the recessional, Christina will help create the perfect musical backdrop for your special day.',
        slug: 'wedding-ceremony',
        order: 1,
      },
      {
        categoryId: categories[2]._id,
        name: 'Reception Entertainment',
        shortDescription: 'Live music for your wedding reception.',
        longDescription: 'Keep your guests entertained throughout the reception with live performances. From background music during dinner to upbeat songs for dancing, Christina adapts to create the perfect atmosphere for your celebration.',
        slug: 'wedding-reception',
        order: 2,
      },
      {
        categoryId: categories[2]._id,
        name: 'Full Wedding Package',
        shortDescription: 'Complete musical coverage for your entire wedding day.',
        longDescription: 'The ultimate wedding experience. Christina performs at both your ceremony and reception, ensuring seamless musical coverage throughout your entire special day. Includes consultation to select the perfect songs for each moment.',
        slug: 'full-wedding-package',
        order: 3,
      },
      // Corporate Events variations
      {
        categoryId: categories[3]._id,
        name: 'Product Launch',
        shortDescription: 'Professional performances for product launches.',
        longDescription: 'Add excitement and energy to your product launch with live musical performances. Christina can perform during presentations, networking sessions, or as featured entertainment to make your event memorable.',
        slug: 'product-launch',
        order: 1,
      },
      {
        categoryId: categories[3]._id,
        name: 'Corporate Gala',
        shortDescription: 'Elegant entertainment for corporate galas and dinners.',
        longDescription: 'Elevate your corporate gala with sophisticated live performances. Perfect for award ceremonies, annual dinners, and formal corporate events where you want to impress clients and employees.',
        slug: 'corporate-gala',
        order: 2,
      },
      {
        categoryId: categories[3]._id,
        name: 'Networking Event',
        shortDescription: 'Background music for corporate networking events.',
        longDescription: 'Create the perfect atmosphere for networking with live background music. Christina provides elegant, non-intrusive performances that enhance conversation while adding a touch of sophistication to your event.',
        slug: 'networking-event',
        order: 3,
      },
      // PocketRocker variations
      {
        categoryId: categories[4]._id,
        name: 'Compact Setup',
        shortDescription: 'Portable performance setup for smaller venues.',
        longDescription: 'Perfect for venues with limited space. The PocketRocker setup includes everything needed for a professional performance in a compact, portable format. Ideal for cafes, small restaurants, and intimate venues.',
        slug: 'compact-setup',
        order: 1,
      },
      {
        categoryId: categories[4]._id,
        name: 'Intimate Acoustic',
        shortDescription: 'Acoustic performances for intimate settings.',
        longDescription: 'A stripped-down, intimate acoustic performance perfect for small gatherings. No large equipment needed - just beautiful vocals and acoustic accompaniment that creates an authentic, personal experience.',
        slug: 'intimate-acoustic',
        order: 2,
      },
    ]);
    console.log(`✅ Created ${variations.length} variations`);

    // 7. Media (linked to Variations)
    console.log('📝 Seeding Media...');
    const mediaItems = [];
    
    // Media for Acoustic Solo
    mediaItems.push(
      {
        variationId: variations[0]._id,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
        order: 1,
      },
      {
        variationId: variations[0]._id,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=600&fit=crop',
        order: 2,
      }
    );

    // Media for Jazz Standards
    mediaItems.push(
      {
        variationId: variations[1]._id,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
        order: 1,
      }
    );

    // Media for Contemporary Pop
    mediaItems.push(
      {
        variationId: variations[2]._id,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&h=600&fit=crop',
        order: 1,
      }
    );

    // Media for Vocal Duet
    mediaItems.push(
      {
        variationId: variations[3]._id,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&h=600&fit=crop',
        order: 1,
      }
    );

    // Media for Singer & Guitarist
    mediaItems.push(
      {
        variationId: variations[4]._id,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
        order: 1,
      }
    );

    // Media for Wedding Ceremony
    mediaItems.push(
      {
        variationId: variations[5]._id,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop',
        order: 1,
      },
      {
        variationId: variations[5]._id,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&h=600&fit=crop',
        order: 2,
      }
    );

    // Media for Wedding Reception
    mediaItems.push(
      {
        variationId: variations[6]._id,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop',
        order: 1,
      }
    );

    // Media for Full Wedding Package
    mediaItems.push(
      {
        variationId: variations[7]._id,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&h=600&fit=crop',
        order: 1,
      },
      {
        variationId: variations[7]._id,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop',
        order: 2,
      }
    );

    // Media for Product Launch
    mediaItems.push(
      {
        variationId: variations[8]._id,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop',
        order: 1,
      }
    );

    // Media for Corporate Gala
    mediaItems.push(
      {
        variationId: variations[9]._id,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop',
        order: 1,
      }
    );

    // Media for Networking Event
    mediaItems.push(
      {
        variationId: variations[10]._id,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop',
        order: 1,
      }
    );

    // Media for Compact Setup
    mediaItems.push(
      {
        variationId: variations[11]._id,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
        order: 1,
      }
    );

    // Media for Intimate Acoustic
    mediaItems.push(
      {
        variationId: variations[12]._id,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=600&fit=crop',
        order: 1,
      }
    );

    const createdMedia = await MediaModel.getModel().create(mediaItems);
    console.log(`✅ Created ${createdMedia.length} media items`);

    // 8. SEO Settings
    console.log('📝 Seeding SEO Settings...');
    await SEOSettingsModel.getModel().create({
      defaultTitle: 'Christina Sings4U | Professional Singer in Sydney',
      defaultDescription: 'Professional singer offering elegant live vocals for weddings, corporate events, and private occasions in Sydney, NSW.',
      defaultImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=630&fit=crop',
      siteUrl: 'https://christina-sings4you.com.au',
      contactEmail: 'bookings@christinasings4u.com.au',
      contactPhone: '+61410606328',
      socialMedia: {
        facebook: 'https://www.facebook.com/christinasings4u/',
        twitter: 'https://x.com/christinasingss',
        instagram: 'https://www.instagram.com/_christinasings4u_/',
        youtube: 'https://www.youtube.com/channel/UCqcGJFQYlYNCmEljLBGK3ZA',
      },
    });
    console.log('✅ SEO Settings created');

    // 9. Admin User (only if no admin exists)
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@christinasings4u.com.au';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'; // Default password for development
    
    if (!adminPassword || adminPassword === 'admin123') {
      console.warn('⚠️  WARNING: Using default password "admin123"');
      console.warn('   Please set ADMIN_PASSWORD in .env file for production!');
    }
    
    const existingAdmin = await AdminUserModel.getModel().findOne({ email: adminEmail });
    if (!existingAdmin) {
      console.log(`📝 Creating default admin user (email: ${adminEmail})...`);
      // Don't hash password here - the pre-save hook in AdminUserModel will handle it
      await AdminUserModel.getModel().create({
        email: adminEmail,
        password: adminPassword, // Plain password - will be hashed by pre-save hook
        name: 'Admin User',
      });
      console.log(`✅ Admin user created (email: ${adminEmail})`);
      console.log(`   Password: ${adminPassword === 'admin123' ? 'admin123 (default - please change!)' : '***'}`);
    } else {
      console.log(`ℹ️  Admin user already exists (email: ${adminEmail})`);
      // Optionally update password if ADMIN_PASSWORD is set
      if (process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD !== 'admin123') {
        const adminUser = await AdminUserModel.getModel().findOne({ email: adminEmail });
        if (adminUser) {
          console.log('🔧 Updating admin password...');
          adminUser.password = adminPassword; // Will be hashed correctly by pre-save hook
          await adminUser.save();
          console.log('✅ Admin password updated (correctly hashed)');
        }
      }
    }

    console.log('\n🎉 Seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Hero Settings: 1`);
    console.log(`   - Performance Sections: ${sections.length}`);
    console.log(`   - Upcoming Performances: ${performances.length}`);
    console.log(`   - Testimonials: ${testimonials.length}`);
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Variations: ${variations.length}`);
    console.log(`   - Media Items: ${createdMedia.length}`);
    console.log(`   - SEO Settings: 1`);
    console.log('\n🌐 You can now view the website at http://localhost:5173');

    // Don't exit if called from server (auto-seed mode)
    if (process.env.AUTO_SEED !== 'true') {
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    if (process.env.AUTO_SEED !== 'true') {
      process.exit(1);
    }
    throw error; // Re-throw if called from server
  }
};

// Only run directly if this file is executed (not imported)
// Check if this script is being run directly by checking if it's the main module
const runAsScript = () => {
  // In ES modules, we check if this file is being executed directly
  // by comparing the import.meta.url with the process.argv[1]
  const filePath = new URL(import.meta.url).pathname;
  const scriptPath = process.argv[1];
  
  // Check if the script path matches our file path
  return scriptPath && (
    scriptPath.includes('seed.ts') || 
    scriptPath.includes('seed.js') ||
    filePath.includes('seed')
  );
};

if (runAsScript()) {
  seedDatabase();
}