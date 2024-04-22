import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: "string",
      required: true,
    },
    title: {
      type: "String",
      required: true,
      unique: true,
    },
    content: {
      type: "String",
      required: true,
    },
    image: {
      type: "string",
      default:
        "https://www.monsterinsights.com/wp-content/uploads/2020/01/what-is-the-best-time-to-post-a-blog-and-how-to-test-it.jpg",
      required: true,
    },
    category: {
      type: "String",
      default: "unCategorized",
    },
    slug: {
      type: "String",
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);

const post = mongoose.models.Post || mongoose.model("Post", postSchema);

export default post;
