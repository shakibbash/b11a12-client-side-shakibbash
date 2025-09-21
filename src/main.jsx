import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import router from "./routes/Routes";
import AuthProvider from "./Provider/AuthProvider";
import {

  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
// Create a client
const queryClient = new QueryClient()
createRoot(document.getElementById("root")).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <div className="font-urbanist ">
         <RouterProvider router={router} />
       </div>
  </AuthProvider>
        </QueryClientProvider>
  
    </StrictMode>
);
