import mongoose from "mongoose";
import config from ".";

let connectionPromise: Promise<typeof mongoose> | null = null;

const connectDatabase = async (): Promise<typeof mongoose> => {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (!config.db_url) {
    throw new Error("DB_URL is not configured");
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(config.db_url).catch((error) => {
      connectionPromise = null;
      throw error;
    });
  }

  return connectionPromise;
};

export default connectDatabase;