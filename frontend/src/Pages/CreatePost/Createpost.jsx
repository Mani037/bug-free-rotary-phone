import React, { useState } from "react";
import { Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase.js";
import Toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Createpost = () => {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const handleUploadImage = async () => {
    //Firebase upload
    try {
      if (!file) {
        Toast.error("No file to upload");
        return;
      }

      const storage = getStorage(app);

      const fileName = new Date().getTime() + "-" + file.name;

      const storageRef = ref(storage, fileName);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          const totalBytes = progress.toFixed(0);

          setImageUploadProgress(totalBytes);
        },
        (error) => {
          Toast.error("error uploading a image");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            Toast.success("upload image completed");
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      Toast.error("Image upload failed");
      setImageUploadProgress(null);
      console.log(error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/post/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        Toast.error("Post Creation failed", data.message);
        return;
      }

      if (res.ok) {
        Toast.success("Post created successfully");
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      Toast.error("something went wrong");
      console.log(error);
    }
  };
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-4xl font-bold text-center uppercase my-7">
        Create a Post
      </h1>
      <form className="text-black flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            className="w-full "
            required
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          ></TextInput>
          <Select
            name="Select a category"
            required
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value="unCategorized">Select a category</option>
            <option value="reactjs">React Js</option>
            <option value="nodejs">Node Js</option>
            <option value="nextjs">Next Js</option>
          </Select>
        </div>
        <div className="flex gap-4 justify-between items-center border-4 border-teal-500 border-dotted p-4">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          ></FileInput>
          <Button
            gradientDuoTone="purpleToBlue"
            type="submit"
            className="text-nowrap"
            size="sm"
            outline
            onClick={handleUploadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? "Uploading..." : "upload image"}
          </Button>
        </div>
        {formData && formData.image && (
          <img
            src={`${formData.image}`}
            alt="upload"
            className="w-xl object-cover h-40"
          ></img>
        )}
        <ReactQuill
          theme="snow"
          className="h-40 md:h-60 text-white mb-12"
          onChange={(value) => setFormData({ ...formData, content: value })}
        />
        <Button type="submit" outline gradientDuoTone="purpleToPink">
          Publish
        </Button>
      </form>
    </div>
  );
};

export default Createpost;
