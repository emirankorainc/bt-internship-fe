import { AbilityContext } from '@app/casl/AbilityContext';
import routeNames from '@app/routes/route-names';
import { useAbility } from '@casl/react';
import { Navigate } from 'react-router-dom';

export const Evaluation = () => {
  const ability = useAbility(AbilityContext);

  if (ability.cannot('manage', 'UserBucket')) {
    return <Navigate to={routeNames.notAuthorized()} />;
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="mx-auto text-center pb-6 sm:pb-8">
        <h1 className="mb-4 text-2xl font-bold sm:text-4xl">Welcome to the Evaluations Page!</h1>
        <p className="text-base sm:text-lg">This is a simple example of a React component.</p>
      </div>
    </div>
  );
};
