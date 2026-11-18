export type UserRole = 'Admin' | 'Member' | 'Tester' | 'Viewer';

export type TaskStatus = 
  | 'pending'
  | 'in_progress'
  | 'testing'
  | 'completed'
  | 'failed';

export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  teamIds: string[]; // User can be in multiple teams!
}

export interface Team {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  memberIds: string[];
}

export interface Project {
  id: string;
  teamId: string;
  name: string;
  key: string;
  description: string;
  color: string;
  icon?: string;
  createdAt: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userRole: UserRole;
  text: string;
  createdAt: string;
}

export interface TaskActivity {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
  fromStatus?: TaskStatus;
  toStatus?: TaskStatus;
}

export interface Task {
  id: string;
  code: string; // e.g. "ENG-101"
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  teamId: string;
  projectId: string;
  assigneeId?: string;
  reporterId: string;
  testerId?: string;
  dueDate?: string;
  tags: string[];
  subtasks: Subtask[];
  comments: TaskComment[];
  activity: TaskActivity[];
  testerNotes?: string;
  createdAt: string;
  updatedAt: string;
  order: number;
}

export interface WorkflowTransitionRule {
  from: TaskStatus;
  to: TaskStatus;
  allowed: boolean;
  requiredRole?: UserRole[];
  description: string;
}

export interface ColumnDefinition {
  id: TaskStatus;
  title: string;
  color: string;
  badgeBg: string;
  borderHover: string;
  description: string;
}

export interface NotificationItem {
  id: string;
  userId: string; // recipient
  senderName: string;
  senderAvatar: string;
  title: string;
  message: string;
  taskId?: string;
  teamId: string;
  type: 'status_change' | 'assignment' | 'review_required' | 'testing_failed' | 'completed';
  read: boolean;
  createdAt: string;
}
