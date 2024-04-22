import React from "react";
import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import {
  BsFacebook,
  BsInstagram,
  BsTwitterX,
  BsWhatsapp,
  BsGithub,
} from "react-icons/bs";

const Footers = () => {
  return (
    <Footer
      container
      className="border border-t-8 border-teal-500 relative bottom-0  overflow-auto h-32"
    >
      <div className="w-full max-w-7xl  mx-auto ">
        <div className="grid w-full sm: justify-between  sm:flex grid-cols-1 ">
          <div className="sm:mt-20">
            <Link
              to="/"
              className="self-center  whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
            >
              <span className="px-2 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white text-md">
                MindMingle
              </span>
              Blog
            </Link>
          </div>
          <div className="sm:grid flex sm:grid-cols-3 gap-3 mt-4 sm:gap-6 space-x-14 whitespace-nowrap">
            <div>
              <Footer.Title title="about" />
              <Footer.LinkGroup className="flex flex-col space-y-4 ">
                <Footer.Link href="#">MERN Projects</Footer.Link>
                <Footer.Link href="#">MindMingle Blog</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Connect" />
              <Footer.LinkGroup className="flex flex-col gap-4">
                <Footer.Link href="#">Github</Footer.Link>
                <Footer.Link href="#">Instagram </Footer.Link>
              </Footer.LinkGroup>
            </div>

            <div>
              <Footer.Title title="legal" />
              <Footer.LinkGroup className="space-y-4 flex flex-col">
                <Footer.Link href="#">Privacy Policy</Footer.Link>
                <Footer.Link href="#">Terms &amp; Condition</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className="flex w-full justify-between">
          <Footer.Copyright
            href="#"
            by="MindMingle Blog"
            year={new Date().getFullYear()}
          />
          <div className="flex gap-2 ">
            <Footer.Icon href="#" icon={BsFacebook} />
            <Footer.Icon href="#" icon={BsInstagram} />
            <Footer.Icon href="#" icon={BsTwitterX} />
            <Footer.Icon href="#" icon={BsWhatsapp} />
            <Footer.Icon href="#" icon={BsGithub} />
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default Footers;
