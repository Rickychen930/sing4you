import mongoose, { Schema, Model } from 'mongoose';
import type { IClient } from '../../shared/interfaces';

const clientSchema = new Schema<IClient>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    eventType: { type: String },
    eventDate: { type: String },
    location: { type: String },
    message: { type: String },
    source: { type: String, required: true, enum: ['contact_form', 'manual'], default: 'manual' },
    status: {
      type: String,
      required: true,
      enum: ['lead', 'contacted', 'quoted', 'confirmed', 'cancelled', 'completed'],
      default: 'lead',
    },
    notes: { type: String },
  },
  { timestamps: true }
);

clientSchema.index({ email: 1 });
clientSchema.index({ status: 1 });
clientSchema.index({ createdAt: -1 });

export class ClientModel {
  private static model: Model<IClient>;

  public static getModel(): Model<IClient> {
    if (!this.model) {
      this.model = mongoose.model<IClient>('Client', clientSchema);
    }
    return this.model;
  }

  public static async findAll(): Promise<IClient[]> {
    const model = this.getModel();
    return model.find().sort({ createdAt: -1 }).lean();
  }

  public static async findById(id: string): Promise<IClient | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    const model = this.getModel();
    return model.findById(id).lean();
  }

  public static async create(data: Partial<IClient>): Promise<IClient> {
    const model = this.getModel();
    return model.create(data);
  }

  public static async update(id: string, data: Partial<IClient>): Promise<IClient | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    const model = this.getModel();
    return model.findByIdAndUpdate(id, { $set: data }, { new: true }).lean();
  }

  public static async delete(id: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(id)) return false;
    const model = this.getModel();
    const result = await model.findByIdAndDelete(id);
    return !!result;
  }
}
