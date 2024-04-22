import React, { useState } from "react";
import { Button, Label, Spinner, TextInput } from "flowbite-react";
import { Link } from "react-router-dom";
import useSignin from "../../useHooks/useSignin.jsx";
import { useSelector } from "react-redux";
import OAuth from "../../Components/Oauth/OAuth.jsx";

const Signin = () => {
  const [formData, setFormData] = useState({});
  const { signIn } = useSignin();

  const { loading } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    signIn(formData);
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
            Step into a world of knowledge and inspiration! Unlock the full
            potential of our blog by signing in. Dive into insightful articles,
            connect with like-minded individuals, and tailor your reading
            experience to your interests. Let's embark on this journey together!
            <span className="text-pink-600 block text-lg hover:brightness-125">
              Let's Login..!
            </span>
          </p>
        </div>
        {/* Right */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
              {loading ? <Spinner size="sm" /> : "Sign in"}
            </Button>
            <OAuth />
            <span className="flex gap-2 mt-2 text-sm ">
              Dont't Have An Account ?
              <Link to="/sign-up " className="font-bold">
                <span className="text-blue-500  hover:underline">SIGN UP</span>
              </Link>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signin;
