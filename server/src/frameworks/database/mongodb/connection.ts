import mongoose from "mongoose";
import configKeys from "../../../config";

mongoose.set("strictQuery", true);

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('Connection URL:', configKeys.DB_CLUSTER_URL ? 'Found' : 'Missing');
    console.log('Database Name:', configKeys.DB_NAME);

    if (!configKeys.DB_CLUSTER_URL) {
      console.error('❌ Database URL is missing in environment variables');
      console.log('Available env vars:', Object.keys(process.env).filter(key => 
        key.includes('DB') || key.includes('MONGO') || key.includes('DATABASE')
      ));
      process.exit(1);
    }

    await mongoose.connect(configKeys.DB_CLUSTER_URL, {
      dbName: configKeys.DB_NAME,
    });
    
    console.log(`✅ Database connected successfully`.green);
  } catch (error: any) {
    console.error('❌ Database connection error:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
};

export default connectDB;
