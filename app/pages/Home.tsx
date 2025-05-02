import { Button } from '@app/components/ui/button';
import routeNames from '@app/routes/route-names';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
  const navigate = useNavigate();

  const handleLoginBtn = () => navigate(routeNames.login());
  const handleRegisterBtn = () => navigate(routeNames.register());

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-100">
      <h1 className="mb-4 text-4xl font-bold">Welcome to the Home Page!</h1>
      <p className="text-lg">This is a simple example of a React component.</p>
      <div className="flex flex-row gap-2 py-4">
        <Button onClick={handleLoginBtn} size="lg">
          Login
        </Button>
        <Button onClick={handleRegisterBtn} variant="outline" size="lg">
          Register
        </Button>
      </div>
    </div>
  );
};
