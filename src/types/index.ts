export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

export interface AuthUser extends User {
  password: string;
}

export interface Category {
  id: string;
  name: string;
  createdAt: string;
}

export type RequestStatus = 'new' | 'in_progress' | 'completed' | 'rejected';

export interface RequestItem {
  id: string;
  title: string;
  description: string;
  email: string;
  categoryId: string;
  files: string[];
  status: RequestStatus;
  userId: string;
  userName: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export const REQUEST_STATUSES: { value: RequestStatus; label: string }[] = [
  { value: 'new', label: 'Новая' },
  { value: 'in_progress', label: 'В работе' },
  { value: 'completed', label: 'Завершена' },
  { value: 'rejected', label: 'Отклонена' },
];
