import mongoose, { Schema, Model } from 'mongoose';
import { ITestimonial } from '../../shared/interfaces';

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
    const model = this.getModel();
    return model.find().sort({ createdAt: -1 });
  }

  public static async findById(id: string): Promise<ITestimonial | null> {
    const model = this.getModel();
    return model.findById(id);
  }

  public static async create(data: Partial<ITestimonial>): Promise<ITestimonial> {
    const model = this.getModel();
    return model.create(data);
  }

  public static async update(id: string, data: Partial<ITestimonial>): Promise<ITestimonial | null> {
    const model = this.getModel();
    return model.findByIdAndUpdate(id, { $set: data }, { new: true });
  }

  public static async delete(id: string): Promise<boolean> {
    const model = this.getModel();
    const result = await model.findByIdAndDelete(id);
    return !!result;
  }
}