import { createBrowserRouter } from "react-router";
import Home from "../pages/Home";
import Error from "../pages/Error";
import RootLayout from "../Layouts/RootLayouts";
import Login from "../pages/Login";

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
      }
     
     
    ],
    
  },
    {
        path: "/*",
        element: <Error />,
    },
]);

export default router;
