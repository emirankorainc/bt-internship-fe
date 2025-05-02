import { Button } from '@app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@app/components/ui/dropdown-menu';
import { useAuth } from '@app/provider/authProvider';
import routeNames from '@app/routes/route-names';
import { useMutation } from '@tanstack/react-query';
import { Settings, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_URL;

const logout = async () => {
  const res = await fetch(apiUrl + '/api/auth/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Logout failed');
  }

  return res.json();
};

export const UserMenu = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      navigate(routeNames.root());
      window.location.reload();
    },
  });

  const handleLogout = () => {
    mutate();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          className="hover:bg-secondary/80 ml-0 h-12 w-12 cursor-pointer rounded-full md:ml-2"
        >
          <UserRound className="size-8" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mt-2 mr-1 w-56">
        <DropdownMenuGroup>
          <DropdownMenuItem className="mb-2 flex flex-col gap-0">
            <p className="w-full text-start text-lg font-semibold">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-primary/80 w-full">{user?.email}</p>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuGroup className="mx-2">
          <DropdownMenuItem>
            <UserRound />
            Profile
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuGroup className="mx-2">
          <DropdownMenuItem>
            <Settings />
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuGroup className="mt-2">
          <DropdownMenuItem>
            <Button onClick={handleLogout} className="w-full">
              Log out
            </Button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
