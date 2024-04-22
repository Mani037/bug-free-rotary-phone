import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";
import User from "../Models/user.model.js";

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;

    if (!token) {
      return next(errorHandler(404, "Token not found"));
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY);

    if (!decode) {
      return next(errorHandler(404, "Token Invalid"));
    }

    const verifyUser = await User.findById(decode.userId).select("-password");

    if (!verifyUser) {
      return next(errorHandler(404, "User Not Found"));
    }

    req.user = verifyUser;

    next();
  } catch (error) {
    next(err);
  }
};
