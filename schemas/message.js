import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    title: { type: String, require: true },
    message: { type: String, require: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true })

export const Message = mongoose.model("Message", messageSchema)