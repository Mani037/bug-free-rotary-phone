import express from "express";
import { signup, signIn, googleAuth } from "../Controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signIn", signIn);
router.post("/google", googleAuth);

export default router;
