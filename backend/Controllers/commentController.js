import Comment from "../Models/comment.model.js";

import { errorHandler } from "../utils/error.js";

export const createComment = async (req, res, next) => {
  try {
    const { content, userId, postId } = req.body;

    if (!content || !userId || !postId) {
      return next(errorHandler(404, "Everything is required"));
    }

    if (userId !== req.user._id.toString()) {
      return next(errorHandler(500, "Invalid user"));
    }

    const newComment = new Comment({
      content,
      userId,
      postId,
    });

    await newComment.save();

    res.status(200).json("Comment created successfully");
  } catch (error) {
    next(error);
  }
};

export const getComment = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    });

    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

export const likeComment = async (req, res, next) => {
  try {
    const command = await Comment.findById(req.params.commentId);
    if (!command) {
      return next(errorHandler(404, "no such comment for like"));
    }

    const userIndex = command.likes.indexOf(req.user._id.toString());

    if (userIndex === -1) {
      command.noOfLikes += 1;
      command.likes.push(req.user._id);
    } else {
      command.noOfLikes -= 1;
      command.likes.splice(userIndex, 1);
    }

    await command.save();

    res.status(200).json(command);
  } catch (error) {
    next(error);
  }
};

export const editComment = async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentId);
  if (!comment) {
    return next(errorHandler(404, "No comment found for edit"));
  }

  if (!req.user.isAdmin || comment.userId !== req.user._id.toString()) {
    return next(errorHandler(404, "You must be an admin to edit"));
  }
  const editComment = await Comment.findByIdAndUpdate(
    req.params.commentId,
    {
      $set: {
        content: req.body.content,
      },
    },
    { new: true }
  );

  await editComment.save();

  res.status(200).json(editComment);
};

export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return next(errorHandler(404, "no comment found"));
    }
    if (!req.user.isAdmin || comment.userId !== req.user._id.toString()) {
      return next(errorHandler(404, "You do not have permission to delete"));
    }

    await Comment.findByIdAndDelete(req.params.commentId);

    res.status(200).json("Comment deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const getAllComments = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return next(
        errorHandler(403, "You do not have permission to access these comments")
      );
    }

    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 7;
    const sortDir = req.query.sortDir === "asc" ? 1 : -1;

    const comments = await Comment.find()
      .sort({ createdAt: sortDir })
      .skip(startIndex)
      .limit(limit);

    const totalComments = await Comment.countDocuments();

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const recentPost = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({ allComments: comments, totalComments, recentPost });
  } catch (error) {
    next(error);
  }
};
