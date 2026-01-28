import mongoose, { Schema, Model } from 'mongoose';
import type { IPerformance } from '../../shared/interfaces';

const performanceSchema = new Schema<IPerformance>(
  {
    eventName: {
      type: String,
      required: true,
    },
    venueName: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
      default: 'Sydney',
    },
    state: {
      type: String,
      required: true,
      default: 'NSW',
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    ticketLink: {
      type: String,
    },
    description: {
      type: String,
    },
    featuredImage: {
      type: String,
    },
    media: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

performanceSchema.index({ date: 1 });
performanceSchema.index({ city: 1 });

export class PerformanceModel {
  private static model: Model<IPerformance>;

  public static getModel(): Model<IPerformance> {
    if (!this.model) {
      this.model = mongoose.model<IPerformance>('Performance', performanceSchema);
    }
    return this.model;
  }

  public static async findAll(): Promise<IPerformance[]> {
    try {
      const model = this.getModel();
      // Only return upcoming performances (date >= now)
      const now = new Date();
      return await model.find({ date: { $gte: now } }).sort({ date: 1 }).lean();
    } catch {
      return [];
    }
  }

  public static async findUpcoming(): Promise<IPerformance[]> {
    try {
      const model = this.getModel();
      const now = new Date();
      return await model.find({ date: { $gte: now } }).sort({ date: 1 }).lean();
    } catch {
      return [];
    }
  }

  public static async findById(id: string): Promise<IPerformance | null> {
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

  public static async create(data: Partial<IPerformance>): Promise<IPerformance> {
    try {
      const model = this.getModel();
      return await model.create(data);
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to create performance: ${err.message}`);
    }
  }

  public static async update(id: string, data: Partial<IPerformance>): Promise<IPerformance | null> {
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