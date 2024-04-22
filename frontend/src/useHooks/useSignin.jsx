import React, { useState } from "react";
import Toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/user/userSlice.js";

import { useNavigate } from "react-router-dom";
const useSignin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const signIn = async ({ email, password }) => {
    const success = validInput({ email, password });

    if (!success) {
      return false;
    }

    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signIn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        dispatch(signInFailure(data.message));
        Toast.error(data.message);
        return;
      }

      if (res.ok) {
        dispatch(signInSuccess(data));
        Toast.success("sign in success");
        navigate("/");
      }
    } catch (error) {
      Toast.error(error.message);
      dispatch(signInFailure(error.message));
    }
  };
  return { signIn };
};

export default useSignin;

const validInput = ({ email, password }) => {
  if (!email || !password) {
    Toast.error("Please enter your email address and password");
    return false;
  }

  if (password.length < 6) {
    Toast.error("Please enter a valid password");
    return false;
  }

  return true;
};
