import { Textarea } from "flowbite-react";
import React, { useEffect, useState } from "react";
import Toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import GetComment from "./GetComment";
import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const Comment = ({ post }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (comment.length === 0 || comment.length > 200) {
        Toast.error("Comment should be between 1 and 200 characters");
        return;
      }
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: comment,
          userId: currentUser._id,
          postId: post._id,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        Toast.error("Comment was not created");
        return;
      }

      if (res.ok) {
        Toast.success("Comment created successfully");
        setComment("");
        setComments([data, ...comments]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        if (!post) {
          return;
        }
        const res = await fetch(`/api/comment/getPostComment/${post._id}`, {
          method: "GET",
        });
        const data = await res.json();
        if (!res.ok) {
          Toast.error("Comment not found");
          return;
        }

        if (res.ok) {
          setComments(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchComments();
  }, [post]);

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }

      const res = await fetch(`/api/comment/likeComment/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (res.ok) {
        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  noOfLikes: data.likes.length,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = async (comment, editedComment) => {
    setComments(
      comments.map((cmnt) => {
        cmnt._id === comment._id ? { ...cmnt, content: editedComment } : cmnt;
      })
    );
  };

  const handleDelete = async (commentId) => {
    setOpenModal(false);
    try {
      if (!currentUser) {
        navigate("/sign-in");
      }
      const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        Toast.success("comment deleted successfully");
        setComments(comments.filter((comment) => comment._id !== commentId));
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>
            Signed in as :
            <span className="text-blue-500 hover:underline cursor-pointer font-semibold">
              {" "}
              {currentUser.email}
            </span>
          </p>
          <img
            src={currentUser.profilePicture}
            className="h-5 w-5 object-cover rounded-full"
            alt="profile"
          ></img>
          <Link
            to="/dashboard?tab=profile"
            className="text-xs text-cyan-600 hover:underline "
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm my-5 flex space-x-2">
          You must be logged in to comment
          <Link to="/sign-in">
            <span className="text-red-500 font-semibold cursor-pointer">
              {" "}
              Login Here
            </span>
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          className="border p-3 rounded-xl border-teal-500"
          onSubmit={handleSubmit}
        >
          <Textarea
            placeholder="Add a Comment"
            rows="3"
            maxLength="200"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></Textarea>
          <div className="flex justify-between mt-5 items-center">
            <p className="text-gray-500 text-sm">
              {200 - comment.length} Characters left...
            </p>
            <Button type="submit" gradientDuoTone="purpleToPink" outline>
              Submit
            </Button>
          </div>
        </form>
      )}
      {comments && comments.length > 0 ? (
        <>
          <div className="flex text-sm my-5 gap-1 items-center">
            <p>Comments</p>
            <div className="border rounded-sm px-2 border-gray-400 hover:bg-slate-500">
              <p>{comments.length}</p>
            </div>
          </div>
          {comments.map((comment) => (
            <GetComment
              key={comment._id}
              comment={comment}
              onLike={handleLike}
              onEdit={handleEdit}
              onDelete={(commentId) => {
                setOpenModal(true);
                setCommentToDelete(commentId);
              }}
            />
          ))}
          <Modal
            show={openModal}
            size="md"
            onClose={() => setOpenModal(false)}
            popup
          >
            <Modal.Header />
            <Modal.Body>
              <div className="text-center">
                <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete this comment?
                </h3>
                <div className="flex justify-center gap-4">
                  <Button
                    color="failure"
                    onClick={() => handleDelete(commentToDelete)}
                  >
                    {"Yes, I'm sure"}
                  </Button>
                  <Button color="gray" onClick={() => setOpenModal(false)}>
                    No, cancel
                  </Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </>
      ) : (
        <p className="text-sm my-5">There are no comments for this post..!</p>
      )}
    </div>
  );
};

export default Comment;
