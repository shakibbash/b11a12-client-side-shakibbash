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

import PostDetails from "../pages/PostDetails";
import Comments from "../pages/Comments";
import Membership from "../pages/Membership/Membership";
import MembershipPaymentForm from "../pages/Payment/MembershipPaymentForm";
import Payment from "../pages/Payment/Payment";


const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      {path:"/post/:postId" ,element:<PostDetails />},
          { path: "membership", element: <Membership /> },
          {path:'payments', element:<Payment></Payment>}
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
     
    ],
  },
  { path: "/*", element: <Error /> },
]);

export default router;

