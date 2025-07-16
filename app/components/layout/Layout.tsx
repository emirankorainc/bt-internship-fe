import { useAuth } from '@app/context/AuthContext';
import { SidebarProvider } from '../ui/sidebar';
import { AppSidebar } from './sidebar/AppSidebar';
import { Topbar } from './topbar/Topbar';
import { Outlet } from 'react-router-dom';

export const Layout = () => {
  const { isAuthenticated } = useAuth();

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full flex-col">
        <Topbar />

        <div className="flex flex-1 overflow-hidden pt-16">
          {isAuthenticated && <AppSidebar />}

          <main className="flex-1 overflow-auto bg-gray-100">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
