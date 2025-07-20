import { AbilityContext } from '@app/casl/AbilityContext';
import { UserTable } from '@app/features/users/components/UserTable';
import routeNames from '@app/routes/route-names';
import { useAbility } from '@casl/react';
import { Navigate } from 'react-router-dom';

export const Users = () => {
  const ability = useAbility(AbilityContext);

  if (ability.cannot('manage', 'Roles')) {
    return <Navigate to={routeNames.notAuthorized()} />;
  }

  return (
    <div className="h-full w-full p-4 sm:p-6 lg:p-8">
      <div className="mx-auto h-full w-full max-w-7xl pb-6 sm:pb-8">
        <div className="mb-6 mt-4 sm:mt-6">
          <h1 className="text-foreground mb-2 text-2xl font-bold sm:text-3xl">Users</h1>
          <p className="text-muted-foreground">Manage and view all users in your organization</p>
        </div>

        {/* Search bar, Status Filter and Table */}
        <UserTable />
      </div>
    </div>
  );
};
