import express from "express";
const router = express.Router();
import { verifyToken } from "../middleware/verifyToken.js";
import {
  createPost,
  getPosts,
  deletePost,
  updatePost,
} from "../Controllers/postController.js";

router.post("/create", verifyToken, createPost);
router.get("/getPost", getPosts);
router.delete("/delete/:postId/:userId", verifyToken, deletePost);
router.put("/update/:postId/:userId", verifyToken, updatePost);

export default router;
