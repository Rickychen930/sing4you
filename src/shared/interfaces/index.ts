// Shared interfaces for frontend and backend

export interface IHeroSettings {
  title: string;
  subtitle: string;
  backgroundImage?: string;
  backgroundVideo?: string;
  ctaWhatsApp: {
    text: string;
    link: string;
  };
  ctaEmail: {
    text: string;
    link: string;
  };
}

export interface ISection {
  _id?: string;
  title: string;
  slug: string;
  description: string;
  type: 'solo' | 'duo' | 'trio' | 'band' | 'wedding' | 'corporate' | 'other';
  media: string[];
  audioSamples?: string[];
  priceRange?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPerformance {
  _id?: string;
  eventName: string;
  venueName: string;
  city: string;
  state: string;
  date: Date;
  time: string;
  ticketLink?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITestimonial {
  _id?: string;
  clientName: string;
  eventType: string;
  message: string;
  rating?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBlogPost {
  _id?: string;
  title: string;
  slug: string;
  content: string;
  coverImage?: string;
  tags: string[];
  category: string;
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISEOSettings {
  defaultTitle: string;
  defaultDescription: string;
  defaultImage: string;
  siteUrl: string;
}

export interface IAdminUser {
  _id?: string;
  email: string;
  password: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IContactForm {
  name: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string;
  location: string;
  message: string;
}

export interface IApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface IPaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ICategory {
  _id?: string;
  name: string;
  description?: string;
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IVariation {
  _id?: string;
  categoryId: string | ICategory;
  name: string;
  shortDescription: string;
  longDescription: string;
  slug?: string;
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IMedia {
  _id?: string;
  variationId: string;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}