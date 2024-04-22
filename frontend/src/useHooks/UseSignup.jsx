import { Alert } from "flowbite-react";
import React, { useState } from "react";
import Toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const UseSignup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const signUp = async ({ username, email, password }) => {
    const success = validInput({ username, email, password });

    if (!success) {
      return false;
    }
    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        return Toast.error(data.message);
      }
      setLoading(false);
      if (res.ok) {
        Toast.success(data.message);
        navigate("/sign-in");
      }
    } catch (error) {
      Toast.error(error.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return { signUp, loading };
};

export default UseSignup;

const validInput = ({ username, email, password }) => {
  if (!username || !email || !password) {
    Toast.error("Please Enter All required fields");
    return false;
  }
  if (username.length < 5) {
    Toast.error("Username must be at least 5 characters");
    return false;
  }

  if (password.length < 6) {
    Toast.error("password must be at least 6 characters");
    return false;
  }

  return true;
};
