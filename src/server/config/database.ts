import mongoose from 'mongoose';

export class Database {
  private static instance: Database;
  private isConnected = false;

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(uri: string, retries: number = 3): Promise<void> {
    if (this.isConnected) {
      console.log('Database already connected');
      return;
    }

    // Connection options for MongoDB Atlas
    const options: mongoose.ConnectOptions = {
      serverSelectionTimeoutMS: 10000, // Timeout after 10s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      maxPoolSize: 10, // Maintain up to 10 socket connections
      minPoolSize: 5, // Maintain at least 5 socket connections
      retryWrites: true,
      w: 'majority',
      // SSL/TLS options for MongoDB Atlas
      // Note: For mongodb+srv, TLS is automatically enabled
    };

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`Attempting to connect to MongoDB (attempt ${attempt}/${retries})...`);
        await mongoose.connect(uri, options);
        this.isConnected = true;
        console.log('✅ MongoDB connected successfully');
        return;
      } catch (error) {
        const err = error as Error;
        console.error(`❌ MongoDB connection attempt ${attempt} failed:`, err.message);
        
        if (attempt === retries) {
          console.error('❌ Failed to connect to MongoDB after all retry attempts');
          console.warn('⚠️  Server will start but API endpoints requiring database will fail.');
          console.warn('💡 Troubleshooting tips:');
          console.warn('   1. Check your internet connection');
          console.warn('   2. Verify MongoDB Atlas cluster is running');
          console.warn('   3. Check MongoDB Atlas Network Access settings');
          console.warn('   4. Verify connection string and credentials');
          console.warn('   5. Try connecting from MongoDB Compass to test connection');
          this.isConnected = false;
          return;
        }
        
        // Wait before retrying (exponential backoff)
        const waitTime = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        console.log(`⏳ Retrying in ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    await mongoose.disconnect();
    this.isConnected = false;
    console.log('MongoDB disconnected');
  }

  public isConnectedToDb(): boolean {
    return this.isConnected;
  }
}