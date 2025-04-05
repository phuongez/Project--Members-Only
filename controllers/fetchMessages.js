import { Message } from "../schemas/message.js";

export const fetchMessages = async (req, res, next) => {
    try {
        const messages = await Message.find().populate("author", "fullname")
        res.locals.messages = messages || []
        next()
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.locals.messages = [];
        next();
    }
}