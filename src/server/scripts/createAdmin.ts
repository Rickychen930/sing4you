import dotenv from 'dotenv';
import { Database } from '../config/database';
import { AdminUserModel } from '../models/AdminUserModel';
import bcrypt from 'bcryptjs';

dotenv.config();

const createAdmin = async (): Promise<void> => {
  try {
    // Connect to database
    const dbUri = process.env.MONGODB_URI || 'mongodb+srv://sings4you:<db_password>@sings4you.qahkyi2.mongodb.net/christinasings4u';
    
    if (dbUri.includes('<db_password>')) {
      console.error('❌ Please set MONGODB_URI in .env file!');
      process.exit(1);
    }

    const database = Database.getInstance();
    await database.connect(dbUri);
    console.log('✅ Connected to MongoDB');
    
    // Wait a bit to ensure connection is stable
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if admin exists
    const existingAdmin = await AdminUserModel.getModel().findOne();
    
    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists:');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Name: ${existingAdmin.name}`);
      console.log('\n💡 To reset password, delete the admin user first or update it manually in the database.');
    } else {
      console.log('📝 Creating admin user...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = await AdminUserModel.getModel().create({
        email: 'admin@christinasings4u.com.au',
        password: hashedPassword,
        name: 'Admin User',
      });
      console.log('✅ Admin user created successfully!');
      console.log(`   Email: ${admin.email}`);
      console.log(`   Password: admin123`);
      console.log('\n⚠️  IMPORTANT: Change the password after first login!');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
};

createAdmin();
