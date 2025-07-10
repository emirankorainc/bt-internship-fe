import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllUsersApi } from '@app/api/user-api';
import {
  evaluateUserForPromotion,
  evaluateSelfForPromotion,
  getPromotionStatistics,
  directPromoteUser,
  type UserWithDetails,
} from '@app/api/promotion-api';

// UI Components
import { Button } from '@app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@app/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@app/components/ui/select';
import { Input } from '@app/components/ui/input';
import { Label } from '@app/components/ui/label';
import { Badge } from '@app/components/ui/badge';
import { Checkbox } from '@app/components/ui/checkbox';
import { Alert, AlertDescription } from '@app/components/ui/alert';
import { Spinner } from '@app/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@app/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@app/components/ui/dialog';
import { Textarea } from '@app/components/ui/textarea';

// Icons
import {
  Users,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  Calendar,
  Zap,
  Target,
  Award,
  User,
  Crown,
} from 'lucide-react';

export const PromotionChecker = () => {
  const queryClient = useQueryClient();

  // State
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<UserWithDetails | null>(null);
  const [selectedBucket, setSelectedBucket] = useState<string>('');
  const [analysisStartDate, setAnalysisStartDate] = useState<string>('');
  const [analysisEndDate, setAnalysisEndDate] = useState<string>('');
  const [autoNotifyCTO, setAutoNotifyCTO] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // CTO Promotion Dialog State
  const [isPromotionDialogOpen, setIsPromotionDialogOpen] = useState<boolean>(false);
  const [promotionReason, setPromotionReason] = useState<string>('');
  const [promotionEffectiveDate, setPromotionEffectiveDate] = useState<string>('');

  // Queries
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsersApi,
  });

  const { data: promotionStats } = useQuery({
    queryKey: ['promotionStatistics'],
    queryFn: getPromotionStatistics,
  });

  // Mutations
  const evaluationMutation = useMutation({
    mutationFn: evaluateUserForPromotion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotionStatistics'] });
    },
  });

  const selfEvaluationMutation = useMutation({
    mutationFn: () =>
      evaluateSelfForPromotion(analysisStartDate, analysisEndDate, selectedBucket || undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotionStatistics'] });
    },
  });

  const directPromotionMutation = useMutation({
    mutationFn: ({
      userId,
      reason,
      effectiveDate,
    }: {
      userId: string;
      reason: string;
      effectiveDate?: string;
    }) => directPromoteUser(userId, reason, effectiveDate),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['promotionStatistics'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsPromotionDialogOpen(false);
      setPromotionReason('');
      setPromotionEffectiveDate('');
      alert(`✅ ${data.message}`);
    },
    onError: (error) => {
      alert(`❌ Promotion failed: ${error.message}`);
    },
  });

  // Effects
  useEffect(() => {
    if (selectedUserId && users) {
      const user = users.find((u: UserWithDetails) => u.id === selectedUserId);
      setSelectedUser(user || null);
      setSelectedBucket(''); // Reset bucket selection when user changes
    }
  }, [selectedUserId, users]);

  // Set default date range (last 6 months)
  useEffect(() => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);

    setAnalysisEndDate(endDate.toISOString().split('T')[0]);
    setAnalysisStartDate(startDate.toISOString().split('T')[0]);
  }, []);

  // Filter users based on search
  const filteredUsers =
    users?.filter(
      (user: UserWithDetails) =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  // Handlers
  const handleRunEvaluation = () => {
    if (!selectedUserId) return;

    evaluationMutation.mutate({
      userId: selectedUserId,
      trigger: 'manual',
      analysisStartDate,
      analysisEndDate,
      targetBucket: selectedBucket || undefined,
    });
  };

  const handleSelfEvaluation = () => {
    selfEvaluationMutation.mutate();
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-50';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getPromotionStatusIcon = (isReady: boolean) => {
    return isReady ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <XCircle className="h-5 w-5 text-red-500" />
    );
  };

  // Get current evaluation result
  const evaluationResult = evaluationMutation.data || selfEvaluationMutation.data;
  const isEvaluating = evaluationMutation.isPending || selfEvaluationMutation.isPending;

  return (
    <div className="min-h-screen bg-gray-50/50 p-4">
      <div className="mx-auto max-w-7xl space-y-4">
        {/* Compact Header */}
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Promotion Evaluation Center</h1>
                <p className="text-sm text-gray-600">AI-powered career advancement analysis</p>
              </div>
            </div>
            {promotionStats && (
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{promotionStats.totalUsers}</div>
                  <div className="text-xs text-gray-500">Total Users</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">
                    {promotionStats.readyForPromotion}
                  </div>
                  <div className="text-xs text-gray-500">Ready</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">
                    {promotionStats.evaluationsThisMonth}
                  </div>
                  <div className="text-xs text-gray-500">This Month</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          {/* Left Panel - Controls (Compact) */}
          <div className="space-y-4">
            {/* User Selection */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="h-4 w-4" />
                  User Selection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="relative">
                  <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-9 pl-10"
                  />
                </div>
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Choose user..." />
                  </SelectTrigger>
                  <SelectContent>
                    {usersLoading ? (
                      <SelectItem value="loading" disabled>
                        Loading users...
                      </SelectItem>
                    ) : (
                      filteredUsers.map((user: UserWithDetails) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.firstName} {user.lastName}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleSelfEvaluation}
                  disabled={isEvaluating}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  {isEvaluating && selfEvaluationMutation.isPending ? (
                    <Spinner className="mr-2 h-3 w-3" />
                  ) : (
                    <User className="mr-2 h-3 w-3" />
                  )}
                  Evaluate Myself
                </Button>
              </CardContent>
            </Card>

            {/* Bucket Selection for Multi-Bucket Users */}
            {selectedUser && selectedUser.buckets && selectedUser.buckets.length > 1 && (
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Target className="h-4 w-4" />
                    Career Track Selection
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="mb-2 text-xs text-gray-600">
                    {selectedUser.firstName} has multiple career tracks. Select which one to
                    evaluate:
                  </div>
                  <Select value={selectedBucket} onValueChange={setSelectedBucket}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Choose career track..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Primary Track (Auto-select)</SelectItem>
                      {selectedUser.buckets?.map((userBucket, index) => (
                        <SelectItem key={index} value={userBucket.bucket.category.name}>
                          {userBucket.bucket.category.name} Level {userBucket.bucket.level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="text-xs text-blue-600">
                    💡 Available tracks:{' '}
                    {selectedUser.buckets?.map((ub) => ub.bucket.category.name).join(', ')}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Configuration */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Calendar className="h-4 w-4" />
                  Analysis Period
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="start-date" className="text-xs">
                      Start
                    </Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={analysisStartDate}
                      onChange={(e) => setAnalysisStartDate(e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div>
                    <Label htmlFor="end-date" className="text-xs">
                      End
                    </Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={analysisEndDate}
                      onChange={(e) => setAnalysisEndDate(e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="auto-notify"
                    checked={autoNotifyCTO}
                    onCheckedChange={(checked) => setAutoNotifyCTO(checked === true)}
                  />
                  <Label htmlFor="auto-notify" className="text-xs">
                    Auto-notify CTO
                  </Label>
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={handleRunEvaluation}
                    disabled={!selectedUserId || isEvaluating}
                    className="w-full"
                    size="sm"
                  >
                    {isEvaluating && evaluationMutation.isPending ? (
                      <Spinner className="mr-2 h-3 w-3" />
                    ) : (
                      <Zap className="mr-2 h-3 w-3" />
                    )}
                    Run Promotion Evaluation
                  </Button>

                  {selectedUserId && (
                    <Dialog open={isPromotionDialogOpen} onOpenChange={setIsPromotionDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full gap-2" size="sm">
                          <Crown className="h-3 w-3" />
                          CTO Direct Promote
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Direct CTO Promotion</DialogTitle>
                          <DialogDescription>
                            Promote {selectedUser?.firstName} {selectedUser?.lastName} directly
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="reason" className="text-right">
                              Reason
                            </Label>
                            <Textarea
                              id="reason"
                              value={promotionReason}
                              onChange={(e) => setPromotionReason(e.target.value)}
                              placeholder="Why should this user be promoted?"
                              className="col-span-3"
                              rows={3}
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="effectiveDate" className="text-right">
                              Effective Date
                            </Label>
                            <Input
                              id="effectiveDate"
                              type="date"
                              value={promotionEffectiveDate}
                              onChange={(e) => setPromotionEffectiveDate(e.target.value)}
                              className="col-span-3"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            type="submit"
                            onClick={() => {
                              if (!promotionReason.trim()) {
                                alert('Please provide a reason for promotion');
                                return;
                              }
                              directPromotionMutation.mutate({
                                userId: selectedUserId,
                                reason: promotionReason,
                                effectiveDate: promotionEffectiveDate || undefined,
                              });
                            }}
                            disabled={directPromotionMutation.isPending}
                            className="gap-2"
                          >
                            {directPromotionMutation.isPending && <Spinner className="h-4 w-4" />}
                            <Crown className="h-4 w-4" />
                            Promote User
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center Panel - User Overview (Compact) */}
          <div className="space-y-4">
            {selectedUser ? (
              <>
                <Card className="shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">User Profile</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h3 className="text-sm font-semibold">
                        {selectedUser.firstName} {selectedUser.lastName}
                      </h3>
                      <p className="text-xs text-gray-600">{selectedUser.email}</p>
                    </div>
                    {selectedUser.role && (
                      <Badge variant="outline" className="text-xs">
                        {selectedUser.role.name}
                      </Badge>
                    )}
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <div className="rounded bg-gray-50 p-2 text-center">
                        <div className="text-sm font-bold text-blue-600">
                          {selectedUser.tickets?.length || 0}
                        </div>
                        <div className="text-xs text-gray-500">Tickets</div>
                      </div>
                      <div className="rounded bg-gray-50 p-2 text-center">
                        <div className="text-sm font-bold text-green-600">
                          {selectedUser.teams?.length || 0}
                        </div>
                        <div className="text-xs text-gray-500">Teams</div>
                      </div>
                      <div className="rounded bg-gray-50 p-2 text-center">
                        <div className="text-sm font-bold text-purple-600">
                          {selectedUser.reports?.length || 0}
                        </div>
                        <div className="text-xs text-gray-500">Reports</div>
                      </div>
                      <div className="rounded bg-gray-50 p-2 text-center">
                        <div className="text-sm font-bold text-orange-600">
                          {selectedUser.buckets?.length || 0}
                        </div>
                        <div className="text-xs text-gray-500">Buckets</div>
                      </div>
                    </div>
                    {selectedUser.buckets && selectedUser.buckets.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-medium text-gray-700">Current Buckets:</h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedUser.buckets.map((bucket, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {bucket.category} L{bucket.level}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Compact Teams & Buckets */}
                {selectedUser.teams && selectedUser.teams.length > 0 && (
                  <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Teams</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {selectedUser.teams.map((team) => (
                        <div
                          key={team.id}
                          className="flex items-center justify-between rounded bg-gray-50 p-2 text-xs"
                        >
                          <span className="font-medium">{team.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {team.position}
                          </Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {selectedUser.buckets && selectedUser.buckets.length > 0 && (
                  <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Career Tracks</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {selectedUser.buckets.map((userBucket, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded bg-gray-50 p-2 text-xs"
                        >
                          <div>
                            <div className="font-medium">{userBucket.bucket.category.name}</div>
                            <div className="text-gray-500">Career Track</div>
                          </div>
                          <Badge className="text-xs">Level {userBucket.bucket.level}</Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card className="shadow-sm">
                <CardContent className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <Users className="mx-auto h-8 w-8 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No User Selected</h3>
                    <p className="mt-1 text-xs text-gray-600">
                      Select a user to view their profile
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Panel - Evaluation Results (Spans 2 columns) */}
          <div className="space-y-4 lg:col-span-2">
            {evaluationResult ? (
              <>
                {/* Compact Status */}
                <Card className="shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getPromotionStatusIcon(evaluationResult.isReadyForPromotion)}
                        <div>
                          <div className="font-semibold">{evaluationResult.bucketCategory}</div>
                          <div className="text-sm text-gray-600">
                            Level {evaluationResult.currentBucketLevel} → Level{' '}
                            {evaluationResult.targetBucketLevel ||
                              evaluationResult.currentBucketLevel}
                          </div>
                          <Badge
                            variant={
                              evaluationResult.isReadyForPromotion ? 'default' : 'destructive'
                            }
                            className="text-xs"
                          >
                            {evaluationResult.isReadyForPromotion
                              ? `Ready for Level ${evaluationResult.targetBucketLevel}`
                              : 'Not Ready for Promotion'}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">
                          {(evaluationResult.overallConfidence * 100).toFixed(0)}%
                        </div>
                        <div className="text-xs text-gray-500">Confidence</div>
                        <div className="mt-1 h-1 w-16 rounded-full bg-gray-200">
                          <div
                            className={`h-1 rounded-full ${
                              evaluationResult.overallConfidence >= 0.8
                                ? 'bg-green-500'
                                : evaluationResult.overallConfidence >= 0.6
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                            }`}
                            style={{ width: `${evaluationResult.overallConfidence * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Compact Summary */}
                <Card className="shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Evaluation Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="rounded bg-blue-50 p-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">Current Bucket:</span>
                          <Badge variant="secondary">
                            {evaluationResult.bucketCategory} L{evaluationResult.currentBucketLevel}
                          </Badge>
                        </div>
                        {evaluationResult.isReadyForPromotion &&
                          evaluationResult.targetBucketLevel && (
                            <div className="mt-2 flex items-center justify-between text-sm">
                              <span className="font-medium">Promotion Target:</span>
                              <Badge className="bg-green-100 text-green-800">
                                {evaluationResult.bucketCategory} L
                                {evaluationResult.targetBucketLevel}
                              </Badge>
                            </div>
                          )}
                        {evaluationResult.allBuckets && evaluationResult.allBuckets.length > 1 && (
                          <div className="mt-2">
                            <div className="mb-1 text-xs font-medium text-gray-600">
                              All Career Tracks:
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {evaluationResult.allBuckets.map((bucket, index) => (
                                <Badge
                                  key={index}
                                  variant={
                                    bucket.category === evaluationResult.bucketCategory
                                      ? 'default'
                                      : 'outline'
                                  }
                                  className="text-xs"
                                >
                                  {bucket.category} L{bucket.level}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <p className="text-sm leading-relaxed text-gray-700">
                        {evaluationResult.promotionSummary}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Compact Detailed Analysis */}
                <Card className="shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Detailed Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="skills" className="space-y-3">
                      <TabsList className="grid h-8 w-full grid-cols-3">
                        <TabsTrigger value="skills" className="text-xs">
                          Skills
                        </TabsTrigger>
                        <TabsTrigger value="activity" className="text-xs">
                          Activity
                        </TabsTrigger>
                        <TabsTrigger value="feedback" className="text-xs">
                          Feedback
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="skills" className="space-y-3">
                        {evaluationResult.skillsAssessment.map((skill, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between rounded bg-gray-50 p-3"
                          >
                            <div className="flex-1">
                              <div className="text-sm font-medium">{skill.skill}</div>
                              <div className="mt-1 text-xs text-gray-600">{skill.gapAnalysis}</div>
                            </div>
                            <Badge
                              className={`${getConfidenceColor(skill.confidence)} ml-3 text-xs`}
                              variant="secondary"
                            >
                              {(skill.confidence * 100).toFixed(0)}%
                            </Badge>
                          </div>
                        ))}
                      </TabsContent>

                      <TabsContent value="activity" className="space-y-3">
                        <div className="grid grid-cols-4 gap-3">
                          <div className="rounded bg-gray-50 p-3 text-center">
                            <div className="text-sm font-semibold">
                              {evaluationResult.activitySummary.completedTickets}/
                              {evaluationResult.activitySummary.totalTickets}
                            </div>
                            <div className="text-xs text-gray-500">Tickets</div>
                          </div>
                          <div className="rounded bg-gray-50 p-3 text-center">
                            <div className="text-sm font-semibold">
                              {evaluationResult.activitySummary.activeTeamCount}
                            </div>
                            <div className="text-xs text-gray-500">Teams</div>
                          </div>
                          <div className="rounded bg-gray-50 p-3 text-center">
                            <div className="text-sm font-semibold">
                              {evaluationResult.activitySummary.totalReports}
                            </div>
                            <div className="text-xs text-gray-500">Reports</div>
                          </div>
                          <div className="rounded bg-gray-50 p-3 text-center">
                            <div className="text-sm font-semibold">
                              {evaluationResult.activitySummary.technologiesCount}
                            </div>
                            <div className="text-xs text-gray-500">Technologies</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between rounded bg-gray-50 p-3">
                          <div className="text-sm">
                            <div className="font-medium">Activity Level</div>
                            <div className="text-xs text-gray-600">Recent performance</div>
                          </div>
                          <div className="text-right">
                            <Badge
                              variant={
                                evaluationResult.activitySummary.timeframeAnalysis
                                  .recentActivityLevel === 'HIGH'
                                  ? 'default'
                                  : evaluationResult.activitySummary.timeframeAnalysis
                                        .recentActivityLevel === 'MEDIUM'
                                    ? 'secondary'
                                    : 'destructive'
                              }
                              className="text-xs"
                            >
                              {
                                evaluationResult.activitySummary.timeframeAnalysis
                                  .recentActivityLevel
                              }
                            </Badge>
                            <div className="mt-1 text-xs text-gray-500">
                              Trend:{' '}
                              {evaluationResult.activitySummary.timeframeAnalysis.productivityTrend}
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="feedback" className="space-y-3">
                        <div className="space-y-3">
                          <div className="rounded bg-green-50 p-3">
                            <h4 className="mb-2 text-sm font-medium text-green-800">
                              💪 Strengths
                            </h4>
                            <div className="space-y-1">
                              {evaluationResult.strengths.map((strength, index) => (
                                <div
                                  key={index}
                                  className="flex items-start text-xs text-green-700"
                                >
                                  <CheckCircle className="mt-0.5 mr-2 h-3 w-3 flex-shrink-0" />
                                  {strength}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="rounded bg-amber-50 p-3">
                            <h4 className="mb-2 text-sm font-medium text-amber-800">
                              📚 Areas for Improvement
                            </h4>
                            <div className="space-y-1">
                              {evaluationResult.areasForImprovement.map((area, index) => (
                                <div
                                  key={index}
                                  className="flex items-start text-xs text-amber-700"
                                >
                                  <AlertTriangle className="mt-0.5 mr-2 h-3 w-3 flex-shrink-0" />
                                  {area}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="rounded bg-blue-50 p-3">
                            <h4 className="mb-2 text-sm font-medium text-blue-800">
                              🎯 Next Steps
                            </h4>
                            <div className="space-y-1">
                              {evaluationResult.nextSteps.map((step, index) => (
                                <div key={index} className="flex items-start text-xs text-blue-700">
                                  <Target className="mt-0.5 mr-2 h-3 w-3 flex-shrink-0" />
                                  {step}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                {/* Compact Metadata */}
                <Card className="shadow-sm">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div>
                        Evaluated: {new Date(evaluationResult.evaluatedAt).toLocaleDateString()}
                      </div>
                      <div>
                        Period: {new Date(evaluationResult.analysisStartDate).toLocaleDateString()}{' '}
                        - {new Date(evaluationResult.analysisEndDate).toLocaleDateString()}
                      </div>
                      <div>Trigger: {evaluationResult.trigger}</div>
                    </div>
                    {autoNotifyCTO && evaluationResult.isReadyForPromotion && (
                      <div className="mt-2 rounded bg-blue-50 p-2 text-xs text-blue-700">
                        ✉️ CTO notification will be sent automatically
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : isEvaluating ? (
              <Card className="shadow-sm">
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Spinner className="mx-auto mb-4 h-8 w-8" />
                    <h3 className="text-lg font-medium text-gray-900">Running AI Evaluation...</h3>
                    <p className="mt-2 text-sm text-gray-600">
                      Analyzing user activity and comparing against career framework
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-sm">
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Award className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No Evaluation Yet</h3>
                    <p className="mt-2 text-sm text-gray-600">
                      Select a user and click "Run Evaluation" to see AI-powered analysis results.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Error Handling */}
        {(evaluationMutation.isError || selfEvaluationMutation.isError) && (
          <Alert className="shadow-sm">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {evaluationMutation.error?.message ||
                selfEvaluationMutation.error?.message ||
                'An error occurred during evaluation. Please try again.'}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};
