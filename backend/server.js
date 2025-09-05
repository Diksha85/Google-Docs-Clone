import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import { verifyToken } from "../backend/middleware/authMiddleware.js";
import { connectDB } from "../backend/config/db.js"; 
import commentRoutes from "./routes/commentRoutes.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);

const allowedOrigin = "http://localhost:5173";

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigin,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/comments", commentRoutes);

app.get("/api/protected", verifyToken, (req, res) => {
  res.json({ message: `Hello ${req.user.name}, you are authenticated!` });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("join-document", (docId) => {
      socket.join(docId);
      console.log(`User ${socket.id} joined document ${docId}`);
    });

    socket.on("send-changes", ({ docId, content }) => {
      socket.to(docId).emit("receive-changes", content);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
