import mongoose, { Schema, Model } from 'mongoose';
import type { IMedia } from '../../shared/interfaces';

const mediaSchema = new Schema<IMedia>(
  {
    variationId: {
      type: Schema.Types.ObjectId,
      ref: 'Variation',
      required: true,
    } as any,
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
    const model = this.getModel();
    return model.find().populate('variationId').sort({ order: 1, createdAt: 1 });
  }

  public static async findById(id: string): Promise<IMedia | null> {
    const model = this.getModel();
    return model.findById(id).populate('variationId');
  }

  public static async findByVariationId(variationId: string): Promise<IMedia[]> {
    const model = this.getModel();
    return model.find({ variationId }).sort({ order: 1, createdAt: 1 });
  }

  public static async create(data: Partial<IMedia>): Promise<IMedia> {
    const model = this.getModel();
    return model.create(data);
  }

  public static async update(id: string, data: Partial<IMedia>): Promise<IMedia | null> {
    const model = this.getModel();
    return model.findByIdAndUpdate(id, { $set: data }, { new: true }).populate('variationId');
  }

  public static async delete(id: string): Promise<boolean> {
    const model = this.getModel();
    const result = await model.findByIdAndDelete(id);
    return !!result;
  }

  public static async deleteByVariationId(variationId: string): Promise<boolean> {
    const model = this.getModel();
    const result = await model.deleteMany({ variationId });
    return result.deletedCount > 0;
  }
}
