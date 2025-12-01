import { Report, User, UserReward, RewardHistory, ReportStatus, ReportType, Role } from '@prisma/client';

// Re-export Prisma enums for convenience
export { ReportStatus, ReportType, Role };

// Define extended types with relations
export interface UserWithRelations extends User {
  profile?: {
    phone?: string | null;
    address?: string | null;
    dateOfBirth?: Date | null;
    department?: string | null;
  } | null;
  rewards?: UserRewardWithHistory | null;
  reports?: ReportWithRelations[] | null;
}

export interface UserRewardWithHistory extends UserReward {
  rewardHistory?: RewardHistoryWithReport[] | null;
}

export interface RewardHistoryWithReport extends RewardHistory {
  report?: Report | null;
}

export interface ReportWithRelations extends Report {
  user?: User | null;
  rewardHistories?: RewardHistory[] | null;
}

// Reward system result types
export interface RewardResult {
  success: boolean;
  message: string;
  userReward?: UserReward;
  pointsAwarded?: number;
  pointsRevoked?: number;
}

export interface TopReporter {
  userId: number;
  name: string;
  points: number;
  totalReports: number;
  totalEarnings: number;
}