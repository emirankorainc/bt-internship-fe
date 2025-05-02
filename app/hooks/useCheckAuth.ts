import { useAuth } from '@app/provider/authProvider';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

const apiUrl = import.meta.env.VITE_API_URL;

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: Date;
  roleId: string;
}

const fetchCurrentUser = async (): Promise<User> => {
  const res = await fetch(apiUrl + '/api/user/current-user', {
    method: 'GET',
    credentials: 'include',
  });

  if (!res.ok) throw new Error('Unauthorized');

  return res.json();
};

export const useCheckAuth = () => {
  const { setIsAuthenticated, setUser } = useAuth();

  const {
    data: user,
    isLoading,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ['current-user'],
    queryFn: fetchCurrentUser,
    retry: false,
  });

  useEffect(() => {
    if (isSuccess) {
      setIsAuthenticated(true);
      setUser(user);
    }
  }, [user, isSuccess, setIsAuthenticated, setUser]);

  useEffect(() => {
    if (isError) {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, [isError, setUser, setIsAuthenticated]);

  return { isLoading };
};
