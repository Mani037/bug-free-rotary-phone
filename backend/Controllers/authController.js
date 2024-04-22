import User from "../Models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import generateToken from "../utils/generateToken.js";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return next(errorHandler(500, "All fields must be required"));
  }

  const user = await User.findOne({ username });

  if (user === username) {
    return next(
      errorHandler(500, " username already taken try another uername")
    );
  }

  const hashPassword = bcrypt.hashSync(password, 10);

  try {
    const newUser = await new User({
      username,
      email,
      password: hashPassword,
    });

    newUser.save();

    res.status(200).json({ message: "Sign up successfully" });
  } catch (error) {
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(errorHandler(401, "both username and password are required"));
    }

    const user = await User.findOne({ email });

    if (!user) {
      return next(errorHandler(401, "user not found"));
    }

    const validPassword = bcrypt.compareSync(password, user?.password || "");

    if (!validPassword) {
      return next(errorHandler(401, "Invalid Password"));
    }

    generateToken(user._id, user.isAdmin, res);

    const { password: pass, ...rest } = user._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const googleAuth = async (req, res, next) => {
  try {
    const { name, email, googlePhotoUrl } = req.body;

    const user = await User.findOne({ email: email });

    if (user) {
      generateToken(user._id, user.isAdmin, res);

      const { password, ...rest } = user._doc;

      res.status(200).json(rest);
    } else {
      const generatePassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const hashPassword = bcrypt.hashSync(generatePassword, 10);

      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashPassword,
        profilePicture: googlePhotoUrl,
      });

      await newUser.save();

      generateToken(newUser._id, newUser.isAdmin, res);

      const { password, ...rest } = newUser._doc;

      res.status(200).json(rest);
    }
  } catch (error) {
    return next(error);
  }
};
