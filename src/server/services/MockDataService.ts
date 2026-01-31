import type {
  IHeroSettings,
  ISection,
  IPerformance,
  ITestimonial,
  ISEOSettings,
  IAboutPageSettings,
} from '../../shared/interfaces';
import {
  mockHeroSettings,
  mockSections,
  mockPerformancesBase,
  mockTestimonials,
  mockSEOSettings,
} from '../data/mockData';

export class MockDataService {
  // In-memory storage for mock data (simulates database)
  private static heroSettings: IHeroSettings = { ...mockHeroSettings };
  private static sections: ISection[] = [...mockSections];
  // Mutable copy of performances base for create/update/delete operations
  private static performancesBase: Array<Omit<IPerformance, 'date'> & { daysOffset: number }> = [...mockPerformancesBase];
  private static testimonials: ITestimonial[] = [...mockTestimonials];
  private static seoSettings: ISEOSettings = { ...mockSEOSettings };
  private static aboutPageSettings: IAboutPageSettings = {
    heroTitle: 'About Christina Sings4U',
    heroSubtitle: 'Professional vocalist delivering unforgettable musical experiences',
    storyTitle: 'My Story',
    storyContent: 'Welcome to Christina Sings4U! I am a passionate and dedicated professional singer with years of experience in delivering exceptional musical performances. My journey in music has allowed me to perform at countless weddings, corporate events, and special occasions, bringing joy and creating lasting memories for my clients.\n\nWhether you\'re looking for an intimate solo performance, a dynamic duo or trio, or a full band experience, I am committed to providing you with a musical experience that perfectly matches your vision and exceeds your expectations.\n\nMy repertoire spans across multiple genres, and I specialize in tailoring performances to suit the unique atmosphere and style of your event. From elegant wedding ceremonies to energetic corporate functions, I bring professionalism, talent, and a personal touch to every performance.',
    galleryImages: [],
    ctaTitle: 'Let\'s Create Something Beautiful Together',
    ctaDescription: 'Ready to make your event unforgettable? Get in touch to discuss your musical needs and let\'s bring your vision to life.',
  };

  // Helper to get date X days from now
  private static getDateFromNow(days: number): Date {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  }

  // Hero Settings
  static getHeroSettings(): IHeroSettings {
    return { ...this.heroSettings };
  }

  static updateHeroSettings(data: Partial<IHeroSettings>): IHeroSettings {
    this.heroSettings = { ...this.heroSettings, ...data };
    return { ...this.heroSettings };
  }

  // Sections
  static getAllSections(): ISection[] {
    return [...this.sections];
  }

  static getSectionById(id: string): ISection | null {
    return this.sections.find(s => s._id === id) || null;
  }

  static getSectionBySlug(slug: string): ISection | null {
    return this.sections.find(s => s.slug === slug) || null;
  }

  static getSectionsByType(type: string): ISection[] {
    return this.sections.filter(s => s.type === type);
  }

