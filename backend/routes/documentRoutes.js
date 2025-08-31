import express from "express";
import { createDocument, updateDocument, getDocument,getUserDocuments } from "../controller/documentController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { shareDocument, accessSharedDocument } from "../controller/documentController.js";
import { logSharedAccess } from "../controller/documentController.js";

const router = express.Router();

router.post("/", verifyToken, createDocument);    
router.put("/:id", verifyToken, updateDocument);    
router.get("/:id", verifyToken, getDocument);      
router.get("/", verifyToken, getUserDocuments);


router.post("/:id/share", verifyToken, shareDocument); 
router.get("/share/:token",  accessSharedDocument); 


router.post("/share/log-access", verifyToken, logSharedAccess);


export default router;
