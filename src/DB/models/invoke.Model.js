import mongoose from "mongoose";

const invokeTokenSchema = new mongoose.Schema({
    tokenId: {
        type: String,
        required: true,
        trim: true
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true,
    },
    expireAt: {
        type: Date,
        required: true,
    }
}, {
    timestamps: true,
    strictQuery: true,
    strict: true
});

invokeTokenSchema.index("expireAt", { expireAfterSeconds: 0 })

const invokeTokenModel = mongoose.models.invokeToken || mongoose.model("invokeToken", invokeTokenSchema);


export default invokeTokenModel;