import mongoose, { Schema, Model } from 'mongoose';
import { IPerformance } from '../../shared/interfaces';

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
    const model = this.getModel();
    return model.find().sort({ date: 1 });
  }

  public static async findUpcoming(): Promise<IPerformance[]> {
    const model = this.getModel();
    const now = new Date();
    return model.find({ date: { $gte: now } }).sort({ date: 1 });
  }

  public static async findById(id: string): Promise<IPerformance | null> {
    const model = this.getModel();
    return model.findById(id);
  }

  public static async create(data: Partial<IPerformance>): Promise<IPerformance> {
    const model = this.getModel();
    return model.create(data);
  }

  public static async update(id: string, data: Partial<IPerformance>): Promise<IPerformance | null> {
    const model = this.getModel();
    return model.findByIdAndUpdate(id, { $set: data }, { new: true });
  }

  public static async delete(id: string): Promise<boolean> {
    const model = this.getModel();
    const result = await model.findByIdAndDelete(id);
    return !!result;
  }
}