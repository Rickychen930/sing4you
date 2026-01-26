import mongoose, { Schema, Model } from 'mongoose';
import type { IHeroSettings } from '../../shared/interfaces';

const heroSettingsSchema = new Schema<IHeroSettings>(
  {
    title: {
      type: String,
      required: true,
      default: 'Christina Sings4U',
    },
    subtitle: {
      type: String,
      required: true,
      default: 'Elegant live vocals for your special moments in Sydney',
    },
    backgroundImage: {
      type: String,
    },
    backgroundVideo: {
      type: String,
    },
    ctaWhatsApp: {
      text: {
        type: String,
        required: true,
        default: 'Book via WhatsApp',
      },
      link: {
        type: String,
        required: true,
      },
    },
    ctaEmail: {
      text: {
        type: String,
        required: true,
        default: 'Book via Email',
      },
      link: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

export class HeroSettingsModel {
  private static model: Model<IHeroSettings>;

  public static getModel(): Model<IHeroSettings> {
    if (!this.model) {
      this.model = mongoose.model<IHeroSettings>('HeroSettings', heroSettingsSchema);
    }
    return this.model;
  }

  public static async getSettings(): Promise<IHeroSettings | null> {
    try {
      const model = this.getModel();
      let settings = await model.findOne().lean();
      
      if (!settings) {
        await model.create({
          title: 'Christina Sings4U',
          subtitle: 'Elegant live vocals for your special moments in Sydney',
          ctaWhatsApp: {
            text: 'Book via WhatsApp',
            link: '',
          },
          ctaEmail: {
            text: 'Book via Email',
            link: '',
          },
        });
        // Query again with lean() to get plain object without Mongoose properties
        settings = await model.findOne().lean();
      }
      
      // Remove Mongoose-specific properties (_id, createdAt, updatedAt) before returning
      if (settings) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
        const { _id, createdAt, updatedAt, ...cleanSettings } = settings as any;
        return cleanSettings as IHeroSettings;
      }
      
      return null;
    } catch {
      // Return default settings if database query fails
      return {
        title: 'Christina Sings4U',
        subtitle: 'Elegant live vocals for your special moments in Sydney',
        ctaWhatsApp: {
          text: 'Book via WhatsApp',
          link: '',
        },
        ctaEmail: {
          text: 'Book via Email',
          link: '',
        },
      };
    }
  }

  public static async updateSettings(data: Partial<IHeroSettings>): Promise<IHeroSettings> {
    try {
      const model = this.getModel();
      const settings = await model.findOneAndUpdate(
        {},
        { $set: data },
        { new: true, upsert: true }
      ).lean();
      if (!settings) {
        throw new Error('Failed to update hero settings');
      }
      // Remove Mongoose-specific properties (_id, createdAt, updatedAt) before returning
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
      const { _id, createdAt, updatedAt, ...cleanSettings } = settings as any;
      return cleanSettings as IHeroSettings;
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to update hero settings: ${err.message}`);
    }
  }
}