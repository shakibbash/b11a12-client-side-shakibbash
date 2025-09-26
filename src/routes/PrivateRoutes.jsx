import React from 'react';
import { Navigate, useLocation } from 'react-router';
import useAuth from '../Hooks/useAuth';
// import Loader from '../Components/Loader';

const PrivateRoutes = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <p>......Loaidng</p>; 
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoutes;
