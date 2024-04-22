import { TextInput, Select, Button } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "../../Components/Posts/PostCard";

const Search = () => {
  const location = useLocation();
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "uncategorized",
  });
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(false);

  console.log(posts);

  useEffect(() => {
    const URLParams = new URLSearchParams(location.search);
    const searchTermFromUrl = URLParams.get("searchTerm");
    const categoryFromUrl = URLParams.get("category");
    const sortFromUrl = URLParams.get("sort");

    if (searchTermFromUrl || categoryFromUrl || sortFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl,
      });
    }

    const fetchPosts = async () => {
      try {
        setLoading(true);
        const searchQuery = URLParams.toString();
        const res = await fetch(`/api/post/getPost?${searchQuery}`, {
          method: "GET",
        });
        const data = await res.json();
        if (!res.ok) {
          setLoading(false);
          console.error("Error fetching posts:", data.message);
          return;
        }
        if (res.ok) {
          setLoading(false);
          console.log(data);
          setPosts(data.posts);
          if (data.posts.length === 7) {
            setShowMore(true);
          } else {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    };
    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: value });
    }

    if (id === "sort") {
      const order = value || "desc";
      setSidebarData({ ...sidebarData, sort: order });
    }

    if (id === "category") {
      const defaultCategory = value || "uncategorized";
      setSidebarData({ ...sidebarData, category: defaultCategory });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("category", sidebarData.category);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleShowMore = async () => {
    try {
      const numberOfPosts = posts.length;
      const startIndex = numberOfPosts;
      const urlParams = new URLSearchParams(location.search);
      urlParams.set("startIndex", startIndex);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/post/getPost?${searchQuery}`, {
        method: "GET",
      });
      if (!res.ok) {
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setPosts([...posts, ...data.posts]);
        if (data.posts.length === 7) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-4 border-b md:border-r md:min-h-screen border-gray-800">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">Search:</label>
            <TextInput
              placeholder="Search"
              id="searchTerm"
              type="text"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="gap-6 flex items-center ">
            <label className="font-semibold ">Sort:</label>
            <Select
              className="text-black"
              id="sort"
              value={sidebarData.sort}
              onChange={handleChange}
            >
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>
          <div className="gap-2 flex items-center ">
            <label className="font-semibold ">Category:</label>
            <Select
              className="text-black"
              id="category"
              value={sidebarData.category}
              onChange={handleChange}
            >
              <option value="unCategorized">unCategorized</option>
              <option value="reactjs">react js</option>
              <option value="nextjs">next js</option>
              <option value="javascript">javascript</option>
            </Select>
          </div>
          <Button type="submit" outline className="uppercase">
            Search
          </Button>
        </form>
      </div>
      <div className="w-full">
        <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5">
          Post Results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && posts.length === 0 && (
            <p className="text-xl text-gray-500">No Posts Found</p>
          )}
          {loading && (
            <p className="text-center text-xl text-gray-400">Loading...</p>
          )}
          {!loading &&
            posts &&
            posts.map((post) => <PostCard key={post._id} post={post} />)}
          {showMore && (
            <button
              className="w-full mx-auto hover:underline"
              onClick={handleShowMore}
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
