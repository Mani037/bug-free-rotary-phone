import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import SignUp from "./Pages/SignUp/SignUp";
import Signin from "./Pages/signIn/Signin";
import Projects from "./Pages/Projects/Projects";
import DashBoard from "./Pages/DashBoard/DashBoard";
import About from "./Pages/about/About";
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer.jsx";
import { Toaster } from "react-hot-toast";
import ProtectRoute from "./Components/Protect/ProtectRoute.jsx";
import Createpost from "./Pages/CreatePost/Createpost.jsx";
import AdminRoute from "./Components/Protect/AdminRoute.jsx";
import DashPosts from "./Components/Posts/DashPosts.jsx";
import UpdatePost from "./Pages/updatePost/UpdatePost.jsx";
import Postpage from "./Pages/Post/Postpage.jsx";
import Scroll from "./Components/ScrollToTop/Scroll.jsx";
import Search from "./Pages/search/Search.jsx";
const App = () => {
  return (
    <BrowserRouter>
      <Scroll />
      <Header />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/sign-up" element={<SignUp />}></Route>
        <Route path="/sign-in" element={<Signin />}></Route>
        <Route path="/cheatSheet" element={<Projects />}></Route>
        <Route path="/search" element={<Search />}></Route>
        <Route element={<ProtectRoute />}>
          <Route path="/dashboard" element={<DashBoard />}></Route>
        </Route>
        <Route element={<AdminRoute />}>
          <Route path="/create-post" element={<Createpost />}></Route>
          <Route path="/update-post/:postId" element={<UpdatePost />}></Route>
        </Route>

        <Route path="/post/:postSlug" element={<Postpage />}></Route>
        <Route path="/about" element={<About />}></Route>
      </Routes>

      <Footer />
      <Toaster position="bottom-center" reverseOrder={false} />
    </BrowserRouter>
  );
};

export default App;
