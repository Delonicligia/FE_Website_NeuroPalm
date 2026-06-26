import api from './api';

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  role: 'petani' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export const userService = {
  register: async (userData: any): Promise<UserResponse> => {
    const response = await api.post<UserResponse>('/api/users/register', userData);
    return response.data;
  },

  login: async (credentials: any): Promise<TokenResponse> => {
    const response = await api.post<TokenResponse>('/api/users/login', credentials);
    return response.data;
  },

  getAllUsers: async (): Promise<UserResponse[]> => {
    const response = await api.get<UserResponse[]>('/api/users/');
    return response.data;
  },

  getCurrentUser: async (): Promise<UserResponse> => {
    const response = await api.get<UserResponse>('/api/users/me');
    return response.data;
  },

  updateCurrentUser: async (userData: any): Promise<UserResponse> => {
    const response = await api.put<UserResponse>('/api/users/me', userData);
    return response.data;
  },

  changeUserRole: async (userId: number, role: 'petani' | 'admin'): Promise<UserResponse> => {
    const response = await api.put<UserResponse>(`/api/users/${userId}/role`, null, {
      params: { role },
    });
    return response.data;
  },

  deleteCurrentUser: async (): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>('/api/users/me');
    return response.data;
  },
};
