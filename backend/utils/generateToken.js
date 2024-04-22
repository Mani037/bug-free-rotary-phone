import jwt from "jsonwebtoken";

export const generateToken = (userId, admin, res) => {
  const token = jwt.sign({ userId, admin }, process.env.SECRET_KEY, {
    expiresIn: "15d",
  });

  res.cookie("access_token", token, {
    httpOnly: true,
    maxAge: 15 * 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV !== "development",
  });
};

export default generateToken;
