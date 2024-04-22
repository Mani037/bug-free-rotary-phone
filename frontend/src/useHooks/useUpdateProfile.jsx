import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateInSuccess,
  updateStart,
  updateInFailure,
} from "../redux/user/userSlice.js";
import Toast from "react-hot-toast";
const useUpdateProfile = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const updateProfile = async (formData) => {
    try {
      dispatch(updateStart());

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        dispatch(updateInFailure(data.message));
        Toast.error("error in updating");
        return;
      }
      dispatch(updateInSuccess(data));
      Toast.success("Updated successfully");
    } catch (error) {
      dispatch(updateInFailure(error));
    }
  };
  return { updateProfile };
};

export default useUpdateProfile;
