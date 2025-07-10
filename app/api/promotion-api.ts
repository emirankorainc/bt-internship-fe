import { getAuthHeaders } from '@app/lib/firebase';
import { BASE_URL } from './api-config';

// Types for promotion evaluation
export interface PromotionEvaluationRequest {
  userId: string;
  trigger?: 'manual' | 'scheduled' | 'report_submission' | 'team_completion';
  analysisStartDate?: string;
  analysisEndDate?: string;
  targetBucket?: string; // For selecting specific bucket in multi-bucket users
}

export interface SkillAssessment {
  skill: string;
  confidence: number;
  evidence: string[];
  gapAnalysis: string;
}

export interface ActivitySummary {
  totalTickets: number;
  completedTickets: number;
  activeTeamCount: number;
  totalReports: number;
  messageCount: number;
  technologiesCount: number;
  timeframeAnalysis: {
    recentActivityLevel: 'HIGH' | 'MEDIUM' | 'LOW';
    productivityTrend: 'INCREASING' | 'STABLE' | 'DECREASING';
  };
}

export interface PromotionCriteriaAssessment {
  criteria: string;
  assessment: 'EXCEEDS' | 'MEETS' | 'BELOW' | 'MISSING';
  evidence: string[];
  confidence: number;
}

export interface PromotionEvaluationResponse {
  userId: string;
  currentLevel: string;
  targetLevel: string;
  bucketCategory: string;
  currentBucketLevel: number;
  targetBucketLevel?: number;
  allBuckets?: Array<{ category: string; level: number }>; // All buckets available for multi-bucket users
  isReadyForPromotion: boolean;
  overallConfidence: number;
  promotionSummary: string;
  strengths: string[];
  areasForImprovement: string[];
  nextSteps: string[];
  skillsAssessment: SkillAssessment[];
  activitySummary: ActivitySummary;
  criteriaAssessment: PromotionCriteriaAssessment[];
  analysisStartDate: string;
  analysisEndDate: string;
  evaluatedAt: string;
  trigger: string;
}

export interface BulkPromotionEvaluationResponse {
  totalEvaluated: number;
  readyForPromotion: number;
  evaluations: PromotionEvaluationResponse[];
  promotionSummaryByLevel: Record<string, number>;
  evaluatedAt: string;
  trigger: string;
}

export interface CareerLevel {
  level: string;
  title: string;
  experience: string;
  expectations: string[];
  skills: string[];
  tools: string[];
  knowledge: string[];
  toAdvance: string[];
  certificates?: string[];
}

export interface CareerTrack {
  name: string;
  levels: CareerLevel[];
}

export interface UserWithDetails {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: Date;
  roleId: string;
  role?: {
    id: string;
    name: string;
  };
  // Additional user activity data
  tickets?: Array<{
    id: string;
    title: string;
    description: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  }>;
  teams?: Array<{
    id: string;
    name: string;
    description: string;
    position: string;
  }>;
  reports?: Array<{
    id: string;
    content: string;
    createdAt: string;
    authorId: string;
  }>;
  buckets?: Array<{
    bucket: {
      level: number;
      category: {
        name: string;
      };
    };
  }>;
}

