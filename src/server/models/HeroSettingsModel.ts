import mongoose, { Schema, Model } from 'mongoose';
import { IHeroSettings } from '../../shared/interfaces';

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
    const model = this.getModel();
    let settings = await model.findOne();
    
    if (!settings) {
      settings = await model.create({
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
    }
    
    return settings;
  }

  public static async updateSettings(data: Partial<IHeroSettings>): Promise<IHeroSettings> {
    const model = this.getModel();
    const settings = await model.findOneAndUpdate(
      {},
      { $set: data },
      { new: true, upsert: true }
    );
    return settings;
  }
}