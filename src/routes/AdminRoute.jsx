import { Navigate, useLocation } from "react-router-dom";
import useUserRole from "../Hooks/useUserRole";

const AdminRoute = ({ children }) => {
  const { userRole, isLoading } = useUserRole();
  const location = useLocation();

  if (isLoading) {
    return <p>Checking role...</p>; // show loader until role loads
  }

  if (userRole !== "admin") {
    return <Navigate to="/dashboard/profile" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminRoute;
