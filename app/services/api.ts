import axios from 'axios';
import { Expense, LoginCredentials, User } from '../types';

const API_BASE_URL = 'https://67ac71475853dfff53dab929.mockapi.io/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const loginUser = async (credentials: LoginCredentials): Promise<User> => {
  try {
    console.log('Attempting login with:', credentials.username);
    const response = await api.get('/users');
    console.log('API Response:', response.data);
    
    const users = response.data;
    const user = users.find((u: User) => 
      u.username === credentials.username && u.password === credentials.password
    );
    
    console.log('Found user:', user);
    
    if (!user) {
      console.log('No user found with provided credentials');
      throw new Error('Invalid credentials');
    }
    
    return user;
  } catch (error) {
    console.error('Login error:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(`Login failed: ${error.message}`);
    }
    throw error;
  }
};

export const createExpense = async (expense: Omit<Expense, 'id' | 'createdAt'>): Promise<Expense> => {
  try {
    const response = await api.post('/expenses', expense);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create expense');
  }
};

export const getExpense = async (expenseId: string): Promise<Expense> => {
  try {
    const response = await api.get(`/expenses/${expenseId}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch expense');
  }
};

export const getAllExpenses = async (): Promise<Expense[]> => {
  try {
    const response = await api.get('/expenses');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch expenses');
  }
};

export const deleteExpense = async (expenseId: string): Promise<void> => {
  try {
    await api.delete(`/expenses/${expenseId}`);
  } catch (error) {
    throw new Error('Failed to delete expense');
  }
}; 