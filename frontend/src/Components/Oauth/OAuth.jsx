import { Button } from "flowbite-react";
import React from "react";
import { AiFillGoogleSquare } from "react-icons/ai";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../.././firebase.js";
import Toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../../redux/user/userSlice.js";
import { useNavigate } from "react-router-dom";

const OAuth = () => {
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const resultFromGoogle = await signInWithPopup(auth, provider);

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: resultFromGoogle.user.displayName,
          email: resultFromGoogle.user.email,
          googlePhotoUrl: resultFromGoogle.user.photoURL,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        Toast.error("Google fetch failed");
      }

      if (res.ok) {
        Toast.success("Login successful");
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <Button
        type="button"
        outline
        gradientDuoTone="pinkToOrange"
        className="w-full"
        onClick={handleGoogleClick}
      >
        <AiFillGoogleSquare className="w-6  h-6 mr-1 mt-1" />
        <span className="mt-1.5">CONTINUE WITH GOOGLE</span>
      </Button>
    </div>
  );
};

export default OAuth;
