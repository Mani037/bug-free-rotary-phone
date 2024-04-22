import Toast from "react-hot-toast";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Spinner } from "flowbite-react";
import CallToAction from "../../Components/Banner/CallToAction";
import Comment from "../../Components/Comment/Comment";
import PostCard from "../../Components/Posts/PostCard";

const Postpage = () => {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getPost?slug=${postSlug}`, {
          method: "GET",
        });

        const data = await res.json();

        if (!res.ok) {
          Toast.error("Error in fetching post");
          setLoading(false);
          return;
        }
        if (res.ok) {
          setLoading(false);
          setPost(data.posts[0]);
        }
      } catch (error) {
        Toast.error("Error in fetching post");
        console.log(error);
      }
    };
    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    setLoading(true);
    const recentPost = async () => {
      try {
        const res = await fetch("/api/post/getPost?limit=3", {
          method: "GET",
        });

        const data = await res.json();

        if (!res.ok) {
          console.log("Fetching failed", data.message);
          return;
        }

        if (res.ok) {
          setRecentPosts(data.posts);
        }
      } catch (error) {
        console.log(error);
      }
    };
    recentPost();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }
  return (
    <main className="flex flex-col min-h-screen p-3 max-w-6xl mx-auto w-full">
      <h1 className="text-center text-3xl font-bold p-3 mt-10 font-serif max-w-6xl mx-auto w-full uppercase lg:text-4xl">
        {post?.title}
      </h1>
      <Link
        to={`/search?category=${post?.category}`}
        className="self-center mt-5"
      >
        <Button color="gray" pill size="xs">
          {post?.category}
        </Button>
      </Link>
      <img
        src={post?.image}
        alt={post?.title}
        className="object-cover mt-10 p-3 max-h-[600px] w-full hover:scale-90 border border-gray-600  transition-all "
      ></img>
      <div className="flex justify-between p-3  border-b border-slate-600 w-full max-w-2xl text-xs mx-auto">
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>

        <span className="italic">
          {post && (post.content.length / 1000).toFixed(0)} min's read{" "}
        </span>
      </div>

      <div
        className="p-3 max-w-2xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{ __html: post?.content }}
      ></div>
      <div className="max-w-4xl mx-auto w-full">
        <CallToAction />
      </div>
      {post && <Comment post={post} />}

      <div className="flex flex-col justify-center items-center mb-5">
        <h1 className="text-2xl font-bold text-center mt-5 underline">
          Recent Articles
        </h1>
        <div className="flex gap-5 justify-center mt-5 flex-wrap md:p-20 md:flex-nowrap">
          {recentPosts?.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Postpage;
