import mongoose, { Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import type { IAdminUser } from '../../shared/interfaces';

const adminUserSchema = new Schema<IAdminUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

adminUserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// email already has unique: true, so no need for separate index

export class AdminUserModel {
  private static model: Model<IAdminUser>;

  public static getModel(): Model<IAdminUser> {
    if (!this.model) {
      this.model = mongoose.model<IAdminUser>('AdminUser', adminUserSchema);
    }
    return this.model;
  }

  public static async findByEmail(email: string): Promise<IAdminUser | null> {
    const model = this.getModel();
    return model.findOne({ email: email.toLowerCase() });
  }

  public static async findById(id: string): Promise<IAdminUser | null> {
    const model = this.getModel();
    return model.findById(id);
  }

  public static async create(data: Partial<IAdminUser>): Promise<IAdminUser> {
    const model = this.getModel();
    return model.create(data);
  }

  public static async comparePassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}