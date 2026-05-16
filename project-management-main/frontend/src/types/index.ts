// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  avatar: string;
  createdAt?: string;
  updatedAt?: string;
}

// Project Types
export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'archived';
  progress: number;
  startDate: string;
  endDate: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  creator?: User;
  members?: User[];
}

// Task Types
export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: string;
  assignedTo: string;
  projectId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  assignee?: User;
  project?: Project;
}

// Activity Types
export interface Activity {
  id: string;
  action: string;
  details: any;
  userId: string;
  createdAt: string;
  User?: User;
}

// Notification Types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'task_assigned' | 'due_date' | 'task_completed' | 'project_update';
  read: boolean;
  userId: string;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  message?: string;
  data?: T;
  error?: string;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'member';
}

export interface AuthResponse {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  avatar: string;
  token: string;
}

// Dashboard Stats Types
export interface DashboardStats {
  totalProjects?: number;
  totalMembers?: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  inProgressTasks: number;
  priorityBreakdown?: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
  recentTasks?: Task[];
}

// Pagination Types
export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  priority?: string;
  projectId?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

// Form Types
export interface ProjectFormData {
  name: string;
  description: string;
  status: 'active' | 'completed' | 'archived';
  startDate: string;
  endDate: string;
  memberIds?: string[];
}

export interface TaskFormData {
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: string;
  assignedTo: string;
  projectId: string;
}

export interface UserFormData {
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'member';
}

// Chart Data Types
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    tension?: number;
  }[];
}

// Component Props Types
export interface StatCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<any>;
  color: string;
  trend?: number;
}

export interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export interface ProtectedRouteProps {
  children?: React.ReactNode;
  allowedRoles?: ('admin' | 'member')[];
}

// Context Types
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// API Service Types
export interface ApiError {
  message: string;
  status: number;
  data?: any;
}

// Filter Types
export interface TaskFilters {
  search: string;
  status: string;
  priority: string;
  projectId: string;
  assignedTo: string;
}

export interface ProjectFilters {
  search: string;
  status: string;
}

// Calendar Types
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'task' | 'project' | 'milestone';
  taskId?: string;
  projectId?: string;
}

// Notification Context Types
export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
}