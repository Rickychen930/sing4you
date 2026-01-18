import mongoose, { Schema, Model } from 'mongoose';
import { ICategory } from '../../shared/interfaces';

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
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
categorySchema.index({ name: 1 });

export class CategoryModel {
  private static model: Model<ICategory>;

  public static getModel(): Model<ICategory> {
    if (!this.model) {
      this.model = mongoose.model<ICategory>('Category', categorySchema);
    }
    return this.model;
  }

  public static async findAll(): Promise<ICategory[]> {
    const model = this.getModel();
    return model.find().sort({ order: 1, createdAt: 1 });
  }

  public static async findById(id: string): Promise<ICategory | null> {
    const model = this.getModel();
    return model.findById(id);
  }

  public static async findByName(name: string): Promise<ICategory | null> {
    const model = this.getModel();
    return model.findOne({ name });
  }

  public static async create(data: Partial<ICategory>): Promise<ICategory> {
    const model = this.getModel();
    return model.create(data);
  }

  public static async update(id: string, data: Partial<ICategory>): Promise<ICategory | null> {
    const model = this.getModel();
    return model.findByIdAndUpdate(id, { $set: data }, { new: true });
  }

  public static async delete(id: string): Promise<boolean> {
    const model = this.getModel();
    const result = await model.findByIdAndDelete(id);
    return !!result;
  }
}
