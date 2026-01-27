import mongoose, { Schema, Model } from 'mongoose';
import type { IAboutPageSettings } from '../../shared/interfaces';

const aboutPageSettingsSchema = new Schema<IAboutPageSettings>(
  {
    heroTitle: {
      type: String,
      required: true,
      default: 'About Christina Sings4U',
    },
    heroSubtitle: {
      type: String,
      required: true,
      default: 'Professional vocalist delivering unforgettable musical experiences',
    },
    heroBackgroundImage: {
      type: String,
    },
    heroBackgroundVideo: {
      type: String,
    },
    storyTitle: {
      type: String,
      required: true,
      default: 'My Story',
    },
    storyContent: {
      type: String,
      required: true,
      default: 'Welcome to Christina Sings4U! I am a passionate and dedicated professional singer with years of experience in delivering exceptional musical performances. My journey in music has allowed me to perform at countless weddings, corporate events, and special occasions, bringing joy and creating lasting memories for my clients.\n\nWhether you\'re looking for an intimate solo performance, a dynamic duo or trio, or a full band experience, I am committed to providing you with a musical experience that perfectly matches your vision and exceeds your expectations.\n\nMy repertoire spans across multiple genres, and I specialize in tailoring performances to suit the unique atmosphere and style of your event. From elegant wedding ceremonies to energetic corporate functions, I bring professionalism, talent, and a personal touch to every performance.',
    },
    galleryImages: {
      type: [String],
      default: [],
    },
    ctaTitle: {
      type: String,
      required: true,
      default: 'Let\'s Create Something Beautiful Together',
    },
    ctaDescription: {
      type: String,
      required: true,
      default: 'Ready to make your event unforgettable? Get in touch to discuss your musical needs and let\'s bring your vision to life.',
    },
  },
  {
    timestamps: true,
  }
);

export class AboutPageSettingsModel {
  private static model: Model<IAboutPageSettings>;

  public static getModel(): Model<IAboutPageSettings> {
    if (!this.model) {
      this.model = mongoose.model<IAboutPageSettings>('AboutPageSettings', aboutPageSettingsSchema);
    }
    return this.model;
  }

  public static async getSettings(): Promise<IAboutPageSettings | null> {
    try {
      const model = this.getModel();
      let settings = await model.findOne().lean();
      
      if (!settings) {
        await model.create({
          heroTitle: 'About Christina Sings4U',
          heroSubtitle: 'Professional vocalist delivering unforgettable musical experiences',
          storyTitle: 'My Story',
          storyContent: 'Welcome to Christina Sings4U! I am a passionate and dedicated professional singer with years of experience in delivering exceptional musical performances. My journey in music has allowed me to perform at countless weddings, corporate events, and special occasions, bringing joy and creating lasting memories for my clients.\n\nWhether you\'re looking for an intimate solo performance, a dynamic duo or trio, or a full band experience, I am committed to providing you with a musical experience that perfectly matches your vision and exceeds your expectations.\n\nMy repertoire spans across multiple genres, and I specialize in tailoring performances to suit the unique atmosphere and style of your event. From elegant wedding ceremonies to energetic corporate functions, I bring professionalism, talent, and a personal touch to every performance.',
          galleryImages: [],
          ctaTitle: 'Let\'s Create Something Beautiful Together',
          ctaDescription: 'Ready to make your event unforgettable? Get in touch to discuss your musical needs and let\'s bring your vision to life.',
        });
        // Query again with lean() to get plain object without Mongoose properties
        settings = await model.findOne().lean();
      }
      
      // Remove Mongoose-specific properties (_id, createdAt, updatedAt) before returning
      if (settings) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
        const { _id, createdAt, updatedAt, ...cleanSettings } = settings as any;
        return cleanSettings as IAboutPageSettings;
      }
      
      return null;
    } catch {
      // Return default settings if database query fails
      return {
        heroTitle: 'About Christina Sings4U',
        heroSubtitle: 'Professional vocalist delivering unforgettable musical experiences',
        storyTitle: 'My Story',
        storyContent: 'Welcome to Christina Sings4U! I am a passionate and dedicated professional singer with years of experience in delivering exceptional musical performances. My journey in music has allowed me to perform at countless weddings, corporate events, and special occasions, bringing joy and creating lasting memories for my clients.\n\nWhether you\'re looking for an intimate solo performance, a dynamic duo or trio, or a full band experience, I am committed to providing you with a musical experience that perfectly matches your vision and exceeds your expectations.\n\nMy repertoire spans across multiple genres, and I specialize in tailoring performances to suit the unique atmosphere and style of your event. From elegant wedding ceremonies to energetic corporate functions, I bring professionalism, talent, and a personal touch to every performance.',
        galleryImages: [],
        ctaTitle: 'Let\'s Create Something Beautiful Together',
        ctaDescription: 'Ready to make your event unforgettable? Get in touch to discuss your musical needs and let\'s bring your vision to life.',
      };
    }
  }

  public static async updateSettings(data: Partial<IAboutPageSettings>): Promise<IAboutPageSettings> {
    try {
      const model = this.getModel();
      const settings = await model.findOneAndUpdate(
        {},
        { $set: data },
        { new: true, upsert: true }
      ).lean();
      if (!settings) {
        throw new Error('Failed to update about page settings');
      }
      // Remove Mongoose-specific properties (_id, createdAt, updatedAt) before returning
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
      const { _id, createdAt, updatedAt, ...cleanSettings } = settings as any;
      return cleanSettings as IAboutPageSettings;
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to update about page settings: ${err.message}`);
    }
  }
}
