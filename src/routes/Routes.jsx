import { createBrowserRouter } from "react-router";
import Home from "../pages/Home";
import Error from "../pages/Error";
import RootLayout from "../Layouts/RootLayouts";

const router = createBrowserRouter([
    {
    path: "/",
    element: <RootLayout />,
   
    children: [
      {
        index: true,
        element: <Home />,
      },
     
     
    ],
    
  },
    {
        path: "/*",
        element: <Error />,
    },
]);

export default router;
