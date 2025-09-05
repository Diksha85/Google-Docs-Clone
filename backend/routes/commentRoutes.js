import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  addComment,
  getComments,
  replyComment,
  resolveComment,
} from "../controller/commentController.js";

const router = express.Router();

router.post("/:documentId", verifyToken, addComment);

router.get("/:documentId", verifyToken, getComments);

router.post("/reply/:commentId", verifyToken, replyComment);

router.post("/resolve/:commentId", verifyToken, resolveComment);

export default router;
