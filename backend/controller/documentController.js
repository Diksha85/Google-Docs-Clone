import Document from "../models/Document.js";
import crypto from "crypto";
import { sendEmail } from "../utils/mailer.js";

/**
 * ✅ Create new document
 */
export const createDocument = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) return res.status(400).json({ message: "Title is required" });

    const newDoc = new Document({
      title,
      content: "",
      userEmail: req.user.email,
    });

    await newDoc.save();
    res.status(201).json({ message: "Document created", document: newDoc });
  } catch (err) {
    console.error("Error in createDocument:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ✅ Update document (Owner OR Shared Link)
 */
export const updateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, token } = req.body;

    let doc;

    if (token) {
      // ✅ Shared link mode
      doc = await Document.findOne({ "shareLink.token": token });
      if (!doc) return res.status(404).json({ message: "Document not found" });

      // ✅ Check if editing is allowed
      if (doc.shareLink.role !== "edit") {
        return res
          .status(403)
          .json({ message: "This link is view-only. Editing not allowed." });
      }
    } else {
      // ✅ Owner mode
      doc = await Document.findById(id);
      if (!doc) return res.status(404).json({ message: "Document not found" });

      if (doc.userEmail !== req.user.email) {
        return res
          .status(403)
          .json({ message: "Not authorized to edit this document" });
      }
    }

    doc.content = content;
    await doc.save();

    res.json({ message: "Document updated successfully", document: doc });
  } catch (err) {
    console.error("Error in updateDocument:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ✅ Get a document by ID (Owner only)
 */
export const getDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Document.findById(id);

    if (!doc) return res.status(404).json({ message: "Document not found" });
    if (doc.userEmail !== req.user.email) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json({ document: doc });
  } catch (err) {
    console.error("Error in getDocument:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ✅ Get all documents for logged-in user
 */
export const getUserDocuments = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const docs = await Document.find({ userEmail }).sort({ createdAt: -1 });

    res.json({ documents: docs });
  } catch (err) {
    console.error("Error in getUserDocuments:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ✅ Generate share link and optionally email it
 */
export const shareDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, recipientEmail } = req.body;

    const doc = await Document.findById(id);
    if (!doc) return res.status(404).json({ message: "Document not found" });
    if (doc.userEmail !== req.user.email) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // ✅ Generate new share token
    const token = crypto.randomBytes(16).toString("hex");
    doc.shareLink = { token, role };
    await doc.save();

    const shareUrl = `http://localhost:5173/share/${token}`; // ✅ match your frontend port

    // ✅ Send email if recipientEmail provided
    if (recipientEmail) {
      const subject = `${req.user.name || "Someone"} shared a document with you`;
      const html = `
        <p>Hello,</p>
        <p>${req.user.email} has shared a document with you.</p>
        <p>Role: <b>${role}</b></p>
        <p>Click here to access: <a href="${shareUrl}">${shareUrl}</a></p>
      `;
      await sendEmail(recipientEmail, subject, html);
    }

    res.json({ message: "Share link generated", shareUrl, role });
  } catch (err) {
    console.error("Error in shareDocument:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ✅ Access shared document by token
 */
export const accessSharedDocument = async (req, res) => {
  try {
    const { token } = req.params;

    const doc = await Document.findOne({ "shareLink.token": token });
    if (!doc) {
      return res.status(404).json({ message: "Invalid or expired link" });
    }

    const role = doc.shareLink.role || "view";
    res.json({ document: doc, role });
  } catch (err) {
    console.error("Error in accessSharedDocument:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ✅ Log access (Optional: if you want to track who accessed)
 */
export const logSharedAccess = async (req, res) => {
  try {
    const { token } = req.body;

    const doc = await Document.findOne({ "shareLink.token": token });
    if (!doc) return res.status(404).json({ message: "Invalid token" });

    if (!doc.sharedWith.some((u) => u.email === req.user.email)) {
      doc.sharedWith.push({ email: req.user.email, role: doc.shareLink.role });
      await doc.save();
    }

    res.json({ message: "Access recorded", document: doc });
  } catch (err) {
    console.error("Error in logSharedAccess:", err);
    res.status(500).json({ message: "Server error" });
  }
};
