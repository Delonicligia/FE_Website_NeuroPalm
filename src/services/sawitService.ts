import api from './api';

export interface SawitResponse {
  id: number;
  user_id: number;
  tingkat_kematangan: string;
  warna_dominan: string;
  persentase: string;
  gambar_sawit: string; // path or URL
  created_at: string;
  updated_at: string;
}

export const sawitService = {
  create: async (formData: FormData): Promise<SawitResponse> => {
    const response = await api.post<SawitResponse>('/api/sawit/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getAll: async (): Promise<SawitResponse[]> => {
    const response = await api.get<SawitResponse[]>('/api/sawit/');
    return response.data;
  },

  getById: async (sawitId: number): Promise<SawitResponse> => {
    const response = await api.get<SawitResponse>(`/api/sawit/${sawitId}`);
    return response.data;
  },

  update: async (sawitId: number, formData: FormData): Promise<SawitResponse> => {
    const response = await api.put<SawitResponse>(`/api/sawit/${sawitId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (sawitId: number): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/api/sawit/${sawitId}`);
    return response.data;
  },
};
