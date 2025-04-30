import { Button } from '@app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@app/components/ui/dropdown-menu';
import routeNames from '@app/routes/route-names';
import { Settings, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const UserMenu = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate(routeNames.root());
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
      <DropdownMenuContent className="mt-2 mr-1 w-44">
        <DropdownMenuGroup>
          <DropdownMenuItem className="mb-2 flex flex-col gap-0">
            <p className="font-semibold">FirstName LastName</p>
            <p className="text-primary/80">email@example.com</p>
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
