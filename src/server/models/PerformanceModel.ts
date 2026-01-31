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
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    variationId: {
      type: Schema.Types.ObjectId,
      ref: 'Variation',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

performanceSchema.index({ date: -1 });
performanceSchema.index({ date: 1 });
performanceSchema.index({ city: 1 });

function getIdFromRef(ref: unknown): string | undefined {
  if (!ref) return undefined;
  if (typeof ref === 'string') return ref;
  if (typeof ref === 'object' && ref !== null && '_id' in ref) return String((ref as { _id: unknown })._id);
  return undefined;
}

export class PerformanceModel {
  private static model: Model<IPerformance>;

  private static normalizePopulated(
    p: IPerformance & { categoryId?: unknown; variationId?: unknown }
  ): IPerformance {
    const { categoryId, variationId, ...rest } = p;
    const catObj = categoryId && typeof categoryId === 'object' && categoryId !== null && 'name' in categoryId ? categoryId : undefined;
    const varObj = variationId && typeof variationId === 'object' && variationId !== null && 'name' in variationId ? variationId : undefined;
    return {
      ...rest,
      categoryId: getIdFromRef(categoryId) ?? (rest as Partial<IPerformance>).categoryId,
      variationId: getIdFromRef(variationId) ?? (rest as Partial<IPerformance>).variationId,
      category: catObj as IPerformance['category'],
      variation: varObj as IPerformance['variation'],
    } as IPerformance;
  }

  public static getModel(): Model<IPerformance> {
    if (!this.model) {
      this.model = mongoose.model<IPerformance>('Performance', performanceSchema);
    }
    return this.model;
  }

  public static async findAll(): Promise<IPerformance[]> {
    try {
      const model = this.getModel();
      const data = await model
        .find()
        .populate('categoryId', 'name slug')
        .populate('variationId', 'name slug')
        .sort({ date: -1, createdAt: -1 })
        .lean();
      return (data as (IPerformance & { categoryId?: unknown; variationId?: unknown })[]).map((p) =>
        PerformanceModel.normalizePopulated(p)
      );
    } catch {
      return [];
    }
  }

  public static async findPaginated(
    page: number = 1,
    limit: number = 9
  ): Promise<{ data: IPerformance[]; total: number; page: number; limit: number; totalPages: number }> {
    try {
      const model = this.getModel();
      const skip = (Math.max(1, page) - 1) * limit;
      const [data, total] = await Promise.all([
        model
          .find()
          .populate('categoryId', 'name slug')
          .populate('variationId', 'name slug')
          .sort({ date: -1, createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        model.countDocuments(),
      ]);
      const totalPages = Math.ceil(total / limit) || 1;
      const normalized = (data as IPerformance[]).map((p: IPerformance & { categoryId?: unknown; variationId?: unknown }) =>
        PerformanceModel.normalizePopulated(p)
      );
      return { data: normalized, total, page: Math.max(1, page), limit, totalPages };
    } catch {
      return { data: [], total: 0, page: 1, limit, totalPages: 0 };
    }
  }

  public static async findUpcoming(): Promise<IPerformance[]> {
    try {
      const model = this.getModel();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const data = await model
        .find({ date: { $gte: today } })
        .populate('categoryId', 'name slug')
        .populate('variationId', 'name slug')
        .sort({ date: 1 })
        .lean();
      return (data as (IPerformance & { categoryId?: unknown; variationId?: unknown })[]).map((p) =>
        PerformanceModel.normalizePopulated(p)
      );
    } catch {
      return [];
    }
  }

  public static async findById(id: string): Promise<IPerformance | null> {
    try {
      const model = this.getModel();
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
      }
      const doc = await model
        .findById(id)
        .populate('categoryId', 'name slug')
        .populate('variationId', 'name slug')
        .lean();
      if (!doc) return null;
      return PerformanceModel.normalizePopulated(doc as IPerformance & { categoryId?: unknown; variationId?: unknown });
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