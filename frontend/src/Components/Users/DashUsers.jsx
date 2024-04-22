import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Toast from "react-hot-toast";
import { Table, Modal, Button } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { RxCross2 } from "react-icons/rx";
import { TiTick } from "react-icons/ti";

const DashUsers = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [allUsers, setAllUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userId, setUserId] = useState(null);
  const [UserLoading, setUserLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setUserLoading(true);
        const res = await fetch("/api/user/getusers", {
          method: "GET",
        });
        if (!res.ok) {
          Toast.error("error in fetching post");
          setUserLoading(false);
          return;
        }
        const data = await res.json();
        if (res.ok) {
          setUserLoading(false);
          setAllUsers(data.users);
          setShowMore(data.users.length >= 7);
        }
      } catch (error) {
        Toast.error("Error fetching user posts");
        setUserLoading(false);
      }
    };

    if (currentUser?.isAdmin) {
      fetchUsers();
    }
  }, [currentUser?._id, currentUser?.isAdmin]);

  const handleShowMore = async () => {
    const startUsers = allUsers.length;
    try {
      const res = await fetch(`/api/user/getusers?startIndex=${startUsers}`);

      if (!res.ok) {
        Toast.error("failed to fetch post");
        return;
      }

      const data = await res.json();
      setAllUsers((prevUsers) => [...prevUsers, ...data.users]);
      setShowMore(data.users.length >= 7);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/user/deleteUser/${userId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        Toast.error("Couldn't delete user", data.message);
        return;
      }

      if (res.ok) {
        Toast.success("User deleted successfully by admin");
        setAllUsers((prevUser) =>
          prevUser.filter((user) => user._id !== userId)
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
          {currentUser?.isAdmin && allUsers.length > 0 ? (
            <>
              <Table hoverable className="shadow-md">
                <Table.Head>
                  <Table.HeadCell>Created At</Table.HeadCell>
                  <Table.HeadCell>User image</Table.HeadCell>
                  <Table.HeadCell>username</Table.HeadCell>
                  <Table.HeadCell>Email</Table.HeadCell>
                  <Table.HeadCell>Admin</Table.HeadCell>
                  <Table.HeadCell>Delete</Table.HeadCell>
                </Table.Head>

                <Table.Body className="divide-y">
                  {allUsers.map((user) => (
                    <Table.Row
                      key={user._id}
                      className="bg-white dark:border-white-700 dark:bg-gray-800"
                    >
                      <Table.Cell>
                        {new Date(user.updatedAt).toLocaleDateString()}
                      </Table.Cell>
                      <Table.Cell>
                        <Link to={`/post/${user.slug}`}>
                          <img
                            src={user.profilePicture}
                            alt={user.username}
                            height="40"
                            width="50"
                            className="object-cover rounded-full"
                          />
                        </Link>
                      </Table.Cell>
                      <Table.Cell className="font-bold dark:text-white text-nowrap">
                        {user.username}
                      </Table.Cell>
                      <Table.Cell className="font-bold dark:text-white text-nowrap">
                        {user.email}
                      </Table.Cell>
                      <Table.Cell>
                        {user.isAdmin === true ? (
                          <TiTick className="h-5 w-5 text-green-500" />
                        ) : (
                          <RxCross2 className="h-5 w-5 text-red-600" />
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        <span
                          className="text-red-600 hover:underline cursor-pointer"
                          onClick={() => {
                            setShowModal(true);
                            setUserId(user._id);
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
                <Button color="failure" onClick={handleDeleteUser}>
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

export default DashUsers;