// API functions
export const evaluateUserForPromotion = async (
  request: PromotionEvaluationRequest,
): Promise<PromotionEvaluationResponse> => {
  try {
    const authHeaders = await getAuthHeaders();

    const response = await fetch(`${BASE_URL}/promotion/evaluate/${request.userId}`, {
      method: 'POST',
      headers: {
        ...authHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        trigger: request.trigger || 'manual',
        analysisStartDate: request.analysisStartDate,
        analysisEndDate: request.analysisEndDate,
        targetBucket: request.targetBucket,
      }),
    });

    if (!response.ok) {
      throw new Error(`Promotion evaluation failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error evaluating user for promotion:', error);
    throw error;
  }
};

export const evaluateSelfForPromotion = async (
  analysisStartDate?: string,
  analysisEndDate?: string,
  targetBucket?: string,
): Promise<PromotionEvaluationResponse> => {
  try {
    const authHeaders = await getAuthHeaders();

    const queryParams = new URLSearchParams();
    if (analysisStartDate) queryParams.append('analysisStartDate', analysisStartDate);
    if (analysisEndDate) queryParams.append('analysisEndDate', analysisEndDate);
    if (targetBucket) queryParams.append('targetBucket', targetBucket);

    const response = await fetch(`${BASE_URL}/promotion/evaluate/my-evaluation?${queryParams}`, {
      method: 'GET',
      headers: {
        ...authHeaders,
      },
    });

    if (!response.ok) {
      throw new Error(`Self promotion evaluation failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error evaluating self for promotion:', error);
    throw error;
  }
};

export const bulkEvaluateUsers = async (
  userIds?: string[],
  trigger: string = 'manual',
  analysisStartDate?: string,
  analysisEndDate?: string,
): Promise<BulkPromotionEvaluationResponse> => {
  try {
    const authHeaders = await getAuthHeaders();

    const response = await fetch(`${BASE_URL}/promotion/evaluate/bulk`, {
      method: 'POST',
      headers: {
        ...authHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userIds,
        trigger,
        analysisStartDate,
        analysisEndDate,
      }),
    });

    if (!response.ok) {
      throw new Error(`Bulk promotion evaluation failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error bulk evaluating users for promotion:', error);
    throw error;
  }
};

export const getCareerFramework = async (): Promise<{
  framework: CareerTrack[];
  lastUpdated: string;
}> => {
  try {
    const authHeaders = await getAuthHeaders();

    const response = await fetch(`${BASE_URL}/promotion/career-framework`, {
      method: 'GET',
      headers: {
        ...authHeaders,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch career framework: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching career framework:', error);
    throw error;
  }
};

export const getCareerLevel = async (
  levelCode: string,
): Promise<{ current: CareerLevel; next: CareerLevel | null }> => {
  try {
    const authHeaders = await getAuthHeaders();

    const response = await fetch(`${BASE_URL}/promotion/career-framework/levels/${levelCode}`, {
      method: 'GET',
      headers: {
        ...authHeaders,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch career level: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching career level:', error);
    throw error;
  }
};

export const getPromotionStatistics = async (): Promise<{
  totalUsers: number;
  evaluationsThisMonth: number;
  readyForPromotion: number;
  promotionsByLevel: Record<string, number>;
  lastEvaluationRun: string | null;
}> => {
  try {
    const authHeaders = await getAuthHeaders();

    const response = await fetch(`${BASE_URL}/promotion/statistics`, {
      method: 'GET',
      headers: {
        ...authHeaders,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch promotion statistics: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching promotion statistics:', error);
    throw error;
  }
};

export const triggerScheduledEvaluations = async (
  roleLevels?: string[],
): Promise<BulkPromotionEvaluationResponse> => {
  try {
    const authHeaders = await getAuthHeaders();

    const queryParams = new URLSearchParams();
    if (roleLevels?.length) {
      queryParams.append('roleLevels', roleLevels.join(','));
    }

    const response = await fetch(`${BASE_URL}/promotion/scheduled-evaluation?${queryParams}`, {
      method: 'POST',
      headers: {
        ...authHeaders,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to trigger scheduled evaluations: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error triggering scheduled evaluations:', error);
    throw error;
  }
};

export const directPromoteUser = async (
  userId: string,
  reason: string,
  effectiveDate?: string,
  newLevel?: string,
): Promise<{
  success: boolean;
  message: string;
  promotionDetails: {
    userId: string;
    fromLevel: string;
    toLevel: string;
    reason: string;
    effectiveDate: string;
    promotedBy: string;
    promotedAt: string;
  };
}> => {
  try {
    const authHeaders = await getAuthHeaders();

    const response = await fetch(`${BASE_URL}/promotion/promote/${userId}`, {
      method: 'POST',
      headers: {
        ...authHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reason,
        effectiveDate,
        newLevel,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to promote user: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error promoting user:', error);
    throw error;
  }
};
