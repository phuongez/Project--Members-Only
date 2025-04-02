import mongoose from "mongoose";

export const connectDB = async () => {
    const MONGODB_URI = 'mongodb+srv://phuongez:ndp27290@cluster0.k8jij.mongodb.net/private-message'

    await mongoose.connect(MONGODB_URI).then(() => {
        console.log('Database Connected');

    })
}