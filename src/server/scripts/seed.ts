import dotenv from 'dotenv';
import { Database } from '../config/database';
import { HeroSettingsModel } from '../models/HeroSettingsModel';
import { SectionModel } from '../models/SectionModel';
import { PerformanceModel } from '../models/PerformanceModel';
import { TestimonialModel } from '../models/TestimonialModel';
import { BlogPostModel } from '../models/BlogPostModel';
import { SEOSettingsModel } from '../models/SEOSettingsModel';
import { AdminUserModel } from '../models/AdminUserModel';
import bcrypt from 'bcryptjs';

dotenv.config();

const seedDatabase = async (): Promise<void> => {
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

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🗑️  Clearing existing data...');
    await HeroSettingsModel.getModel().deleteMany({});
    await SectionModel.getModel().deleteMany({});
    await PerformanceModel.getModel().deleteMany({});
    await TestimonialModel.getModel().deleteMany({});
    await BlogPostModel.getModel().deleteMany({});
    await SEOSettingsModel.getModel().deleteMany({});
    // Don't delete admin users

    // 1. Hero Settings
    console.log('📝 Seeding Hero Settings...');
    await HeroSettingsModel.getModel().create({
      title: 'Christina Sings4U',
      subtitle: 'Professional Singer for Your Special Occasions',
      backgroundImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920&h=1080&fit=crop',
      ctaWhatsApp: {
        text: 'Book via WhatsApp',
        link: 'https://wa.me/61400000000',
      },
      ctaEmail: {
        text: 'Contact via Email',
        link: 'mailto:hello@christinasings4u.com.au',
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

    // 5. Blog Posts
    console.log('📝 Seeding Blog Posts...');
    const blogPosts = await BlogPostModel.getModel().create([
      {
        title: 'Top 10 Wedding Songs for 2024',
        slug: 'top-10-wedding-songs-2024',
        content: `
# Top 10 Wedding Songs for 2024

Planning your wedding and looking for the perfect songs? Here are the top 10 wedding songs that are trending in 2024.

## 1. All of Me - John Legend
A timeless classic that never goes out of style.

## 2. Perfect - Ed Sheeran
This romantic ballad is perfect for first dances.

## 3. A Thousand Years - Christina Perri
A beautiful song for walking down the aisle.

*And 7 more amazing songs that will make your special day unforgettable!*
        `.trim(),
        category: 'Wedding Tips',
        tags: ['wedding', 'music', 'songs', 'tips'],
        coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=630&fit=crop',
        publishedAt: new Date('2024-01-15'),
      },
      {
        title: 'The Importance of Live Music at Corporate Events',
        slug: 'live-music-corporate-events',
        content: `
# The Importance of Live Music at Corporate Events

Live music can transform your corporate event from ordinary to extraordinary. Here's why it matters:

## Creates the Right Atmosphere
Live music sets the tone for your event and creates a memorable experience for your guests.

## Professional Image
A professional singer demonstrates attention to detail and adds sophistication to your event.

*Learn more about how live music can elevate your corporate gatherings!*
        `.trim(),
        category: 'Corporate',
        tags: ['corporate', 'events', 'business'],
        coverImage: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&h=630&fit=crop',
        publishedAt: new Date('2024-01-10'),
      },
      {
        title: "Sydney's Best Wedding Venues for Music Performances",
        slug: 'sydney-best-wedding-venues',
        content: `
# Sydney's Best Wedding Venues for Music Performances

Discover the most beautiful wedding venues in Sydney that are perfect for live music performances.

## 1. Royal Botanic Gardens
An iconic location with stunning views and acoustics perfect for live music.

## 2. Opera House
What could be more perfect than having your wedding at one of the world's most famous venues?

*Explore more amazing venues in Sydney!*
        `.trim(),
        category: 'Venues',
        tags: ['wedding', 'venues', 'sydney'],
        coverImage: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1200&h=630&fit=crop',
        publishedAt: new Date('2024-01-05'),
      },
    ]);
    console.log(`✅ Created ${blogPosts.length} blog posts`);

    // 6. SEO Settings
    console.log('📝 Seeding SEO Settings...');
    await SEOSettingsModel.getModel().create({
      defaultTitle: 'Christina Sings4U | Professional Singer in Sydney',
      defaultDescription: 'Professional singer offering elegant live vocals for weddings, corporate events, and private occasions in Sydney, NSW.',
      defaultImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=630&fit=crop',
      siteUrl: 'https://christinasings4u.com.au',
    });
    console.log('✅ SEO Settings created');

    // 7. Admin User (only if no admin exists)
    const existingAdmin = await AdminUserModel.getModel().findOne();
    if (!existingAdmin) {
      console.log('📝 Creating default admin user...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await AdminUserModel.getModel().create({
        email: 'admin@christinasings4u.com.au',
        password: hashedPassword,
        name: 'Admin User',
      });
      console.log('✅ Admin user created (email: admin@christinasings4u.com.au, password: admin123)');
    } else {
      console.log('ℹ️  Admin user already exists, skipping...');
    }

    console.log('\n🎉 Seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Hero Settings: 1`);
    console.log(`   - Performance Sections: ${sections.length}`);
    console.log(`   - Upcoming Performances: ${performances.length}`);
    console.log(`   - Testimonials: ${testimonials.length}`);
    console.log(`   - Blog Posts: ${blogPosts.length}`);
    console.log(`   - SEO Settings: 1`);
    console.log('\n🌐 You can now view the website at http://localhost:5173');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();