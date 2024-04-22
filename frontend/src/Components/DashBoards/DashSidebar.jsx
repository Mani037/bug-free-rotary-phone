import React, { useEffect, useState } from "react";
import { Sidebar } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { MdAdminPanelSettings } from "react-icons/md";
import { VscSignOut } from "react-icons/vsc";
import useSignout from "../../useHooks/useSignout.jsx";
import { useSelector } from "react-redux";
import { IoDocumentsSharp } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";
import { FaComments } from "react-icons/fa";
import { MdAnalytics } from "react-icons/md";

const DashSidebar = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");

  const { signOut } = useSignout();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl !== null) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className="sm:h-full shadow-2xl ">
      <Sidebar className="w-full md:w-56">
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <Sidebar.Item
              href="/dashboard?tab=profile"
              label={currentUser?.isAdmin ? "Admin" : "User"}
              labelColor="dark"
              icon={MdAdminPanelSettings}
              active={tab === "profile"}
            >
              Profile
            </Sidebar.Item>

            {currentUser?.isAdmin && (
              <Sidebar.Item
                href="/dashboard?tab=posts"
                icon={IoDocumentsSharp}
                active={tab === "posts"}
              >
                Posts
              </Sidebar.Item>
            )}

            <Sidebar.Item
              href="/dashboard?tab=users"
              icon={FaUsers}
              className="cursor-pointer"
              active={tab === "users"}
            >
              Users
            </Sidebar.Item>
            <Sidebar.Item
              href="/dashboard?tab=comments"
              icon={FaComments}
              className="cursor-pointer"
              active={tab === "comments"}
            >
              Comments
            </Sidebar.Item>
            <Sidebar.Item
              href="/dashboard?tab=dashData"
              icon={MdAnalytics}
              className="cursor-pointer"
              active={tab === "dashData"}
            >
              Data
            </Sidebar.Item>
            <Sidebar.Item
              onClick={handleSignOut}
              icon={VscSignOut}
              className="cursor-pointer"
            >
              Sign Out
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  );
};

export default DashSidebar;
