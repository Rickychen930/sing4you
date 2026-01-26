import mongoose, { Schema, Model } from 'mongoose';
import type { ITestimonial } from '../../shared/interfaces';

const testimonialSchema = new Schema<ITestimonial>(
  {
    clientName: {
      type: String,
      required: true,
    },
    eventType: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

testimonialSchema.index({ createdAt: -1 });

export class TestimonialModel {
  private static model: Model<ITestimonial>;

  public static getModel(): Model<ITestimonial> {
    if (!this.model) {
      this.model = mongoose.model<ITestimonial>('Testimonial', testimonialSchema);
    }
    return this.model;
  }

  public static async findAll(): Promise<ITestimonial[]> {
    try {
      const model = this.getModel();
      return await model.find().sort({ createdAt: -1 }).lean();
    } catch {
      return [];
    }
  }

  public static async findById(id: string): Promise<ITestimonial | null> {
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

  public static async create(data: Partial<ITestimonial>): Promise<ITestimonial> {
    try {
      const model = this.getModel();
      return await model.create(data);
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to create testimonial: ${err.message}`);
    }
  }

  public static async update(id: string, data: Partial<ITestimonial>): Promise<ITestimonial | null> {
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