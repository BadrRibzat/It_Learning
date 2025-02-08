// Base interfaces
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned_at: Date | null;
}

export interface PointsHistory {
  amount: number;
  action: string;
  timestamp: Date;
  details: Record<string, any>;
}

export interface LearningStreak {
  current_streak: number | null;
  longest_streak: number | null;
  last_activity_date: Date | null;
  next_milestone: number | null;
}

export interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: Date;
  details: Record<string, any>;
  points_earned: number;
}

export interface ActivityFeed {
  activities: Activity[];
  summary: {
    total: number;
    has_more: boolean;
    daily_stats: {
      date: string;
      points: number;
      activities: number;
    }[];
  };
}

export interface LearningStats {
  total_points: number;
  rank: string | null;
  completed_lessons: number | null;
  correct_answers: number | null;
  accuracy_rate: number | null;
  quiz_average: number | null;
  time_spent: number | null;
  achievements: Achievement[] | null;
  streak: LearningStreak;
  points_history: PointsHistory[];
}

export interface ProfileData {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  bio: string | null;
  profile_picture: string | null;
  preferred_language: string;
  joined_date: Date;
  last_active: Date;
}

// Animation types
export interface CircleAnimations {
  circle_color: string;
  celebration: boolean;
  milestone: boolean;
}

export interface CurrentLevel {
  overall_progress: number;
  level_progress: number;
  points_progress: number;
  streak: number;
  animations: CircleAnimations;
}

// Response interfaces
export interface ProfileResponse {
  message: string;
  profile_data: ProfileData;
  learning_stats: LearningStats;
  recent_activities: Activity[];
  current_level: CurrentLevel;
}

export interface ProfileUpdate {
  full_name?: string;
  bio?: string;
  preferred_language?: string;
}

export interface ProfileUploadResponse {
  message: string;
  profile_picture: string;
  success: boolean;
}

export interface ProfilePictureState {
  url: string | null;
  loading: boolean;
  error: string | null;
}

export interface PointsResponse {
  total_points: number;
  current_rank: string;
  points_history: PointsHistory[];
  points_breakdown: {
    lessons: number;
    quizzes: number;
    achievements: number;
    streak_bonuses: number;
    daily_challenges: number;
    community_contributions: number;
  };
  next_rank: {
    name: string;
    points_required: number;
    progress: number;
    benefits: string[];
  };
}

export interface ProgressCircle {
  overall_progress: number;
  level_progress: number;
  points_progress: number;
  streak: number;
  animations: CircleAnimations;
}

// State interfaces
export interface ProfileState {
  profile: ProfileResponse | null;
  profilePictureUrl: string | null;
  statistics: LearningStats | null;
  points: PointsResponse | null;
  progressCircle: ProgressCircle | null;
  activityFeed: ActivityFeed | null;
  achievements: Achievement[];
  settings: {
    notifications: NotificationPreferences;
    privacy: PrivacySettings;
  };
  loading: boolean;
  error: string | null;
  lastUpdate: string | null;
}

// New Response interfaces
export interface AchievementsResponse {
  achievements: Achievement[];
  categories: AchievementCategory[];
  summary: {
    total: number;
    unlocked: number;
    completion_rate: number;
  };
}

export interface SettingsUpdateResponse {
  message: string;
  settings: ProfileSettings;
}

export interface ActivityTrackingResponse {
  message: string;
  activity: Activity;
  points_earned: number;
  achievements_unlocked?: Achievement[];
}

export interface AchievementCategory {
  id: string;
  name: string;
  description: string;
  achievements: Achievement[];
}

// New Settings related interfaces
export interface NotificationPreferences {
  achievements: boolean;
  progress: boolean;
  streaks: boolean;
}

export interface PrivacySettings {
  public_profile: boolean;
  show_achievements: boolean;
  show_activity: boolean;
}

export interface ProfileSettings {
  notifications: NotificationPreferences;
  privacy: PrivacySettings;
  preferred_language: string;
  theme?: 'light' | 'dark' | 'system';
}

export interface ProfileSettingsUpdate {
  settings: ProfileSettings;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  progress: number;
  required: number;
  reward: {
    points: number;
    achievement?: Achievement;
  };
}

// New interfaces for profile views
export interface ProfileViewData {
  profile: ProfileResponse;
  achievements: Achievement[];
  settings: ProfileSettings;
  stats: {
    daily: ActivitySummary[];
    weekly: ActivitySummary[];
    monthly: ActivitySummary[];
  };
}

export interface ActivitySummary {
  date: string;
  points: number;
  activities: number;
  lessons_completed: number;
  accuracy: number;
}
