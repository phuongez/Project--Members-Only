import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    admin: { type: Boolean }
})

export const User = mongoose.model("User", userSchema)