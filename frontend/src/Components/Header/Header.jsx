import React, { useEffect, useState } from "react";
import { Avatar, Button, Navbar, TextInput, Dropdown } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { toggleTheme } from "../../redux/theme/themeSlice.js";
import useSignOut from "../../useHooks/useSignout.jsx";

const Header = () => {
  const path = useLocation().pathname;
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);
  const [searchTerm, setSearchTerm] = useState("");
  const { signOut } = useSignOut();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const newUrl = new URLSearchParams(location.search);
    const getUrl = newUrl.get("searchTerm");
    if (getUrl) {
      setSearchTerm(getUrl);
    }
  }, [location.search]);

  const handleSearch = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleSignout = () => {
    signOut();
  };
  return (
    <Navbar className="border-b-2 shadow-md ">
      <Link
        to="/"
        className="self-center  whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
      >
        <span className="px-2 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white text-md">
          MindMingle
        </span>
        Blog
      </Link>

      <form onSubmit={handleSearch}>
        <TextInput
          type="search"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        ></TextInput>
      </form>
      <Button className="w-12 h-10 lg:hidden " color="gray" pill>
        <AiOutlineSearch
          onClick={handleSearch}
          className="text-xl cursor-pointer"
        />
      </Button>

      <div className="flex space-x-4 md:order-2">
        <Button
          className="w-12 h-10 rounded-full hidden sm:inline"
          color="gray"
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "dark" ? (
            <FaSun className="text-lg" />
          ) : (
            <FaMoon className="text-xl" />
          )}
        </Button>

        {currentUser ? (
          <Dropdown
            label={
              <Avatar
                alt="User settings"
                img={currentUser?.profilePicture}
                rounded
                bordered
              />
            }
            arrowIcon={false}
            inline
          >
            <Dropdown.Header>
              <span className="block text-sm">{currentUser?.username}</span>
              <span className="block truncate text-sm font-medium">
                {currentUser?.email}
              </span>
            </Dropdown.Header>
            <Link to={"/dashboard?tab=profile"}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>

            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to="/sign-in">
            <Button gradientDuoTone="purpleToBlue" outline>
              Sign In
            </Button>
          </Link>
        )}
        <Navbar.Toggle />
      </div>

      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link to="/" className="hover:underline">
            Home
          </Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/cheatSheet"} as={"div"}>
          <Link to="/cheatSheet" className="hover:underline">
            CheatSheet
          </Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link to="/about" className="hover:underline">
            About
          </Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
