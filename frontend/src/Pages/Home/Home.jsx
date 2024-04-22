import React, { useEffect, useState } from "react";
import { Button } from "flowbite-react";
import { Link } from "react-router-dom";
import CallToAction from "../../Components/Banner/CallToAction";
import PostCard from "../../Components/Posts/PostCard";

const Home = () => {
  const [posts, setPosts] = useState([]);
  console.log(posts);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/post/getPost?limit=4", {
          method: "GET",
        });

        const data = await res.json();

        if (!res.ok) {
          console.log("error in fetching posts");
          return;
        }

        if (res.ok) {
          setPosts(data.posts);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchPosts();
  }, []);
  return (
    <div className="min-h-screen">
      <div className=" flex flex-col gap-6 p-28 px-3 max-w-xl mx-auto">
        <h1 className="text-3xl font-bold lg:text-6xl text-pink-500">
          Welcome to Mind Mingle Blog
        </h1>
        <p className="text-xs sm:text-sm text-gray-400">
          where inspiration fuels action! Explore captivating stories, expert
          tips, and join a community of go-getters. Unleash your potential,
          seize opportunities, and start writing your success story today..!
        </p>
        <Link
          to="/search"
          className="text-xs sm:text-sm text-teal-500 font-bold hover:underline"
        >
          View all posts
        </Link>
      </div>
      <div className="p-6 bg-amber-100 dark:bg-slate-700">
        <CallToAction />
      </div>
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
        {posts && posts.length > 0 && (
          <>
            <div className="">
              <h1 className="text-2xl font-semibold text-center">
                Recent Posts
              </h1>

              <div className="flex flex-col gap-4 md:flex-row mt-7">
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            </div>
            <Link
              to="/search"
              className="text-lg text-teal-500 hover:underline text-center "
            >
              View All Posts
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
