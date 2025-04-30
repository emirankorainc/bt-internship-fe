import { Button } from '../../ui/button';
import logo from '@app/assets/logo/bloomteq_logo.png';
import { Link } from 'react-router-dom';
import { Bell, MessageCircleIcon, UserRound } from 'lucide-react';
import { TopbarButton } from './TopbarButton';
import { UserMenu } from './UserMenu';
import { useAuth } from '@app/provider/authProvider';
import routeNames from '@app/routes/route-names';

export const Topbar = () => {
  const { token } = useAuth();

  return (
    <div className="bg-primary fixed z-10 inline-flex h-16 w-full items-center justify-between">
      <div className="inline-flex h-full items-center gap-2 pl-1 md:pl-4">
        {token && <TopbarButton />}
        <Link to="/" className="flex h-full items-center hover:opacity-80 min-lg:pl-4">
          <img src={logo} alt="Bloomteq Logo" className="text-secondary h-22" />
        </Link>
      </div>
      <div className="inline-flex h-full items-center gap-4 pr-3 md:pr-8">
        <Button
          variant="ghost"
          className="hover:bg-primary/0 text-secondary hover:text-secondary/80 h-full w-8 cursor-pointer"
        >
          <MessageCircleIcon className="size-6" />
        </Button>
        <Button
          variant="ghost"
          className="hover:bg-primary/0 text-secondary hover:text-secondary/80 h-full w-8 cursor-pointer"
        >
          <Bell className="size-6" />
        </Button>
        {token ? (
          <UserMenu />
        ) : (
          <Button variant="secondary">
            <Link to={routeNames.login()}>Login</Link>
          </Button>
        )}
      </div>
    </div>
  );
};
