import { createBrowserRouter } from "react-router";
import Home from "../pages/Home";
import Error from "../pages/Error";
import RootLayout from "../Layouts/RootLayouts";
import Login from "../pages/Login";
import Register from "../pages/Register";
import DashboardLayout from "../Layouts/DashBoardLayout";
import Profile from "../pages/Dashboard/Profile";
import AddPost from "../pages/Dashboard/AddPost";
import MyPost from "../pages/Dashboard/MyPost";
import Membership from "../pages/Dashboard/Membership";
import PostDetails from "../pages/PostDetails";
import Comments from "../pages/Comments";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      {path:"/post/:postId" ,element:<PostDetails />},
       
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      { path: "profile", element: <Profile /> },       
      { path: "add-post", element: <AddPost /> },      
      { path: "my-post", element: <MyPost /> },  
      {path:"comments/:postId" ,element:<Comments />},      
      { path: "membership", element: <Membership /> }  
    ],
  },
  { path: "/*", element: <Error /> },
]);

export default router;

