import { SortDirection, UserType } from '../../../types/types';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';

import { MoreVertical, Search, X } from 'lucide-react';

import { getStatusColor } from '@app/utils/getStatusColor';

import { useFilteredUsers } from '../hooks/useFilteredUsers';

import { SortableHeader } from './SortableHeader';
import { PaginationControls } from './PaginationControls';
import { USER_TABLE_COLUMNS } from '@app/constants/constants';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@app/components/ui/dropdown-menu';
import { Button } from '@app/components/ui/button';
import { useGetAllUsers } from '@app/hooks/user/useGetAllUsers';

export default function UserTable() {
  const { data } = useGetAllUsers();
  const users = data || [];

  const {
    filteredUsers,
    currentItems,
    currentPage,
    totalPages,
    indexOfFirstItem,
    indexOfLastItem,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sortConfig,
    setSortConfig,
    setCurrentPage,
  } = useFilteredUsers(users);

  const hasPagination = filteredUsers.length > 10;

  const clearSearch = () => setSearchQuery('');

  const handleSort = (key: keyof UserType) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === SortDirection.Ascending
          ? SortDirection.Descending
          : SortDirection.Ascending,
    }));
  };

  return (
    <div className="mx-auto mt-22 w-full max-w-7xl">
      {/* SEARCH & FILTER */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="relative w-full max-w-6xl flex-1 md:w-auto">
          <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search users..."
            className="bg-primary-foreground h-[36px] pr-10 pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="text-muted-foreground hover:text-foreground absolute top-2.5 right-2.5"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </button>
          )}
        </div>

        <div className="h-[36px] w-full md:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-primary-foreground w-full md:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-md border">
        <Table className="bg-primary-foreground rounded-lg">
          <TableHeader>
            <TableRow>
              {USER_TABLE_COLUMNS.map((key) => (
                <SortableHeader
                  key={key}
                  column={key as keyof UserType}
                  sortKey={sortConfig.key as keyof UserType}
                  direction={sortConfig.direction}
                  onSort={handleSort}
                />
              ))}
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentItems.length > 0 ? (
              currentItems.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role.name}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(user.status)} variant="outline">
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end"></DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      {hasPagination && (
        <div className="flex justify-center py-4">
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}

      <div className="text-muted-foreground mt-2 text-center text-sm">
        Showing {filteredUsers.length > 0 ? indexOfFirstItem + 1 : 0} to{' '}
        {Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length} users
      </div>
    </div>
  );
}
