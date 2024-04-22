import { Button } from "flowbite-react";
import React from "react";

const CallToAction = () => {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
      <div className="flex-1 flex justify-center flex-col">
        <h2 className="text-3xl font-bold pb-4">Why Programming ?</h2>
        <p className="font-semibold dark:text-red-500 text-blue-600">
          where imagination meets innovation, and every line of code is a
          brushstroke on the canvas of possibility..!
        </p>
        <Button
          gradientDuoTone="purpleToPink"
          className="w-full rounded-tl-xl mt-6"
        >
          <a
            href="https://overapi.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Let's Start
          </a>
        </Button>
      </div>
      <div className="p-7 flex-1">
        <img
          src="https://quotefancy.com/media/wallpaper/3840x2160/8120700-eat-sleep-code-repeat-Wallpaper.jpg"
          alt="Programmer"
        ></img>
      </div>
    </div>
  );
};

export default CallToAction;
