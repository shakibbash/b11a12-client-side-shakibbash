import { useQuery } from '@tanstack/react-query';

import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';

const useUserRole = () => {
  const axios = useAxiosSecure();
  const { user, loading } = useAuth();

  const { data: userRole, isLoading, error, refetch } = useQuery({
    queryKey: ['userRole', user?.email],
    queryFn: async () => {
      if (!user?.email) return 'user'; // default fallback
      try {
        const response = await axios.get(`users/${user.email}`);
        return response.data?.role || 'user';
      } catch {
        return 'user'; 
      }
    },
    enabled: !!user?.email && !loading,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  return {
    userRole,
    isLoading: loading || isLoading,
    error,
    refetch,
    isAdmin: userRole === 'admin',
    isUser: userRole === 'user',
  };
};

export default useUserRole;
