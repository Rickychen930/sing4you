import mongoose, { Schema, Model } from 'mongoose';
import type { ISection } from '../../shared/interfaces';

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
    try {
      const model = this.getModel();
      return await model.find().sort({ createdAt: -1 }).lean();
    } catch (error) {
      return [];
    }
  }

  public static async findById(id: string): Promise<ISection | null> {
    try {
      const model = this.getModel();
      // Validate ObjectId format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
      }
      return await model.findById(id).lean();
    } catch (error) {
      return null;
    }
  }

  public static async findBySlug(slug: string): Promise<ISection | null> {
    try {
      const model = this.getModel();
      return await model.findOne({ slug }).lean();
    } catch (error) {
      return null;
    }
  }

  public static async findByType(type: string): Promise<ISection[]> {
    try {
      const model = this.getModel();
      return await model.find({ type }).sort({ createdAt: -1 }).lean();
    } catch (error) {
      return [];
    }
  }

  public static async create(data: Partial<ISection>): Promise<ISection> {
    try {
      const model = this.getModel();
      return await model.create(data);
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to create section: ${err.message}`);
    }
  }

  public static async update(id: string, data: Partial<ISection>): Promise<ISection | null> {
    try {
      const model = this.getModel();
      // Validate ObjectId format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
      }
      return await model.findByIdAndUpdate(id, { $set: data }, { new: true }).lean();
    } catch (error) {
      return null;
    }
  }

  public static async delete(id: string): Promise<boolean> {
    try {
      const model = this.getModel();
      // Validate ObjectId format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return false;
      }
      const result = await model.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      return false;
    }
  }
}