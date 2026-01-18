import type {
  IHeroSettings,
  ISection,
  IPerformance,
  ITestimonial,
  IBlogPost,
  ISEOSettings,
} from '../../shared/interfaces';

export const mockHeroSettings: IHeroSettings = {
  title: 'Christina Sings4U',
  subtitle: 'Professional Singer | Sydney, Australia',
  backgroundImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920',
  backgroundVideo: '',
  ctaWhatsApp: {
    text: 'Book via WhatsApp',
    link: 'https://wa.me/61400000000',
  },
  ctaEmail: {
    text: 'Send Email',
    link: 'mailto:christina@sings4u.com.au',
  },
};

export const mockSections: ISection[] = [
  {
    _id: '1',
    title: 'Solo Performances',
    slug: 'solo-performances',
    description: 'Captivating solo performances that bring your event to life with powerful vocals and engaging stage presence.',
    type: 'solo',
    media: [
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
      'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800',
    ],
    audioSamples: [],
    priceRange: '$500 - $1,000',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '2',
    title: 'Duo Performances',
    slug: 'duo-performances',
    description: 'Harmonious duo performances perfect for intimate gatherings and special occasions.',
    type: 'duo',
    media: [
      'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800',
    ],
    audioSamples: [],
    priceRange: '$800 - $1,500',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '3',
    title: 'Wedding Performances',
    slug: 'wedding-performances',
    description: 'Make your special day unforgettable with beautiful wedding performances tailored to your love story.',
    type: 'wedding',
    media: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
    ],
    audioSamples: [],
    priceRange: '$1,000 - $2,500',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '4',
    title: 'Corporate Events',
    slug: 'corporate-events',
    description: 'Professional performances for corporate events, conferences, and business gatherings.',
    type: 'corporate',
    media: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    ],
    audioSamples: [],
    priceRange: '$1,500 - $3,000',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const mockPerformances: IPerformance[] = [
  {
    _id: '1',
    eventName: 'Summer Music Festival',
    venueName: 'Sydney Opera House',
    city: 'Sydney',
    state: 'NSW',
    date: new Date('2025-02-15'),
    time: '19:00',
    ticketLink: 'https://example.com/tickets',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '2',
    eventName: 'Jazz Night',
    venueName: 'The Basement',
    city: 'Sydney',
    state: 'NSW',
    date: new Date('2025-02-22'),
    time: '20:00',
    ticketLink: 'https://example.com/tickets',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '3',
    eventName: 'Wedding Reception',
    venueName: 'Harbour View Venue',
    city: 'Sydney',
    state: 'NSW',
    date: new Date('2025-03-01'),
    time: '18:00',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const mockTestimonials: ITestimonial[] = [
  {
    _id: '1',
    clientName: 'Sarah & John',
    eventType: 'Wedding',
    message: 'Christina made our wedding day absolutely magical! Her voice is incredible and she was so professional. Highly recommend!',
    rating: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '2',
    clientName: 'Corporate Events Inc.',
    eventType: 'Corporate',
    message: 'Perfect performance for our annual conference. Christina was professional, punctual, and delivered an outstanding show.',
    rating: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '3',
    clientName: 'Michael Thompson',
    eventType: 'Private Event',
    message: 'Amazing talent! Christina brought so much energy to our event. Everyone was impressed.',
    rating: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '4',
    clientName: 'Emma Wilson',
    eventType: 'Wedding',
    message: 'Best decision we made for our wedding! Christina\'s performance was the highlight of the evening.',
    rating: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const mockBlogPosts: IBlogPost[] = [
  {
    _id: '1',
    title: 'Tips for Choosing the Perfect Wedding Singer',
    slug: 'tips-choosing-perfect-wedding-singer',
    content: `
      <h2>Finding Your Perfect Wedding Singer</h2>
      <p>Your wedding day is one of the most important days of your life, and the right music can make it truly unforgettable. Here are some tips for choosing the perfect wedding singer:</p>
      <h3>1. Consider Your Style</h3>
      <p>Think about the atmosphere you want to create. Do you prefer classic ballads, upbeat pop songs, or something more unique?</p>
      <h3>2. Listen to Samples</h3>
      <p>Always listen to audio samples or watch videos of potential performers to ensure their style matches your vision.</p>
      <h3>3. Check Availability</h3>
      <p>Popular singers book up quickly, especially during wedding season. Book early to secure your date.</p>
      <h3>4. Discuss Your Vision</h3>
      <p>Have a conversation with your potential singer about your vision, song choices, and any special requests.</p>
    `,
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200',
    tags: ['wedding', 'tips', 'music'],
    category: 'Wedding',
    publishedAt: new Date('2025-01-10'),
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-01-10'),
  },
  {
    _id: '2',
    title: 'The Art of Live Performance',
    slug: 'art-of-live-performance',
    content: `
      <h2>The Art of Live Performance</h2>
      <p>Live performance is an art form that combines talent, preparation, and connection with the audience. Here's what makes a great live performance:</p>
      <h3>1. Preparation</h3>
      <p>Thorough preparation is key. This includes vocal warm-ups, knowing your material inside and out, and being ready for the unexpected.</p>
      <h3>2. Stage Presence</h3>
      <p>Connecting with your audience through eye contact, movement, and energy creates an unforgettable experience.</p>
      <h3>3. Adaptability</h3>
      <p>Every performance is unique. Being able to adapt to the venue, audience, and atmosphere is crucial.</p>
    `,
    coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200',
    tags: ['performance', 'music', 'tips'],
    category: 'Music',
    publishedAt: new Date('2025-01-05'),
    createdAt: new Date('2025-01-05'),
    updatedAt: new Date('2025-01-05'),
  },
];

export const mockSEOSettings: ISEOSettings = {
  defaultTitle: 'Christina Sings4U | Professional Singer in Sydney',
  defaultDescription: 'Professional singer available for weddings, corporate events, and private performances in Sydney, Australia.',
  defaultImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200',
  siteUrl: 'https://christinasings4u.com.au',
};
