import React from "react";
import Toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import {
  signOutFailure,
  signOutStart,
  signOutSuccess,
} from "../redux/user/userSlice.js";
import { useNavigate } from "react-router-dom";

const useSignout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const signOut = async () => {
    try {
      dispatch(signOutStart());
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });

      const data = await res.json();
      if (!res.ok) {
        Toast.error(data.message);
        return;
      }
      if (res.ok) {
        Toast.success("Sign out successfully");
        dispatch(signOutSuccess());
        navigate("/sign-in");
      }
    } catch (error) {
      dispatch(signOutFailure());
    }
  };
  return { signOut };
};

export default useSignout;
