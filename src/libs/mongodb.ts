import mongoose from "mongoose";

let isConnected = false;

export const connectMongoDB = async () => {
  if (isConnected) {
    return { db: mongoose.connection.db };
  }

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("MONGODB_URI is not configured.");
  }

  try {
    await mongoose.connect(mongoUri);
    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    throw error;
  }
  return { db: mongoose.connection.db };
};
