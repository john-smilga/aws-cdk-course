import axios from 'axios';
import { User, CreateUserRequest, ApiResponse } from './types';
import { isAxiosError } from 'axios';

const API_URL = 'https://1cstep2sej.execute-api.eu-north-1.amazonaws.com';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const userApi = {
  // Get all users
  getAllUsers: async (): Promise<User[]> => {
    try {
      const response = await api.get('/users');
      // Handle both plain array and wrapped object
      if (Array.isArray(response.data)) {
        return response.data;
      }
      if (Array.isArray(response.data.data)) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Create a new user
  createUser: async (userData: CreateUserRequest): Promise<User> => {
    try {
      const response = await api.post<ApiResponse<User>>('/users', userData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Get user by ID
  getUserById: async (id: string): Promise<User> => {
    try {
      const response = await api.get(`/users/${id}`);
      // If the response is a plain object, just return it
      if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
        return response.data;
      }
      // If the response is wrapped (rare in your case), handle that too
      if (response.data && response.data.data) {
        return response.data.data;
      }
      throw new Error('User not found');
    } catch (error) {
      if (isAxiosError(error)) {
        console.error('Error fetching user:', error, id, error.response?.data);
      } else {
        console.error('Error fetching user:', error, id);
      }
      throw error;
    }
  },

  // Update user
  updateUser: async (id: string, userData: Partial<CreateUserRequest>): Promise<User> => {
    try {
      const response = await api.put<ApiResponse<User>>(`/users/${id}`, userData);
      return response.data.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Delete user
  deleteUser: async (id: string): Promise<void> => {
    try {
      await api.delete(`/users/${id}`);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },
};
