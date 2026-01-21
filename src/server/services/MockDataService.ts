import type {
  IHeroSettings,
  ISection,
  IPerformance,
  ITestimonial,
  ISEOSettings,
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

  // Performances
  static getAllPerformances(): IPerformance[] {
    // Always return fresh dates based on daysOffset
    return this.performancesBase.map(p => {
      const { daysOffset, ...performance } = p;
      return {
        ...performance,
        date: this.getDateFromNow(daysOffset),
      } as IPerformance;
    });
  }

  static getUpcomingPerformances(): IPerformance[] {
    const now = new Date();
    return this.getAllPerformances()
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
    const daysOffset = 30;
    const date = data.date || this.getDateFromNow(daysOffset);
    const daysFromNow = Math.ceil((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    const newPerformanceBase = {
      _id: Date.now().toString(),
      daysOffset: daysFromNow > 0 ? daysFromNow : 30,
      eventName: data.eventName || '',
      venueName: data.venueName || '',
      city: data.city || '',
      state: data.state || '',
      time: data.time || '19:00',
      ticketLink: data.ticketLink,
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
      const daysFromNow = Math.ceil((new Date(data.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      daysOffset = daysFromNow > 0 ? daysFromNow : 30;
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
}
