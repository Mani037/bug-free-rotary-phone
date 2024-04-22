import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../../Components/DashBoards/DashSidebar.jsx";
import DashProfile from "../../Components/DashBoards/DashProfile.jsx";
import DashPosts from "../../Components/Posts/DashPosts.jsx";
import DashUsers from "../../Components/Users/DashUsers.jsx";
import DashComments from "../../Components/DashBoards/DashComments.jsx";
import AdminDash from "../../Components/DashBoards/AdminDash.jsx";

const DashBoard = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl !== null) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <div className="min-h-screen flex  flex-col md:flex-row">
      <div className="md:w-56 ">
        {/* sidebar */}
        <DashSidebar />
      </div>
      <div className="w-full">
        {/* Profile */}
        {tab === "profile" && <DashProfile />}
        {tab === "posts" && <DashPosts />}
        {tab === "users" && <DashUsers />}
        {tab === "comments" && <DashComments />}
        {tab === "dashData" && <AdminDash />}
      </div>
    </div>
  );
};

export default DashBoard;
