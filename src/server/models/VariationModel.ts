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
variationSchema.index({ slug: 1 });

export class VariationModel {
  private static model: Model<IVariation>;

  public static getModel(): Model<IVariation> {
    if (!this.model) {
      this.model = mongoose.model<IVariation>('Variation', variationSchema);
    }
    return this.model;
  }

  public static async findAll(): Promise<IVariation[]> {
    const model = this.getModel();
    return model.find().populate('categoryId').sort({ order: 1, createdAt: 1 });
  }

  public static async findById(id: string): Promise<IVariation | null> {
    const model = this.getModel();
    return model.findById(id).populate('categoryId');
  }

  public static async findByCategoryId(categoryId: string): Promise<IVariation[]> {
    const model = this.getModel();
    return model.find({ categoryId }).sort({ order: 1, createdAt: 1 });
  }

  public static async findBySlug(slug: string): Promise<IVariation | null> {
    const model = this.getModel();
    return model.findOne({ slug }).populate('categoryId');
  }

  public static async create(data: Partial<IVariation>): Promise<IVariation> {
    const model = this.getModel();
    return model.create(data);
  }

  public static async update(id: string, data: Partial<IVariation>): Promise<IVariation | null> {
    const model = this.getModel();
    return model.findByIdAndUpdate(id, { $set: data }, { new: true }).populate('categoryId');
  }

  public static async delete(id: string): Promise<boolean> {
    const model = this.getModel();
    const result = await model.findByIdAndDelete(id);
    return !!result;
  }
}
