import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  createComment,
  getComment,
  likeComment,
  editComment,
  deleteComment,
  getAllComments,
} from "../Controllers/commentController.js";

const router = express.Router();

router.post("/create", verifyToken, createComment);
router.get("/getPostComment/:postId", getComment);
router.put("/likeComment/:commentId", verifyToken, likeComment);
router.put("/editComment/:commentId", verifyToken, editComment);
router.delete("/deleteComment/:commentId", verifyToken, deleteComment);
router.get("/getComments", verifyToken, getAllComments);

export default router;
