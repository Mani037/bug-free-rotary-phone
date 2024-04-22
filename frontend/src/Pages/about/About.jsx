import React from "react";

const About = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center 
    "
    >
      <div className="max-w-2xl mx-auto p-3 text-center">
        <div>
          <h1 className="text-3xl font font-semibold text-center my-7">
            About MindMingle's Blog
          </h1>
          <div className="text-md text-gray-500 flex flex-col gap-6">
            <p>
              Welcome to MindMingle's Blog Blog! This blog was created to share
              the thoughts and ideas with the world. MindMingle's Blog is a
              passionate Blog who loves to write about technology, coding, and
              everything in between.
            </p>

            <p>
              On this blog, you'll find weekly articles and cheatSheet on
              technologies such as web development, software engineering, and
              programming languages. Join our vibrant community where diverse
              voices converge to share, learn, and grow together.
            </p>

            <p>
              We encourage you to leave comments on our posts and engage with
              other readers. You can like other people's comments and reply to
              them as well. We believe that a community of learners can help
              each other grow and improve.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
