import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import toConnect from "./DB/ConnectDB.js";
import authRoutes from "./Routes/auth.route.js";
import userRoutes from "./Routes/user.route.js";
import postRoutes from "./Routes/post.route.js";
import commentRoutes from "./Routes/comment.route.js";
import path from "path";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("hey");
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);

//for deployment
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/frontend", "dist", "index.html"));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  res.status(statusCode).json({
    success: "false",
    statusCode,
    message,
  });
});

app.listen(3000, () => {
  toConnect();
  console.log(`listening on port ${PORT}`);
});
