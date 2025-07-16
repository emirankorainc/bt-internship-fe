import { useParams, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { UserType } from '@app/types/types';
import { useGetAllUsers } from '@app/hooks/user/useGetAllUsers';
import { useGetUserBucketsById } from '@app/hooks/bucket';
import { UserBucketLevel } from '@app/types/bucket';
import { Mail, Phone, Calendar, User, Shield, Target, ArrowLeft } from 'lucide-react';
import { Spinner } from '@app/components/ui/spinner';
import routeNames from '@app/routes/route-names';

export const UserDetail = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { users, isLoading } = useGetAllUsers();

  // Find the specific user
  const user = users?.find((u: UserType) => u.id === userId);

  // Get user buckets
  const { buckets: userBuckets, isLoading: bucketsLoading } = useGetUserBucketsById(userId || '');

  // Generate initials for avatar fallback
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleBackButton = () => {
    navigate(routeNames.people());
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold">User Not Found</h2>
          <p className="mb-4 text-gray-600">The user you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/people')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to People
          </Button>
        </div>
      </div>
    );
  }

  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <div className="h-full w-full p-4 sm:p-6 lg:p-8">
      <div className="mx-auto h-full w-full max-w-7xl pb-6 sm:pb-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 mt-4 sm:mt-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackButton}
              className="text-muted-foreground hover:text-foreground flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to People
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          {/* Left Column - Basic Info & Contact */}
          <div className="w-full space-y-6 lg:w-1/3">
            {/* Avatar, name, status and role */}
            <Card>
              <CardHeader className="flex items-center justify-center">
                <Avatar className="my-4 size-20">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                    {getInitials(user.firstName, user.lastName)}
                  </AvatarFallback>
                </Avatar>
              </CardHeader>
              <CardContent className="w-full">
                <CardTitle className="inline-flex items-center gap-2 text-lg sm:text-xl">
                  <User className="size-5" />
                  User Information
                </CardTitle>
                <CardDescription className="py-2">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-base sm:text-lg font-medium">First Name</p>
                      <p className="text-primary">{user.firstName}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-base sm:text-lg font-medium">Last Name</p>
                      <p className="text-foreground">{user.lastName}</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-1">
                    <p className="text-muted-foreground text-base sm:text-lg font-medium">Status</p>
                    <p className="text-foreground capitalize">{user.status.toLowerCase()}</p>
                  </div>
                </CardDescription>
              </CardContent>
            </Card>

            {/* Role & Permissions */}
            <Card>
              <CardHeader>
                <CardTitle className="inline-flex items-center gap-2 text-lg sm:text-xl">
                  <Shield className="size-5" />
                  {'Role & Permissions'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 py-2">
                <p className="text-muted-foreground text-base sm:text-lg font-medium">Role</p>
                <p className="text-foreground capitalize">{user.role.name}</p>
                {user.role.description && (
                  <p className="text-muted-foreground text-sm">{user.role.description}</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Contact & Buckets */}
          <div className="w-full space-y-6 lg:w-2/3">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="inline-flex items-center gap-2 text-lg sm:text-xl">
                  <Mail className="size-5" />
                  {'Contact & Additional Information'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 rounded-xl p-3">
                    <Mail className="text-primary size-4" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm sm:text-md font-medium">Email</p>
                    <p className="text-foreground text-sm break-all">{user.email}</p>
                  </div>
                </div>

                {user.phoneNumber && (
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 rounded-xl p-3">
                      <Phone className="text-primary size-4" />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm sm:text-md font-medium">Phone</p>
                      <p className="text-foreground text-sm break-all">{user.phoneNumber}</p>
                    </div>
                  </div>
                )}

                {user.dateOfBirth && (
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 rounded-xl p-3">
                      <Calendar className="text-primary size-4" />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm sm:text-md font-medium">Date of Birth</p>
                      <p className="text-foreground text-sm">{formatDate(user.dateOfBirth)}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* User Buckets */}
            <Card className="flex-1">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Target className="size-4" />
                  User Buckets
                </CardTitle>
              </CardHeader>
              <CardContent>
                {bucketsLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <p className="text-muted-foreground">Loading buckets...</p>
                  </div>
                ) : userBuckets && userBuckets.length > 0 ? (
                  <div className="grid max-h-48 grid-cols-1 gap-3 overflow-y-auto sm:grid-cols-2">
                    {userBuckets.map((userBucket: UserBucketLevel) => (
                      <div
                        key={userBucket.bucketLevelId}
                        className="bg-muted/30 rounded-lg border p-3"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <h4 className="text-foreground text-sm sm:text-md font-medium">
                            {userBucket.bucket.category.name}
                          </h4>
                          <Badge variant="outline" className="text-sm">
                            Level {userBucket.bucket.level}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm">
                          {userBucket.bucket.category.description || 'No description available'}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-4">
                    <p className="text-muted-foreground">No buckets assigned to this user</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
