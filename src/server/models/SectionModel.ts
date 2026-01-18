import mongoose, { Schema, Model } from 'mongoose';
import { ISection } from '../../shared/interfaces';

const sectionSchema = new Schema<ISection>(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['solo', 'duo', 'trio', 'band', 'wedding', 'corporate', 'other'],
      required: true,
    },
    media: {
      type: [String],
      default: [],
    },
    audioSamples: {
      type: [String],
      default: [],
    },
    priceRange: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// slug already has unique: true, so no need for separate index
sectionSchema.index({ type: 1 });

export class SectionModel {
  private static model: Model<ISection>;

  public static getModel(): Model<ISection> {
    if (!this.model) {
      this.model = mongoose.model<ISection>('Section', sectionSchema);
    }
    return this.model;
  }

  public static async findAll(): Promise<ISection[]> {
    const model = this.getModel();
    return model.find().sort({ createdAt: -1 });
  }

  public static async findById(id: string): Promise<ISection | null> {
    const model = this.getModel();
    return model.findById(id);
  }

  public static async findBySlug(slug: string): Promise<ISection | null> {
    const model = this.getModel();
    return model.findOne({ slug });
  }

  public static async findByType(type: string): Promise<ISection[]> {
    const model = this.getModel();
    return model.find({ type }).sort({ createdAt: -1 });
  }

  public static async create(data: Partial<ISection>): Promise<ISection> {
    const model = this.getModel();
    return model.create(data);
  }

  public static async update(id: string, data: Partial<ISection>): Promise<ISection | null> {
    const model = this.getModel();
    return model.findByIdAndUpdate(id, { $set: data }, { new: true });
  }

  public static async delete(id: string): Promise<boolean> {
    const model = this.getModel();
    const result = await model.findByIdAndDelete(id);
    return !!result;
  }
}