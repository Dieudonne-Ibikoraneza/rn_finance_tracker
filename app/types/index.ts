export interface User {
  id: string;
  username: string;
  password: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  name: string;
  amount: number;
  description: string;
  category?: string;
  date?: string;
  userId?: string;
  createdAt: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
} 