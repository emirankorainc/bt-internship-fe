import { useCheckAuth } from '@app/hooks/useCheckAuth';
import { Navigate } from 'react-router-dom';
import routeNames from './route-names';
import { useAuth } from '@app/provider/authProvider';
import { Layout } from '@app/components/layout/Layout';

export const ProtectedRoute = () => {
  const { isLoading } = useCheckAuth();
  const { isAuthenticated } = useAuth();

  if (isLoading) return null;

  if (!isAuthenticated && !isLoading) {
    return <Navigate to={routeNames.login()} />;
  }

  return <Layout />;
};
