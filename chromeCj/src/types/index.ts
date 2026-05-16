export interface Task {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO date string (YYYY-MM-DD)
  startTime?: string; // HH:mm
  endTime?: string; // HH:mm
  priority: 'important_urgent' | 'important_not_urgent' | 'not_important_urgent' | 'not_important_not_urgent';
  completed: boolean;
  tags?: string[];
  estimatedDuration?: number; // minutes
  color?: string;
  icon?: string;
}

export interface DailyReflection {
  id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  score: number; // 1-10
  reflection: string; // 文字反省内容
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  type: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'multi_year_3' | 'multi_year_5' | 'multi_year_10' | 'multi_year_20' | 'multi_year_30' | 'multi_year_50' | 'lifetime';
  targetDate?: string; // ISO date string
  achieved: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface FutureLetter {
  id: string;
  title: string;
  content: string;
  sendDate: string; // ISO date string - 何时发送这封信
  sent: boolean; // 是否已经发送过
  createdAt: string; // ISO date string
  viewed?: boolean; // 是否已被查看
}

export interface ViewType {
  type: 'day' | 'week' | 'month' | 'goals' | 'letters' | 'reflections';
  date: Date;
}

export interface AgendaItem {
  taskId: string;
  startTime: string;
  endTime: string;
  title: string;
  priority: 'important_urgent' | 'important_not_urgent' | 'not_important_urgent' | 'not_important_not_urgent';
}