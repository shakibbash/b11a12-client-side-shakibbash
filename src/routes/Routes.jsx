import { createBrowserRouter } from "react-router";
import Home from "../pages/Home";
import Error from "../pages/Error";
import RootLayout from "../Layouts/RootLayouts";
import Login from "../pages/Login";
import Register from "../pages/Register";

const router = createBrowserRouter([
    {
    path: "/",
    element: <RootLayout />,
   
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path:'/login',
        element:<Login></Login>
      },
      {
        path:'/register',
         element:<Register></Register>
     
      },
     
     
    ],
    
  },
    {
        path: "/*",
        element: <Error />,
    },
]);

export default router;
