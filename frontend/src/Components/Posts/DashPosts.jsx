import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Toast from "react-hot-toast";
import { Table, Modal, Button } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const DashPosts = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postId, setPostId] = useState(null);
  const [postLoading, setPostLoading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setPostLoading(true);
        const res = await fetch(`/api/post/getPost?userId=${currentUser._id}`, {
          method: "GET",
        });
        if (!res.ok) {
          Toast.error("error in fetching post");
          setPostLoading(false);
          return;
        }
        const data = await res.json();
        if (res.ok) {
          setPostLoading(false);
          setUserPosts(data.posts);
          setShowMore(data.posts.length >= 7);
        }
      } catch (error) {
        Toast.error("Error fetching user posts");
        setPostLoading(false);
      }
    };

    if (currentUser?.isAdmin) {
      fetchPost();
    }
  }, [currentUser?._id, currentUser?.isAdmin]);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(
        `/api/post/getPost?userId=${currentUser._id}&startIndex=${startIndex}`
      );

      if (!res.ok) {
        Toast.error("failed to fetch post");
        return;
      }

      const data = await res.json();
      setUserPosts((prevPosts) => [...prevPosts, ...data.posts]);
      setShowMore(data.posts.length >= 7);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/post/delete/${postId}/${currentUser._id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        Toast.error("Error deleting post");
      }

      Toast.success("Post deleted successfully");
      setUserPosts((prevPosts) =>
        prevPosts.filter((post) => post._id !== postId)
      );
    } catch (error) {
      console.error("Error deleting post:", error);
      Toast.error("Failed to delete post");
    }
  };

  return (
    <div className="table-auto overflow-x-scroll p-4 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 sm:ml-40 sm:mr-32">
      {postLoading ? (
        <>
          <SkeletonTheme baseColor="#202020" highlightColor="#444">
            <Skeleton />
            <Skeleton count={20} />
          </SkeletonTheme>
        </>
      ) : (
        <>
          {currentUser?.isAdmin && userPosts.length > 0 ? (
            <>
              <Table hoverable className="shadow-md">
                <Table.Head>
                  <Table.HeadCell>Date Updated</Table.HeadCell>
                  <Table.HeadCell>Post image</Table.HeadCell>
                  <Table.HeadCell>Post Title</Table.HeadCell>
                  <Table.HeadCell>Post Category</Table.HeadCell>
                  <Table.HeadCell>Delete</Table.HeadCell>
                  <Table.HeadCell>Edit</Table.HeadCell>
                </Table.Head>

                <Table.Body className="divide-y">
                  {userPosts.map((post) => (
                    <Table.Row
                      key={post._id}
                      className="bg-white dark:border-white-700 dark:bg-gray-800"
                    >
                      <Table.Cell>
                        {new Date(post.updatedAt).toLocaleDateString()}
                      </Table.Cell>
                      <Table.Cell>
                        <Link to={`/post/${post.slug}`}>
                          <img
                            src={post.image}
                            alt={post.title}
                            height="40"
                            width="50"
                            className="object-cover"
                          />
                        </Link>
                      </Table.Cell>
                      <Table.Cell className="font-bold dark:text-white text-nowrap">
                        {post.title}
                      </Table.Cell>
                      <Table.Cell>{post.category}</Table.Cell>
                      <Table.Cell>
                        <span
                          className="text-red-600 hover:underline cursor-pointer"
                          onClick={() => {
                            setShowModal(true);
                            setPostId(post._id);
                          }}
                        >
                          Delete
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <Link
                          className="text-teal-500 hover:underline cursor-pointer"
                          to={`/update-post/${post._id}`}
                        >
                          Edit
                        </Link>
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
              No posts are available to Display
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
                Are you sure you want to delete your Post?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={handleDeletePost}>
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

export default DashPosts;
