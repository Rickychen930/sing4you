import mongoose, { Schema, Model } from 'mongoose';
import { IBlogPost } from '../../shared/interfaces';

const blogPostSchema = new Schema<IBlogPost>(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
    },
    tags: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      required: true,
    },
    publishedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// slug already has unique: true, so no need for separate index
blogPostSchema.index({ publishedAt: -1 });
blogPostSchema.index({ category: 1 });

export class BlogPostModel {
  private static model: Model<IBlogPost>;

  public static getModel(): Model<IBlogPost> {
    if (!this.model) {
      this.model = mongoose.model<IBlogPost>('BlogPost', blogPostSchema);
    }
    return this.model;
  }

  public static async findAll(): Promise<IBlogPost[]> {
    const model = this.getModel();
    return model.find().sort({ publishedAt: -1, createdAt: -1 });
  }

  public static async findPublished(): Promise<IBlogPost[]> {
    const model = this.getModel();
    const now = new Date();
    return model
      .find({ publishedAt: { $lte: now } })
      .sort({ publishedAt: -1 });
  }

  public static async findById(id: string): Promise<IBlogPost | null> {
    const model = this.getModel();
    return model.findById(id);
  }

  public static async findBySlug(slug: string): Promise<IBlogPost | null> {
    const model = this.getModel();
    return model.findOne({ slug });
  }

  public static async create(data: Partial<IBlogPost>): Promise<IBlogPost> {
    const model = this.getModel();
    return model.create(data);
  }

  public static async update(id: string, data: Partial<IBlogPost>): Promise<IBlogPost | null> {
    const model = this.getModel();
    return model.findByIdAndUpdate(id, { $set: data }, { new: true });
  }

  public static async delete(id: string): Promise<boolean> {
    const model = this.getModel();
    const result = await model.findByIdAndDelete(id);
    return !!result;
  }
}