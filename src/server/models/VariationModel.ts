import mongoose, { Schema, Model } from 'mongoose';
import type { IVariation } from '../../shared/interfaces';

const variationSchema = new Schema<IVariation>(
  {
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    longDescription: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      sparse: true,
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

variationSchema.index({ categoryId: 1, order: 1 });
// slug already has unique: true, so no need for separate index

export class VariationModel {
  private static model: Model<IVariation>;

  public static getModel(): Model<IVariation> {
    if (!this.model) {
      this.model = mongoose.model<IVariation>('Variation', variationSchema);
    }
    return this.model;
  }

  public static async findAll(): Promise<IVariation[]> {
    try {
      const model = this.getModel();
      return await model.find().populate('categoryId').sort({ order: 1, createdAt: 1 }).lean();
    } catch (error) {
      // If populate fails (e.g., invalid reference), return without populate
      const model = this.getModel();
      return await model.find().sort({ order: 1, createdAt: 1 }).lean();
    }
  }

  public static async findById(id: string): Promise<IVariation | null> {
    try {
      const model = this.getModel();
      // Validate ObjectId format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
      }
      return await model.findById(id).populate('categoryId').lean();
    } catch (error) {
      // If populate fails, return without populate
      const model = this.getModel();
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
      }
      return await model.findById(id).lean();
    }
  }

  public static async findByCategoryId(categoryId: string): Promise<IVariation[]> {
    try {
      const model = this.getModel();
      // Validate ObjectId format
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return [];
      }
      return await model.find({ categoryId }).sort({ order: 1, createdAt: 1 }).lean();
    } catch (error) {
      return [];
    }
  }

  public static async findBySlug(slug: string): Promise<IVariation | null> {
    try {
      const model = this.getModel();
      return await model.findOne({ slug }).populate('categoryId').lean();
    } catch (error) {
      // If populate fails, return without populate
      const model = this.getModel();
      return await model.findOne({ slug }).lean();
    }
  }

  public static async create(data: Partial<IVariation>): Promise<IVariation> {
    try {
      const model = this.getModel();
      return await model.create(data);
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to create variation: ${err.message}`);
    }
  }

  public static async update(id: string, data: Partial<IVariation>): Promise<IVariation | null> {
    try {
      const model = this.getModel();
      // Validate ObjectId format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
      }
      const result = await model.findByIdAndUpdate(id, { $set: data }, { new: true }).populate('categoryId').lean();
      return result;
    } catch (error) {
      // If populate fails, return without populate
      const model = this.getModel();
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
      }
      return await model.findByIdAndUpdate(id, { $set: data }, { new: true }).lean();
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
