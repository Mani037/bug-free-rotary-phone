import post from "../Models/post.model.js";
import { errorHandler } from "../utils/error.js";

export const createPost = async (req, res, next) => {
  try {
    const admin = req.user.isAdmin;
    const userId = req.user._id;

    if (!admin) {
      return next(
        errorHandler(404, "You do not have permission to create a post")
      );
    }

    if (!req.body.title || !req.body.content) {
      return next(errorHandler(404, "Everything is required"));
    }

    const slug = req.body.title
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, "");

    const Post = new post({
      ...req.body,
      slug,
      userId,
    });

    const savedPost = await Post.save();

    res.status(200).json(savedPost);
  } catch (error) {
    next(error);
  }
};

export const getPosts = async (req, res, next) => {
  try {
    const startIndex = req.query.startIndex || 0;
    const limit = req.query.limit || 7;
    const sortDir = req.query.sortDir === "asc" ? 1 : -1;

    const query = {
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    };

    const posts = await post
      .find(query)
      .sort({ updatedAt: sortDir })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await post.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPost = await post.countDocuments({
      ...query,
      createdAt: { $gt: oneMonthAgo },
    });

    res.status(200).json({ posts, totalPosts, lastMonthPost });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    if (!req.user.isAdmin || req.user._id.toString() !== req.params.userId) {
      return next(errorHandler(404, "Admin only delete the post"));
    }

    await post.findByIdAndDelete(req.params.postId);
    res.status(200).json("Post deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    if (!req.user.isAdmin || req.user._id.toString() !== req.params.userId) {
      return next(errorHandler(402, "Only admin can update post"));
    }

    const updatedPost = await post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          image: req.body.image,
          category: req.body.category,
        },
      },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};
