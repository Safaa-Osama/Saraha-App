import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    content: {
        type: String,
        minLength: 10,
        required: true,
        trim: true
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        trim: true,
        ref: user
    }
}, {
    timestamps: true,
    strictQuery: true,
    strict: true,
});


const messageModel = mongoose.models.message || mongoose.model("message", messageSchema);


export default messageModel;