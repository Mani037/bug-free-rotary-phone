import User from "../Models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcrypt from "bcryptjs";

export const updateUser = async (req, res, next) => {
  try {
    const { username, email, password, profilePicture } = req.body;
    const tokenUser = req.user._id; //from token
    const paramsUser = req.params.userId; //from params

    if (tokenUser.toString() !== paramsUser) {
      return next(errorHandler(400, "Invalid user cannot update your profile"));
    }

    if (password) {
      if (password.length < 6) {
        return next(
          errorHandler(400, "Password must be at least 6 characters")
        );
      }
    }

    const hashPassword = password ? bcrypt.hashSync(password, 10) : undefined;

    if (username) {
      if (username.length < 5 && username.length > 20) {
        return next(
          errorHandler(400, "username must be at least 5 characters")
        );
      }

      if (username.includes(" ")) {
        return next(errorHandler(400, "username cannot contain space"));
      }

      if (username !== username.toLowerCase()) {
        return next(errorHandler(400, "username must be lowercase"));
      }

      if (!username.match(/^[a-zA-Z0-9]+$/)) {
        return next(errorHandler(400, "username contains invalid characters"));
      }
    }

    const updateUser = await User.findByIdAndUpdate(
      paramsUser,
      {
        $set: {
          username,
          email,
          password: hashPassword,
          profilePicture,
        },
      },
      { new: true }
    );

    const { password: pass, ...rest } = updateUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const paramsUser = req.params.userId;
    const tokenUser = req.user._id;

    if (paramsUser !== tokenUser.toString()) {
      return next(errorHandler(404, "User not Authenticated"));
    }

    await User.findByIdAndDelete(paramsUser);
    res.status(200).json("user deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    res.cookie("access_token", "", { maxAge: 0 });
    res.status(200).json("user signed out successfully");
  } catch (error) {
    next(err);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return next(errorHandler(404, "You must be an admin to to get users"));
    }

    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 7;
    const sortDir = req.query.sort === "asc" ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDir })
      .skip(startIndex)
      .limit(limit)
      .select("-password");

    const totalUsers = await User.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({ users, totalUsers, lastMonthUsers });
  } catch (error) {
    console.log(error);
  }
};

export const adminDeleteUser = async (req, res, next) => {
  try {
    const paramsUser = req.params.userId;
    const tokenUser = req.user._id;
    const admin = req.user.isAdmin;

    if (!admin && !tokenUser) {
      return next(errorHandler(404, "User not Admin"));
    }

    await User.findByIdAndDelete(paramsUser);
    res.status(200).json("user deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    const { password, ...rest } = user._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
