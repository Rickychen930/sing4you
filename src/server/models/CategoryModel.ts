import mongoose, { Schema, Model } from 'mongoose';
import type { ICategory } from '../../shared/interfaces';

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      lowercase: true,
      sparse: true, // Allow null/undefined, but unique if present
    },
    description: {
      type: String,
    },
    type: {
      type: String,
      enum: ['solo', 'duo', 'trio', 'band', 'wedding', 'corporate', 'other', 'pocketrocker'],
    },
    featuredImage: {
      type: String,
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
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.index({ order: 1 });
categorySchema.index({ slug: 1 }, { unique: true, sparse: true });
categorySchema.index({ type: 1 });
// name already has unique: true, so no need for separate index

export class CategoryModel {
  private static model: Model<ICategory>;

  public static getModel(): Model<ICategory> {
    if (!this.model) {
      this.model = mongoose.model<ICategory>('Category', categorySchema);
    }
    return this.model;
  }

  public static async findAll(): Promise<ICategory[]> {
    try {
      const model = this.getModel();
      return await model.find().sort({ order: 1, createdAt: 1 }).lean();
    } catch {
      return [];
    }
  }

  public static async findById(id: string): Promise<ICategory | null> {
    try {
      const model = this.getModel();
      // Validate ObjectId format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
      }
      return await model.findById(id).lean();
    } catch {
      return null;
    }
  }

  public static async findByName(name: string): Promise<ICategory | null> {
    try {
      const model = this.getModel();
      return await model.findOne({ name }).lean();
    } catch {
      return null;
    }
  }

  public static async findBySlug(slug: string): Promise<ICategory | null> {
    try {
      const model = this.getModel();
      return await model.findOne({ slug }).lean();
    } catch {
      return null;
    }
  }

  public static async findByType(type: string): Promise<ICategory[]> {
    try {
      const model = this.getModel();
      return await model.find({ type }).sort({ order: 1, createdAt: 1 }).lean();
    } catch {
      return [];
    }
  }

  public static async create(data: Partial<ICategory>): Promise<ICategory> {
    try {
      const model = this.getModel();
      return await model.create(data);
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to create category: ${err.message}`);
    }
  }

  public static async update(id: string, data: Partial<ICategory>): Promise<ICategory | null> {
    try {
      const model = this.getModel();
      // Validate ObjectId format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
      }
      return await model.findByIdAndUpdate(id, { $set: data }, { new: true }).lean();
    } catch {
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
    } catch {
      return false;
    }
  }
}
