import React, { useState } from "react";
import { Button, Label, Spinner, TextInput } from "flowbite-react";
import { Link } from "react-router-dom";
import UseSignup from "../../useHooks/UseSignup.jsx";
import OAuth from "../../Components/Oauth/OAuth.jsx";

const SignUp = () => {
  const [formData, setFormData] = useState({});

  const { signUp, loading } = UseSignup();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    signUp(formData);
  };

  return (
    <div className="min-h-screen mt-20  ">
      <div className="flex p-3 max-w-3xl  mx-auto flex-col md:flex-row md:items-center gap-5 ">
        {/* Left */}
        <div className="flex-1">
          <p className="text-4xl font-bold">
            <span className="px-2 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white text-md">
              MindMingle
            </span>
            Blog
          </p>
          <p className="text-sm mt-5 font-semibold">
            Welcome's You - Ignite Your Thoughts! Dive into a community where
            ideas flow freely. Share, connect, and inspire. Sign up now and
            unleash your voice.
            <span className="text-pink-600 block text-lg hover:brightness-125">
              Let's create together..!
            </span>
          </p>
        </div>
        {/* Right */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="">
              <Label value="Your Username :"></Label>
              <TextInput
                type="text"
                placeholder="Enter username"
                id="username"
                onChange={handleChange}
              />
            </div>
            <div className="">
              <Label value="Your Email :"></Label>
              <TextInput
                type="email"
                placeholder="Enter email address"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div className="">
              <Label value="Your Password :"></Label>
              <TextInput
                type="password"
                placeholder="Enter Password"
                id="password"
                onChange={handleChange}
              />
            </div>

            <Button
              gradientDuoTone={"purpleToPink"}
              type="submit"
              className=" uppercase"
              disabled={loading}
            >
              {loading ? <Spinner size="sm" /> : "Sign Up"}
            </Button>
            <OAuth />
            <span className="flex gap-2 mt-2 text-sm ">
              <Link to="/sign-in " className="font-bold">
                Have An Account ?
              </Link>
              <span className="text-blue-500  hover:underline">SIGN IN</span>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