  static createSection(data: Partial<ISection>): ISection {
    const newSection: ISection = {
      _id: Date.now().toString(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as ISection;
    this.sections.push(newSection);
    return { ...newSection };
  }

  static updateSection(id: string, data: Partial<ISection>): ISection | null {
    const index = this.sections.findIndex(s => s._id === id);
    if (index === -1) return null;
    this.sections[index] = {
      ...this.sections[index],
      ...data,
      updatedAt: new Date(),
    };
    return { ...this.sections[index] };
  }

  static deleteSection(id: string): boolean {
    const index = this.sections.findIndex(s => s._id === id);
    if (index === -1) return false;
    this.sections.splice(index, 1);
    return true;
  }

  // Performances — all, sorted newest first (date desc)
  static getAllPerformances(): IPerformance[] {
    return this.performancesBase
      .map(p => {
        const { daysOffset, ...performance } = p;
        return {
          ...performance,
          date: this.getDateFromNow(daysOffset),
        } as IPerformance;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  static getPerformancesPaginated(
    page: number = 1,
    limit: number = 9
  ): { data: IPerformance[]; total: number; page: number; limit: number; totalPages: number } {
    const all = this.getAllPerformances();
    const total = all.length;
    const p = Math.max(1, page);
    const l = Math.max(1, Math.min(50, limit));
    const skip = (p - 1) * l;
    const data = all.slice(skip, skip + l);
    const totalPages = Math.ceil(total / l) || 1;
    return { data, total, page: p, limit: l, totalPages };
  }

  static getUpcomingPerformances(): IPerformance[] {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return this.performancesBase
      .map(p => {
        const { daysOffset, ...performance } = p;
        return {
          ...performance,
          date: this.getDateFromNow(daysOffset),
        } as IPerformance;
      })
      .filter(p => new Date(p.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  static getPerformanceById(id: string): IPerformance | null {
    const performanceBase = this.performancesBase.find(p => p._id === id);
    if (!performanceBase) return null;
    
    const { daysOffset, ...performance } = performanceBase;
    return {
      ...performance,
      date: this.getDateFromNow(daysOffset),
    } as IPerformance;
  }

  static createPerformance(data: Partial<IPerformance>): IPerformance {
    // For created performances, use 30 days from now as default
    const defaultDaysOffset = 30;
    // Accept date as Date or ISO string from JSON body
    const rawDate = data.date as unknown;
    const parsedDate = rawDate ? new Date(rawDate as string | number | Date) : this.getDateFromNow(defaultDaysOffset);
    const safeDate = Number.isNaN(parsedDate.getTime()) ? this.getDateFromNow(defaultDaysOffset) : parsedDate;

    // Calculate offset in whole days (based on start-of-day) so "today" works
    const nowStart = new Date();
    nowStart.setHours(0, 0, 0, 0);
    const dateStart = new Date(safeDate);
    dateStart.setHours(0, 0, 0, 0);
    const msPerDay = 1000 * 60 * 60 * 24;
    const daysFromNow = Math.ceil((dateStart.getTime() - nowStart.getTime()) / msPerDay);
    
    const newPerformanceBase = {
      _id: Date.now().toString(),
      daysOffset: Number.isFinite(daysFromNow) ? daysFromNow : defaultDaysOffset,
      eventName: data.eventName || '',
      venueName: data.venueName || '',
      city: data.city || '',
      state: data.state || '',
      time: data.time || '19:00',
      ticketLink: data.ticketLink,
      description: data.description,
      featuredImage: data.featuredImage,
      media: data.media || [],
      categoryId: data.categoryId,
      variationId: data.variationId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // Add to base array for future retrieval
    this.performancesBase.push(newPerformanceBase);
    
    const { daysOffset: offset, ...performance } = newPerformanceBase;
    return {
      ...performance,
      date: this.getDateFromNow(offset),
    } as IPerformance;
  }

  static updatePerformance(id: string, data: Partial<IPerformance>): IPerformance | null {
    const index = this.performancesBase.findIndex(p => p._id === id);
    if (index === -1) return null;
    
    // Update daysOffset if date is provided
    let daysOffset = this.performancesBase[index].daysOffset;
    if (data.date) {
      const parsedDate = new Date(data.date as unknown as string | number | Date);
      if (!Number.isNaN(parsedDate.getTime())) {
        const nowStart = new Date();
        nowStart.setHours(0, 0, 0, 0);
        const dateStart = new Date(parsedDate);
        dateStart.setHours(0, 0, 0, 0);
        const msPerDay = 1000 * 60 * 60 * 24;
        const daysFromNow = Math.ceil((dateStart.getTime() - nowStart.getTime()) / msPerDay);
        if (Number.isFinite(daysFromNow)) {
          daysOffset = daysFromNow;
        }
      }
    }
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { date, ...restData } = data;
    this.performancesBase[index] = {
      ...this.performancesBase[index],
      ...restData,
      daysOffset,
      updatedAt: new Date(),
    };
    
    const { daysOffset: offset, ...performance } = this.performancesBase[index];
    return {
      ...performance,
      date: this.getDateFromNow(offset),
    } as IPerformance;
  }

  static deletePerformance(id: string): boolean {
    const index = this.performancesBase.findIndex(p => p._id === id);
    if (index === -1) return false;
    this.performancesBase.splice(index, 1);
    return true;
  }

  // Testimonials
  static getAllTestimonials(): ITestimonial[] {
    return [...this.testimonials];
  }

  static getTestimonialById(id: string): ITestimonial | null {
    return this.testimonials.find(t => t._id === id) || null;
  }

  static createTestimonial(data: Partial<ITestimonial>): ITestimonial {
    const newTestimonial: ITestimonial = {
      _id: Date.now().toString(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as ITestimonial;
    this.testimonials.push(newTestimonial);
    return { ...newTestimonial };
  }

  static updateTestimonial(id: string, data: Partial<ITestimonial>): ITestimonial | null {
    const index = this.testimonials.findIndex(t => t._id === id);
    if (index === -1) return null;
    this.testimonials[index] = {
      ...this.testimonials[index],
      ...data,
      updatedAt: new Date(),
    };
    return { ...this.testimonials[index] };
  }

  static deleteTestimonial(id: string): boolean {
    const index = this.testimonials.findIndex(t => t._id === id);
    if (index === -1) return false;
    this.testimonials.splice(index, 1);
    return true;
  }

  // SEO Settings
  static getSEOSettings(): ISEOSettings {
    return { ...this.seoSettings };
  }

  static updateSEOSettings(data: Partial<ISEOSettings>): ISEOSettings {
    this.seoSettings = { ...this.seoSettings, ...data };
    return { ...this.seoSettings };
  }

  // About Page Settings
  static getAboutPageSettings(): IAboutPageSettings {
    return { ...this.aboutPageSettings };
  }

  static updateAboutPageSettings(data: Partial<IAboutPageSettings>): IAboutPageSettings {
    this.aboutPageSettings = { ...this.aboutPageSettings, ...data };
    return { ...this.aboutPageSettings };
  }
}
