import { Alert, Button, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRef } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase.js";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import useUpdateProfile from "../../useHooks/useUpdateProfile.jsx";
import { useDispatch } from "react-redux";

import Toast from "react-hot-toast";
import useShowModal from "../../useHooks/useShowModal.jsx";
import useSignout from "../../useHooks/useSignout.jsx";
import { Link } from "react-router-dom";

const DashProfile = () => {
  const { currentUser, loading } = useSelector((state) => state.user);
  const imageRef = useRef();
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [formData, setFormData] = useState({});
  const { updateProfile } = useUpdateProfile();
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const { showModel } = useShowModal();
  const { signOut } = useSignout();

  //Handle image upload file
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  //upload image on firebase
  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageUploadError(null);

    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageUploadError(
          "cannot upload image (File must be less than 2 mb)"
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(formData).length === 0) {
      Toast.error("No changes made to the form");
      return;
    }

    if (imageFileUploading) {
      Toast.error("waiting for image file upload");
      return;
    }

    updateProfile(formData);
  };

  const handleDelete = () => {
    return showModel(showModal, setShowModal);
  };

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full ">
      <h1 className="text-center my-7 font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4 " onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
          hidden
          ref={imageRef}
        ></input>
        <div
          className="relative h-32 w-32 self-center cursor-pointer rounded-full overflow-hidden shadow-xl"
          onClick={() => imageRef.current.click()}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: "0",
                  left: "0",
                },
                path: {
                  stroke: `rgba(62,152,199), ${imageFileUploadProgress / 100}`,
                },
              }}
            />
          )}
          <img
            src={imageUrl || currentUser.profilePicture}
            className={`rounded-full w-full h-full border-8 border-[lightgray] object-cover ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              "opacity-60"
            }`}
            alt="Profile Pic"
          ></img>
        </div>

        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}

        <TextInput
          type="text"
          placeholder="Username"
          id="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        ></TextInput>
        <TextInput
          type="email"
          placeholder="Email Address"
          id="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        ></TextInput>
        <TextInput
          type="password"
          placeholder="password"
          id="password"
          defaultValue="************"
          onChange={handleChange}
        ></TextInput>

        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          className="uppercase "
          outline
          disabled={imageFileUploading || loading}
        >
          {loading ? "loading..." : "Update Profile"}
        </Button>
        {currentUser?.isAdmin === true && (
          <Link to="/create-post">
            <Button
              type="submit"
              gradientDuoTone="purpleToBlue"
              className="uppercase  w-full"
              outline
            >
              Create a Post
            </Button>
          </Link>
        )}
      </form>
      <div className="flex justify-between mt-5">
        <span
          className="cursor-pointer text-red-600"
          onClick={() => setShowModal(true)}
        >
          Delete Account
        </span>
        <span className="cursor-pointer text-red-500" onClick={handleSignOut}>
          Sign Out
        </span>
      </div>
      {showModal && handleDelete()}
    </div>
  );
};

export default DashProfile;
