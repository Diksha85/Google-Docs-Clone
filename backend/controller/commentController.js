import Comment from "../models/Comment.js";
import mongoose from "mongoose";

export const addComment = async (req, res) => {
  try {
    const { docId, text, selectedText } = req.body;
    if (!docId) return res.status(400).json({ message: "docId is required" });
    if (!selectedText) return res.status(400).json({ message: "No selected text for comment" });
    if (!req.user?.email) return res.status(401).json({ message: "Authentication required" });

    const comment = new Comment({
      docId: new mongoose.Types.ObjectId(docId),
      userEmail: req.user.email,
      text,
      selectedText,
    });

    const savedComment = await comment.save();
    res.json(savedComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add comment", error: err });
  }
};

export const getComments = async (req, res) => {
  try {
    const { documentId } = req.params;

    const comments = await Comment.find({ docId: documentId }).sort({ createdAt: 1 });

    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const replyComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;
    if (!req.user?.email) return res.status(401).json({ message: "Authentication required" });

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    comment.replies.push({ userEmail: req.user.email, text });
    await comment.save();
    res.json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const resolveComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    if (!req.user?.email) return res.status(401).json({ message: "Authentication required" });

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    comment.resolved = true;
    await comment.save();
    res.json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
