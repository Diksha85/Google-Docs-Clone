import mongoose from "mongoose";
const commentSchema = new mongoose.Schema({
  docId: { type: mongoose.Schema.Types.ObjectId, ref: "Document", required: true },
  userEmail: { type: String, required: true },
  text: { type: String, required: true },
  selectedText: { type: String, required: true }, 
  replies: [
    {
      userEmail: String,
      text: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  resolved: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Comment", commentSchema);
