import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  updateUser,
  deleteUser,
  signOut,
  getUsers,
  adminDeleteUser,
  getUser,
} from "../Controllers/userController.js";
const router = express.Router();

router.put("/update/:userId", verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.post("/signout", signOut);
router.get("/getusers", verifyToken, getUsers);
router.delete("/deleteUser/:userId", verifyToken, adminDeleteUser);
router.get("/:userId", getUser);

export default router;
