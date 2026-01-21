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
    // Note: For mongodb+srv, TLS is automatically enabled by MongoDB driver
    const options: mongoose.ConnectOptions = {
      serverSelectionTimeoutMS: 30000, // Timeout after 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      connectTimeoutMS: 30000, // Connection timeout
      maxPoolSize: 10, // Maintain up to 10 socket connections
      minPoolSize: 2, // Maintain at least 2 socket connections
      retryWrites: true,
      w: 'majority',
      // Additional connection stability options
      heartbeatFrequencyMS: 10000,
      // Buffer commands if connection is lost
      bufferCommands: true,
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
        const isSSLError = err.message.includes('SSL') || err.message.includes('TLS');
        
        console.error(`❌ MongoDB connection attempt ${attempt} failed:`, err.message);
        
        if (isSSLError) {
          console.error('🔒 SSL/TLS Error detected. This might be due to:');
          console.error('   - Network firewall blocking SSL connections');
          console.error('   - Outdated OpenSSL version');
          console.error('   - MongoDB Atlas SSL certificate issues');
          console.error('   - VPN or proxy interfering with SSL handshake');
        }
        
        if (attempt === retries) {
          console.error('❌ Failed to connect to MongoDB after all retry attempts');
          console.warn('⚠️  Server will start but API endpoints requiring database will fail.');
          console.warn('💡 Troubleshooting tips:');
          console.warn('   1. Check your internet connection');
          console.warn('   2. Verify MongoDB Atlas cluster is running');
          console.warn('   3. Check MongoDB Atlas Network Access settings (whitelist your IP)');
          console.warn('   4. Verify connection string and credentials in .env file');
          console.warn('   5. Try connecting from MongoDB Compass to test connection');
          if (isSSLError) {
            console.warn('   6. Check if you\'re behind a corporate firewall/VPN');
            console.warn('   7. Try updating Node.js and npm to latest versions');
            console.warn('   8. Consider using MongoDB connection string without SSL (not recommended for production)');
          }
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