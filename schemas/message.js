import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    title: { type: String, require: true },
    body: { type: String, require: true },
    creator: { type: String, require: true }
}, { timestamps: true })

export const Message = mongoose.model("Message", messageSchema)