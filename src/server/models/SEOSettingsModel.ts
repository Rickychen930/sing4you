import mongoose, { Schema, Model } from 'mongoose';
import type { ISEOSettings } from '../../shared/interfaces';

const seoSettingsSchema = new Schema<ISEOSettings>(
  {
    defaultTitle: {
      type: String,
      required: true,
      default: 'Christina Sings4U | Professional Singer in Sydney',
    },
    defaultDescription: {
      type: String,
      required: true,
      default: 'Professional singer offering elegant live vocals for weddings, corporate events, and private occasions in Sydney, NSW.',
    },
    defaultImage: {
      type: String,
    },
    siteUrl: {
      type: String,
      required: true,
      default: 'https://christina-sings4you.com.au',
    },
  },
  {
    timestamps: true,
  }
);

export class SEOSettingsModel {
  private static model: Model<ISEOSettings>;

  public static getModel(): Model<ISEOSettings> {
    if (!this.model) {
      this.model = mongoose.model<ISEOSettings>('SEOSettings', seoSettingsSchema);
    }
    return this.model;
  }

  public static async getSettings(): Promise<ISEOSettings | null> {
    const model = this.getModel();
    let settings = await model.findOne();
    
    if (!settings) {
      settings = await model.create({
        defaultTitle: 'Christina Sings4U | Professional Singer in Sydney',
        defaultDescription: 'Professional singer offering elegant live vocals for weddings, corporate events, and private occasions in Sydney, NSW.',
        siteUrl: process.env.SITE_URL || 'https://christina-sings4you.com.au',
      });
    }
    
    return settings;
  }

  public static async updateSettings(data: Partial<ISEOSettings>): Promise<ISEOSettings> {
    const model = this.getModel();
    const settings = await model.findOneAndUpdate(
      {},
      { $set: data },
      { new: true, upsert: true }
    );
    return settings;
  }
}