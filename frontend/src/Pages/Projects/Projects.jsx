import React from "react";
import CallToAction from "../../Components/Banner/CallToAction";

const Projects = () => {
  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-6 max-w-sm w-full mx-auto sm:max-w-md ">
      <div
        className="flex flex-col
       gap-6"
      >
        <p className="font-semibold">
          Are you want to learn the all Programming{" "}
          <span className="uppercase">Cheatsheet ? </span>
        </p>
        <p className="text-red-600">
          Click Let's Start button to visit OverAPI website..!
        </p>
      </div>
      <div className="w-xl">
        <CallToAction />
      </div>
    </div>
  );
};

export default Projects;
