import type {
  IHeroSettings,
  ISection,
  IPerformance,
  ITestimonial,
  IBlogPost,
  ISEOSettings,
} from '../../shared/interfaces';
import {
  mockHeroSettings,
  mockSections,
  mockPerformances,
  mockTestimonials,
  mockBlogPosts,
  mockSEOSettings,
} from '../data/mockData';

export class MockDataService {
  // In-memory storage for mock data (simulates database)
  private static heroSettings: IHeroSettings = { ...mockHeroSettings };
  private static sections: ISection[] = [...mockSections];
  private static performances: IPerformance[] = [...mockPerformances];
  private static testimonials: ITestimonial[] = [...mockTestimonials];
  private static blogPosts: IBlogPost[] = [...mockBlogPosts];
  private static seoSettings: ISEOSettings = { ...mockSEOSettings };

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
    return [...this.performances];
  }

  static getUpcomingPerformances(): IPerformance[] {
    const now = new Date();
    return this.performances
      .filter(p => new Date(p.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  static getPerformanceById(id: string): IPerformance | null {
    return this.performances.find(p => p._id === id) || null;
  }

  static createPerformance(data: Partial<IPerformance>): IPerformance {
    const newPerformance: IPerformance = {
      _id: Date.now().toString(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as IPerformance;
    this.performances.push(newPerformance);
    return { ...newPerformance };
  }

  static updatePerformance(id: string, data: Partial<IPerformance>): IPerformance | null {
    const index = this.performances.findIndex(p => p._id === id);
    if (index === -1) return null;
    this.performances[index] = {
      ...this.performances[index],
      ...data,
      updatedAt: new Date(),
    };
    return { ...this.performances[index] };
  }

  static deletePerformance(id: string): boolean {
    const index = this.performances.findIndex(p => p._id === id);
    if (index === -1) return false;
    this.performances.splice(index, 1);
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

  // Blog Posts
  static getAllBlogPosts(): IBlogPost[] {
    return [...this.blogPosts];
  }

  static getPublishedBlogPosts(): IBlogPost[] {
    const now = new Date();
    return this.blogPosts
      .filter(p => p.publishedAt && new Date(p.publishedAt) <= now)
      .sort((a, b) => {
        const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        return dateB - dateA;
      });
  }

  static getBlogPostById(id: string): IBlogPost | null {
    return this.blogPosts.find(p => p._id === id) || null;
  }

  static getBlogPostBySlug(slug: string): IBlogPost | null {
    return this.blogPosts.find(p => p.slug === slug) || null;
  }

  static createBlogPost(data: Partial<IBlogPost>): IBlogPost {
    const newPost: IBlogPost = {
      _id: Date.now().toString(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as IBlogPost;
    this.blogPosts.push(newPost);
    return { ...newPost };
  }

  static updateBlogPost(id: string, data: Partial<IBlogPost>): IBlogPost | null {
    const index = this.blogPosts.findIndex(p => p._id === id);
    if (index === -1) return null;
    this.blogPosts[index] = {
      ...this.blogPosts[index],
      ...data,
      updatedAt: new Date(),
    };
    return { ...this.blogPosts[index] };
  }

  static deleteBlogPost(id: string): boolean {
    const index = this.blogPosts.findIndex(p => p._id === id);
    if (index === -1) return false;
    this.blogPosts.splice(index, 1);
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
