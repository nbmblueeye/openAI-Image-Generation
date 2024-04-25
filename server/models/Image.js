import mongoose from "mongoose";

const openAISchema = mongoose.Schema({
    paymentId:{type: String, required:[true, "Payment id is required"]},
    name:{type: String, required:[true, "name is required"]},
    email:{type: String, required:[true, "email is required"]},
    description:{type: String, required:[true, "description is required"]},
    image:{type: String, required:[true, "image is required"]},
},{
    timestamps: true,
});

export default mongoose.model("ImageAI", openAISchema);