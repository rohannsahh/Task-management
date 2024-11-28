import { Request } from 'express';

export interface UserDocument extends Document {
  email: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface TaskDocument extends Document {
  title: string;
  startTime: Date;
  endTime: Date;
  priority: number;
  status: 'pending' | 'finished';
  userId: string;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

export interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  completionRate: number;
  timeStats: {
    [key: number]: {
      timeElapsed: number;
      estimatedTimeLeft: number;
    };
  };
  averageCompletionTime: number;
}