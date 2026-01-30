import mongoose, { Schema, Model } from 'mongoose';
import type { IClientCommunication } from '../../shared/interfaces';

// Schema uses ObjectId for clientId (ref); API/interface use string
const clientCommunicationSchema = new Schema(
  {
    clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    type: { type: String, required: true, enum: ['email', 'note'] },
    subject: { type: String },
    body: { type: String },
    sentAt: { type: Date, required: true, default: Date.now },
    status: {
      type: String,
      required: true,
      enum: ['pending_reply', 'replied', 'confirmed', 'cancelled', 'no_response'],
      default: 'pending_reply',
    },
    notes: { type: String },
  },
  { timestamps: true }
);

clientCommunicationSchema.index({ clientId: 1, sentAt: -1 });

export class ClientCommunicationModel {
  private static model: Model<IClientCommunication>;

  public static getModel(): Model<IClientCommunication> {
    if (!this.model) {
      this.model = mongoose.model('ClientCommunication', clientCommunicationSchema) as unknown as Model<IClientCommunication>;
    }
    return this.model;
  }

  public static async findByClientId(clientId: string): Promise<IClientCommunication[]> {
    if (!mongoose.Types.ObjectId.isValid(clientId)) return [];
    const model = this.getModel();
    return model.find({ clientId }).sort({ sentAt: -1 }).lean();
  }

  public static async findById(id: string): Promise<IClientCommunication | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    const model = this.getModel();
    return model.findById(id).lean();
  }

  public static async create(data: Partial<IClientCommunication>): Promise<IClientCommunication> {
    const model = this.getModel();
    return model.create(data);
  }

  public static async update(id: string, data: Partial<IClientCommunication>): Promise<IClientCommunication | null> {
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

  /** Delete all communications for a client (cascade when client is deleted). */
  public static async deleteByClientId(clientId: string): Promise<number> {
    if (!mongoose.Types.ObjectId.isValid(clientId)) return 0;
    const model = this.getModel();
    const result = await model.deleteMany({ clientId });
    return result.deletedCount ?? 0;
  }
}
