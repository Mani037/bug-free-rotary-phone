import { Button, Modal } from "flowbite-react";
import { useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

import { useNavigate } from "react-router-dom";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
} from "../redux/user/userSlice.js";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-hot-toast";

const useShowModal = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const showModel = (showModal, setShowModal) => {
    //fetch
    const handleDeleteUser = async () => {
      setShowModal(false);
      try {
        deleteUserStart();
        const res = await fetch(`/api/user/delete/${currentUser._id}`, {
          method: "DELETE",
        });

        const data = await res.json();

        if (!res.ok) {
          dispatch(deleteUserFailure());
          Toast.error("error deleting user");
          return;
        }

        if (res.ok) {
          dispatch(deleteUserSuccess());
          Toast.error("User deleted successfully");
          navigate("/sign-up");
        }
      } catch (error) {
        dispatch(deleteUserFailure());
      }
    };
    return (
      <>
        <Modal
          show={showModal}
          size="md"
          onClose={() => setShowModal(false)}
          popup
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Are you sure you want to delete your Account?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={handleDeleteUser}>
                  {"Yes, I'm sure"}
                </Button>
                <Button color="gray" onClick={() => setShowModal(false)}>
                  No, cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </>
    );
  };
  return { showModel };
};

export default useShowModal;
