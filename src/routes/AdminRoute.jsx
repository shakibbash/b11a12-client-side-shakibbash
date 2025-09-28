import { Navigate, useLocation } from "react-router-dom";
import useUserRole from "../Hooks/useUserRole";
import Loader from "../Components/Loader";

const AdminRoute = ({ children }) => {
  const { userRole, isLoading } = useUserRole();
  const location = useLocation();

  if (isLoading) {
    return <Loader></Loader>;
  }

  if (userRole !== "admin") {
    return <Navigate to="/dashboard/profile" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminRoute;
