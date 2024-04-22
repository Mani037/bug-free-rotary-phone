import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Toast from "react-hot-toast";
import { Table, Modal, Button } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const DashComments = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [allComments, setAllComments] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [commentId, setCommentId] = useState(null);
  const [UserLoading, setUserLoading] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setUserLoading(true);
        const res = await fetch("/api/comment/getComments", {
          method: "GET",
        });
        if (!res.ok) {
          Toast.error("error in fetching comment");
          setUserLoading(false);
          return;
        }
        const data = await res.json();
        if (res.ok) {
          setUserLoading(false);
          setAllComments(data.allComments);
        }
      } catch (error) {
        Toast.error("Error fetching user comments");
        setUserLoading(false);
      }
    };

    if (currentUser?.isAdmin) {
      fetchComments();
    }
  }, [currentUser?._id, currentUser?.isAdmin]);

  const handleShowMore = async () => {
    const startComments = allComments.length;
    try {
      const res = await fetch(
        `/api/comment/getComments?startIndex=${startComments}`
      );

      if (!res.ok) {
        Toast.error("failed to fetch post");
        return;
      }

      const data = await res.json();
      setAllComments((prevComments) => [...prevComments, ...data.allComments]);
      setShowMore(data.allComments.length >= 7);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        Toast.error("Couldn't delete user", data.message);
        return;
      }

      if (res.ok) {
        Toast.success("User deleted successfully by admin");
        setAllComments(() =>
          prevUser.filter((comment) => comment._id !== commentId)
        );
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll p-4 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 sm:ml-40 sm:mr-32">
      {UserLoading ? (
        <>
          <SkeletonTheme baseColor="#202020" highlightColor="#444">
            <Skeleton />
            <Skeleton count={20} />
          </SkeletonTheme>
        </>
      ) : (
        <>
          {currentUser?.isAdmin && allComments.length > 0 ? (
            <>
              <Table hoverable className="shadow-md">
                <Table.Head>
                  <Table.HeadCell>Date Updated</Table.HeadCell>
                  <Table.HeadCell>Comment Content</Table.HeadCell>
                  <Table.HeadCell>No of Likes</Table.HeadCell>
                  <Table.HeadCell>PostId</Table.HeadCell>
                  <Table.HeadCell>UserId</Table.HeadCell>
                  <Table.HeadCell>Delete</Table.HeadCell>
                </Table.Head>

                <Table.Body className="divide-y">
                  {allComments.map((comment) => (
                    <Table.Row
                      key={comment._id}
                      className="bg-white dark:border-white-700 dark:bg-gray-800"
                    >
                      <Table.Cell>
                        {new Date(comment.updatedAt).toLocaleDateString()}
                      </Table.Cell>
                      <Table.Cell className="text-xs line-clamp-2">
                        {comment.content}
                      </Table.Cell>
                      <Table.Cell className="font-bold dark:text-white text-nowrap">
                        {comment.noOfLikes}
                      </Table.Cell>
                      <Table.Cell className="font-bold dark:text-white text-nowrap">
                        {comment.postId}
                      </Table.Cell>
                      <Table.Cell className="font-bold dark:text-white text-nowrap">
                        {comment.userId}
                      </Table.Cell>
                      <Table.Cell>
                        <span
                          className="text-red-600 hover:underline cursor-pointer"
                          onClick={() => {
                            setShowModal(true);
                            setCommentId(comment._id);
                          }}
                        >
                          Delete
                        </span>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>

              {showMore && (
                <button
                  onClick={handleShowMore}
                  className="w-full text-teal-500 self-center hover:underline text-sm py-7"
                >
                  Show More
                </button>
              )}
            </>
          ) : (
            <p className="text-center text-red-500 font-semibold">
              No comments are available to Display
            </p>
          )}
        </>
      )}
      {showModal && (
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
                Are you sure you want to delete your comment?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={handleDeleteComment}>
                  Yes, I'm sure
                </Button>
                <Button color="gray" onClick={() => setShowModal(false)}>
                  No, cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export default DashComments;
