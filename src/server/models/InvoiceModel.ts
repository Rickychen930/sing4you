import mongoose, { Schema, Model } from 'mongoose';
import type { IInvoice, IInvoiceLineItem } from '../../shared/interfaces';

const lineItemSchema = new Schema<IInvoiceLineItem>(
  {
    description: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0 },
    unitPrice: { type: Number, required: true, min: 0 },
    gstIncluded: { type: Boolean, default: true },
  },
  { _id: false }
);

const invoiceSchema = new Schema<IInvoice>(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    title: { type: String, default: 'Tax Invoice' },
    issueDate: { type: Date, required: true },
    dueDate: { type: Date },
    businessName: { type: String, required: true },
    abn: { type: String, required: true },
    businessAddress: { type: String },
    clientId: { type: Schema.Types.ObjectId, ref: 'Client' },
    clientName: { type: String, required: true },
    clientAddress: { type: String },
    clientEmail: { type: String },
    items: { type: [lineItemSchema], required: true, default: [] },
    gstRate: { type: Number, default: 0.1 },
    subtotal: { type: Number },
    gstAmount: { type: Number },
    total: { type: Number },
    paymentTerms: { type: String },
    notes: { type: String },
    status: { type: String, enum: ['draft', 'sent', 'paid', 'overdue'], default: 'draft' },
  },
  { timestamps: true }
);

invoiceSchema.index({ invoiceNumber: 1 });
invoiceSchema.index({ clientId: 1 });
invoiceSchema.index({ issueDate: -1 });

export class InvoiceModel {
  private static model: Model<IInvoice>;

  public static getModel(): Model<IInvoice> {
    if (!this.model) {
      this.model = mongoose.model<IInvoice>('Invoice', invoiceSchema);
    }
    return this.model;
  }

  public static async findAll(): Promise<IInvoice[]> {
    const model = this.getModel();
    return model.find().sort({ issueDate: -1 }).lean();
  }

  public static async findById(id: string): Promise<IInvoice | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    const model = this.getModel();
    return model.findById(id).lean();
  }

  public static async findByClientId(clientId: string): Promise<IInvoice[]> {
    if (!mongoose.Types.ObjectId.isValid(clientId)) return [];
    const model = this.getModel();
    return model.find({ clientId }).sort({ issueDate: -1 }).lean();
  }

  public static async getNextInvoiceNumber(): Promise<string> {
    const model = this.getModel();
    const last = await model.findOne().sort({ createdAt: -1 }).select('invoiceNumber').lean();
    const year = new Date().getFullYear();
    const prefix = `INV-${year}-`;
    if (!last || !last.invoiceNumber?.startsWith(prefix)) {
      return `${prefix}1001`;
    }
    const num = parseInt(last.invoiceNumber.replace(prefix, ''), 10) || 0;
    return `${prefix}${num + 1}`;
  }

  public static async create(data: Partial<IInvoice>): Promise<IInvoice> {
    const model = this.getModel();
    return model.create(data);
  }

  public static async update(id: string, data: Partial<IInvoice>): Promise<IInvoice | null> {
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
