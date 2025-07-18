import { QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { queryClient } from '../utils/query-client.ts';
import routeNames from './route-names.tsx';
import '../main.css';
import AuthProvider from '@app/context/AuthContext.tsx';
import { UnauthenticatedRoute } from './UnauthenticatedRoute.tsx';
import { ProtectedRoute } from './ProtectedRoute.tsx';
import { Layout } from '@app/components/layout/Layout.tsx';
import { Contact } from '@app/pages/Contact.tsx';
import { Home } from '@app/pages/Home.tsx';
import { Dashboard } from '@app/pages/Dashboard.tsx';
import { Evaluation } from '@app/pages/Evaluation.tsx';
import { People } from '@app/pages/People.tsx';
import { Roles } from '@app/pages/Roles.tsx';
import { Teams } from '@app/pages/Teams.tsx';
import { TeamView } from '@app/pages/TeamView.tsx';
import { TeamMembers } from '@app/pages/TeamMembers.tsx';
import { Users } from '@app/pages/Users.tsx';
import { Login } from '@app/pages/Login.tsx';
import { Register } from '@app/pages/Register.tsx';
import { GoogleRegister } from '@app/pages/GoogleRegister.tsx';
import { Buckets } from '@app/pages/Buckets.tsx';
import { BucketView } from '@app/pages/BucketView.tsx';
import { TeamMembersAdd } from '@app/pages/TeamMembersAdd.tsx';
import { UserDetail } from '@app/pages/UserDetail.tsx';
import { Profile } from '@app/pages/Profile.tsx';
import { Reports } from '@app/pages/Reports.tsx';
import { ReportDetail } from '@app/pages/ReportDetail.tsx';
import { CtoTicketTest } from '@app/pages/cto-ticket-test.tsx';
import { EmployeeTicketTest } from '@app/pages/employee-ticket-test.tsx';

const routesForPublic = [
  {
    path: '/',
    element: <Layout />,
    children: [{ path: routeNames.contact(), element: <Contact /> }],
  },
];

const routesForNotAuthenticated = [
  {
    path: '/',
    element: <UnauthenticatedRoute />,
    children: [
      { path: routeNames.root(), element: <Home /> },
      { path: routeNames.login(), element: <Login /> },
      { path: routeNames.register(), element: <Register /> },
      { path: routeNames.googleRegister(), element: <GoogleRegister /> },
    ],
  },
];

const routesForAuthenticated = [
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      { path: '/', element: <Navigate to={routeNames.dashboard()} replace /> },
      { path: routeNames.dashboard(), element: <Dashboard /> },
      { path: routeNames.people(), element: <People /> },
      { path: routeNames.userDetail(), element: <UserDetail /> },
      { path: routeNames.profile(), element: <Profile /> },
      { path: routeNames.buckets(), element: <Buckets /> },
      { path: routeNames.bucketView(), element: <BucketView /> },
      { path: routeNames.evaluation(), element: <Evaluation /> },
      { path: routeNames.teams(), element: <Teams /> },
      { path: routeNames.teamView(), element: <TeamView /> },
      { path: routeNames.teamMembers(), element: <TeamMembers /> },
      { path: routeNames.teamMembersAdd(), element: <TeamMembersAdd /> },
      { path: routeNames.users(), element: <Users /> },
      { path: routeNames.roles(), element: <Roles /> },
      { path: routeNames.reports(), element: <Reports /> },
      { path: routeNames.reportDetail(), element: <ReportDetail /> },
      // Test pages - will be role-based later
      { path: routeNames.ctoTicketTest(), element: <CtoTicketTest /> },
      { path: routeNames.employeeTicketTest(), element: <EmployeeTicketTest /> },
    ],
  },
];

const router = createBrowserRouter([
  ...routesForAuthenticated,
  ...routesForNotAuthenticated,
  ...routesForPublic,
]);

export default function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  );
}
