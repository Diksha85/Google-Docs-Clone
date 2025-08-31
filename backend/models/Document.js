import mongoose from "mongoose";

 const DocumentSchema = new mongoose.Schema({
  title: String,
  content: String,
  userEmail: String,
  sharedWith: [
    {
      email: String,
      role: { type: String, enum: ["view", "edit"], default: "view" },
    },
  ],
  shareLink: {
    token: String,
    role: { type: String, enum: ["view", "edit"], default: "view" },
  },
}, { timestamps: true });
export default mongoose.model("Document", DocumentSchema);
