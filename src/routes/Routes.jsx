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
import Payment from "../pages/Payment/Payment";

// New imports
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import AdminProfile from "../pages/AdminPages/AdminProfile";

import Announcement from "../pages/AdminPages/Announcement";
import ReportedActivities from "../pages/AdminPages/ReportedActivities ";
import ManageUsers from "../pages/AdminPages/ManageUsers";
import Notifications from "../pages/Notications";
import PrivateRoutes from "./PrivateRoute";
import AboutMe from "../pages/AboutMe";
import Contact from "../pages/Contact";

// Admin pages

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "post/:postId", element: <PrivateRoute><PostDetails /></PrivateRoute> },
      {path:"/notifications", element:<PrivateRoute><Notifications /></PrivateRoute>},
      { path: "membership", element:<PrivateRoute><Membership /></PrivateRoute>  },
      { path: "payments", element:<PrivateRoute><Payment /></PrivateRoute>  },
       { path: "about", element:<AboutMe></AboutMe> },
       {path:"contact",element:<Contact></Contact>}
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
    
      { path: "profile", element: <Profile /> },
      { path: "add-post", element: <AddPost /> },
      { path: "my-post", element: <MyPost /> },
      { path: "comments/:postId", element: <Comments /> },

    
      {
        path: "admin-profile",
        element: (
          <AdminRoute>
            <AdminProfile />
          </AdminRoute>
        ),
      },
      {
        path: "manage-users",
        element: (
          <AdminRoute>
          <ManageUsers></ManageUsers>
          </AdminRoute>
        ),
      },
      {
        path: "reports",
        element: (
          <AdminRoute>
                 <ReportedActivities></ReportedActivities>
          </AdminRoute>
        ),
      },
      {
        path: "announcement",
        element: (
          <AdminRoute>
            <Announcement />
          </AdminRoute>
        ),
      },
    ],
  },
  { path: "/*", element: <Error /> },
]);

export default router;
