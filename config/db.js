import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config();

export const connectDB = async () => {
    const MONGODB_URI = process.env.MONGODB_URI;

    await mongoose.connect(MONGODB_URI).then(() => {
        console.log('Database Connected');

    })
}