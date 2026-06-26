import api from './api';

export interface RiwayatResponse {
  id: number;
  user_id: number;
  sawit_id: number;
  gambar_sawit: string;
  tingkat_kematangan: string;
  warna_dominan: string;
  persentase: string;
  username: string;
  created_at: string;
  updated_at: string;
}

export interface RiwayatCreatePayload {
  gambar_sawit: string;
  tingkat_kematangan: string;
  warna_dominan: string;
  persentase: string;
  username: string;
  sawit_id: number;
}

export interface RiwayatUpdatePayload {
  gambar_sawit?: string;
  tingkat_kematangan?: string;
  warna_dominan?: string;
  persentase?: string;
  username?: string;
  sawit_id?: number;
}

export const riwayatService = {
  create: async (payload: RiwayatCreatePayload): Promise<RiwayatResponse> => {
    const response = await api.post<RiwayatResponse>('/api/riwayat/', payload);
    return response.data;
  },

  getAll: async (): Promise<RiwayatResponse[]> => {
    const response = await api.get<RiwayatResponse[]>('/api/riwayat/');
    return response.data;
  },

  getById: async (riwayatId: number): Promise<RiwayatResponse> => {
    const response = await api.get<RiwayatResponse>(`/api/riwayat/${riwayatId}`);
    return response.data;
  },

  update: async (riwayatId: number, payload: RiwayatUpdatePayload): Promise<RiwayatResponse> => {
    const response = await api.put<RiwayatResponse>(`/api/riwayat/${riwayatId}`, payload);
    return response.data;
  },

  delete: async (riwayatId: number): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/api/riwayat/${riwayatId}`);
    return response.data;
  },
};
