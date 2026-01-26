import mongoose, { Schema, Model } from 'mongoose';
import type { IMedia } from '../../shared/interfaces';

const mediaSchema = new Schema<IMedia>(
  {
    variationId: {
      type: Schema.Types.ObjectId,
      ref: 'Variation',
      required: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any, // Type assertion needed because IMedia defines variationId as string, but schema uses ObjectId
    type: {
      type: String,
      enum: ['image', 'video'],
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
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

mediaSchema.index({ variationId: 1, order: 1 });
mediaSchema.index({ type: 1 });

export class MediaModel {
  private static model: Model<IMedia>;

  public static getModel(): Model<IMedia> {
    if (!this.model) {
      this.model = mongoose.model<IMedia>('Media', mediaSchema);
    }
    return this.model;
  }

  public static async findAll(): Promise<IMedia[]> {
    try {
      const model = this.getModel();
      return await model.find().populate('variationId').sort({ order: 1, createdAt: 1 }).lean();
    } catch {
      // If populate fails, return without populate
      const model = this.getModel();
      return await model.find().sort({ order: 1, createdAt: 1 }).lean();
    }
  }

  public static async findById(id: string): Promise<IMedia | null> {
    try {
      const model = this.getModel();
      // Validate ObjectId format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
      }
      return await model.findById(id).populate('variationId').lean();
    } catch {
      // If populate fails, return without populate
      const model = this.getModel();
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
      }
      return await model.findById(id).lean();
    }
  }

  public static async findByVariationId(variationId: string): Promise<IMedia[]> {
    try {
      const model = this.getModel();
      // Validate ObjectId format
      if (!mongoose.Types.ObjectId.isValid(variationId)) {
        return [];
      }
      return await model.find({ variationId }).sort({ order: 1, createdAt: 1 }).lean();
    } catch {
      return [];
    }
  }

  public static async create(data: Partial<IMedia>): Promise<IMedia> {
    try {
      const model = this.getModel();
      return await model.create(data);
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to create media: ${err.message}`);
    }
  }

  public static async update(id: string, data: Partial<IMedia>): Promise<IMedia | null> {
    try {
      const model = this.getModel();
      // Validate ObjectId format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
      }
      const result = await model.findByIdAndUpdate(id, { $set: data }, { new: true }).populate('variationId').lean();
      return result;
    } catch {
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
    } catch {
      return false;
    }
  }

  public static async deleteByVariationId(variationId: string): Promise<boolean> {
    try {
      const model = this.getModel();
      // Validate ObjectId format
      if (!mongoose.Types.ObjectId.isValid(variationId)) {
        return false;
      }
      const result = await model.deleteMany({ variationId });
      return result.deletedCount > 0;
    } catch {
      return false;
    }
  }
}
