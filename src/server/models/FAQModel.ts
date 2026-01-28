import mongoose, { Schema, Model } from 'mongoose';
import type { IFAQ } from '../../shared/interfaces';

const faqSchema = new Schema<IFAQ>(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

faqSchema.index({ order: 1, createdAt: -1 });
faqSchema.index({ isActive: 1 });

export class FAQModel {
  private static model: Model<IFAQ>;

  public static getModel(): Model<IFAQ> {
    if (!this.model) {
      this.model = mongoose.model<IFAQ>('FAQ', faqSchema);
    }
    return this.model;
  }

  public static async findAll(activeOnly: boolean = false): Promise<IFAQ[]> {
    try {
      const model = this.getModel();
      const query = activeOnly ? { isActive: true } : {};
      return await model.find(query).sort({ order: 1, createdAt: -1 }).lean();
    } catch {
      return [];
    }
  }

  public static async findById(id: string): Promise<IFAQ | null> {
    try {
      const model = this.getModel();
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
      }
      return await model.findById(id).lean();
    } catch {
      return null;
    }
  }

  public static async create(data: Partial<IFAQ>): Promise<IFAQ> {
    try {
      const model = this.getModel();
      return await model.create(data);
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to create FAQ: ${err.message}`);
    }
  }

  public static async update(id: string, data: Partial<IFAQ>): Promise<IFAQ | null> {
    try {
      const model = this.getModel();
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
