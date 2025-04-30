import { Button } from '@app/components/ui/button';
import routeNames from '@app/routes/route-names';
import { Link } from 'react-router-dom';

export const Home = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-100">
      <h1 className="mb-4 text-4xl font-bold">Welcome to the Home Page!</h1>
      <p className="text-lg">This is a simple example of a React component.</p>
      <div className="flex flex-row gap-2 py-4">
        <Button>
          <Link to={routeNames.login()}>Login</Link>
        </Button>
        <Button variant="outline">
          <Link to={routeNames.register()}>Register</Link>
        </Button>
      </div>
    </div>
  );
};
