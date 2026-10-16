import mongoose from "mongoose";

export const connectMongoDB = async () => {
  if (!process.env.MONGODB_URL?.trim()) {
    console.error("MONGODB_URL is required.");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: "natural_travel",
      autoCreate: false,
      autoIndex: false,
    });
    console.log("Connected to MongoDB");

  } catch (error) {
    console.error("Error connecting to MongoDB:", {
      name: error?.name,
      code: error?.code,
      syscall: error?.syscall,
      causeCode: error?.cause?.code,
    });
    process.exit(1);
  }
};
