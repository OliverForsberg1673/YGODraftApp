import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/yugioh_app"
    );
    console.log("Mongo initiated");
  } catch (error) {
    console.error("Mongo did not connect", error);
    process.exit(1);
  }
};

export default connectDB;
