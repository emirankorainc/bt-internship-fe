import RolesTable from '@app/features/roles/components/RolesTable';

export const Roles = () => {
  return (
    <div className="h-full w-full p-4 sm:p-6 lg:p-8">
      <div className="mx-auto h-full w-full max-w-7xl pb-6 sm:pb-8">
        <RolesTable />
      </div>
    </div>
  );
};
