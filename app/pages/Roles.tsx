import { AbilityContext } from '@app/casl/AbilityContext';
import RolesTable from '@app/features/roles/components/RolesTable';
import routeNames from '@app/routes/route-names';
import { useAbility } from '@casl/react';
import { Navigate } from 'react-router-dom';

export const Roles = () => {
  const ability = useAbility(AbilityContext);

  if (ability.cannot('manage', 'Roles')) {
    <Navigate to={routeNames.notAuthorized()} />;
  }

  return (
    <div className="h-full w-full p-4 sm:p-6 lg:p-8">
      <div className="mx-auto h-full w-full max-w-7xl pb-6 sm:pb-8">
        <RolesTable />
      </div>
    </div>
  );
};
