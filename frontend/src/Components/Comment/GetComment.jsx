import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Button, Textarea, Toast } from "flowbite-react";

const GetComment = ({ comment, onLike, onEdit, onDelete }) => {
  const [user, setUser] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editComment, setEditComment] = useState("");

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/${comment.userId}`, {
          method: "GET",
        });

        const data = await res.json();

        if (!res.ok) {
          toast.error("Error fetching user");
          return;
        }

        setUser(data);
      } catch (error) {
        toast.error("Error fetching user");
        console.log(error);
      }
    };

    getUser();
  }, [comment.userId]);

  const handleEdit = async () => {
    setIsEditing(true);
    setEditComment(comment.content);
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/comment/editComment/${comment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: editComment }),
      });

      if (!res.ok) {
        Toast.error("Comment edit failed");
        return;
      }

      if (res.ok) {
        setIsEditing(false);
        onEdit(comment, editComment);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
      <div className="flex-shrink-0 mr-3">
        <img
          src={user?.profilePicture || "default-profile-picture-url"}
          alt={user?.username || "Anonymous user"}
          className="w-10 h-10 rounded-full bg-gray-200"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate">
            {user ? `@${user.username}` : "Anonymous user"}
          </span>
          <span className="text-xs text-gray-500 italic">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {isEditing ? (
          <>
            <Textarea
              className="mb-2 "
              value={editComment}
              onChange={(e) => setEditComment(e.target.value)}
            />
            <div className="flex gap-3 justify-end py-1">
              <Button
                type="submit"
                gradientDuoTone="purpleToPink"
                outline
                onClick={handleSave}
              >
                Save
              </Button>
              <Button type="submit" outline onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-500 mb-2">{comment.content}</p>
            <div className="flex items-center pt-2 text-xs border-t gap-2 max-w-fit dark:border-gray-700">
              <button
                type="button"
                onClick={() => onLike(comment._id)}
                className={`text-gray-400 hover:text-blue-500 ${
                  currentUser &&
                  comment.likes.includes(currentUser._id) &&
                  "!text-blue-500"
                }`}
              >
                <FaThumbsUp className="text-sm" />
              </button>
              <p className="text-gray-400">{comment.noOfLikes} like</p>
              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <>
                    <button
                      type="button"
                      onClick={handleEdit}
                      className="text-gray-400 hover:text-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="text-gray-400 hover:text-red-600"
                      onClick={() => onDelete(comment._id)}
                    >
                      Delete
                    </button>
                  </>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GetComment;
