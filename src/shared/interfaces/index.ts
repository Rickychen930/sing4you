// Shared interfaces for frontend and backend

export interface IHeroSettings {
  title: string;
  subtitle: string;
  backgroundImage?: string;
  backgroundVideo?: string;
  /**
   * Background image vertical position.
   * Allows fine-tuning how the hero background is framed.
   * Defaults to 'center' when not set.
   */
  backgroundPosition?: 'top' | 'center' | 'bottom';
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
  description?: string; // Detailed description of the performance
  featuredImage?: string; // Main/hero image for the performance
  media?: string[]; // Gallery of images/videos from the performance
  categoryId?: string;
  variationId?: string;
  /** Populated category (from API) */
  category?: ICategory;
  /** Populated variation (from API) */
  variation?: IVariation;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPerformancePaginated {
  data: IPerformance[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
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


export interface ISEOSettings {
  defaultTitle: string;
  defaultDescription: string;
  defaultImage: string;
  siteUrl: string;
  contactEmail?: string;
  contactPhone?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  slug?: string; // URL-friendly identifier
  description?: string;
  type?: 'solo' | 'duo' | 'trio' | 'band' | 'wedding' | 'corporate' | 'other' | 'pocketrocker'; // Performance type
  featuredImage?: string; // Featured/hero image for the category card
  media?: string[]; // Array of image/video URLs
  audioSamples?: string[]; // Array of audio sample URLs
  priceRange?: string; // Price range display (e.g., "$500 - $1,500")
  order?: number; // Display order
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
  featuredImage?: string; // Featured/hero image for the variation
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

export interface IAboutPageSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroBackgroundImage?: string;
  heroBackgroundVideo?: string;
  storyTitle: string;
  storyContent: string;
  galleryImages: string[];
  ctaTitle: string;
  ctaDescription: string;
}

export interface IFAQ {
  _id?: string;
  question: string;
  answer: string;
  order?: number; // Display order
  isActive?: boolean; // Show/hide FAQ
  createdAt?: Date;
  updatedAt?: Date;
}

// --- Client & Communications (tracking) ---

export type ClientSource = 'contact_form' | 'manual';
export type ClientStatus = 'lead' | 'contacted' | 'quoted' | 'confirmed' | 'cancelled' | 'completed';

export interface IClient {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  eventType?: string;
  eventDate?: string;
  location?: string;
  message?: string;
  source: ClientSource;
  status: ClientStatus;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type CommunicationType = 'email' | 'note';
export type CommunicationStatus = 'pending_reply' | 'replied' | 'confirmed' | 'cancelled' | 'no_response';

export interface IClientCommunication {
  _id?: string;
  clientId: string;
  type: CommunicationType;
  subject?: string;
  body?: string;
  sentAt: Date;
  status: CommunicationStatus;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// --- Australian Tax Invoice ---

export interface IInvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number; // AUD
  gstIncluded?: boolean; // if true, unitPrice includes GST
}

export interface IInvoice {
  _id?: string;
  invoiceNumber: string;
  /** Australian Tax Invoice - title */
  title?: string; // default "Tax Invoice"
  /** Issue date */
  issueDate: Date;
  dueDate?: Date;
  /** Your business details (Australia) */
  businessName: string;
  abn: string;
  businessAddress?: string;
  /** Bill to (client) */
  clientId?: string;
  clientName: string;
  clientAddress?: string;
  clientEmail?: string;
  /** Line items */
  items: IInvoiceLineItem[];
  /** GST rate e.g. 0.1 for 10% */
  gstRate?: number;
  /** Subtotal (ex GST), GST amount, Total (inc GST) - can be auto-calculated */
  subtotal?: number;
  gstAmount?: number;
  total?: number;
  /** Payment terms, notes */
  paymentTerms?: string;
  notes?: string;
  status?: 'draft' | 'sent' | 'paid' | 'overdue';
  createdAt?: Date;
  updatedAt?: Date;
}