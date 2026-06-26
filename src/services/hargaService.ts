  import api from './api';

  export interface HargaResponse {
    id: number;
    user_id: number;
    harga_perkg: string;
    keterangan: string;
    created_at: string;
    updated_at: string;
  }

  export interface HargaCreatePayload {
    harga_perkg: string;
    keterangan: string;
  }

  export interface HargaUpdatePayload {
    harga_perkg?: string;
    keterangan?: string;
  }

  export const hargaService = {
    create: async (payload: HargaCreatePayload): Promise<HargaResponse> => {
      const response = await api.post<HargaResponse>('/api/harga/', payload);
      return response.data;
    },

    getAll: async (): Promise<HargaResponse[]> => {
      const response = await api.get<HargaResponse[]>('/api/harga/');
      return response.data;
    },

    getById: async (hargaId: number): Promise<HargaResponse> => {
      const response = await api.get<HargaResponse>(`/api/harga/${hargaId}`);
      return response.data;
    },

    update: async (hargaId: number, payload: HargaUpdatePayload): Promise<HargaResponse> => {
      const response = await api.put<HargaResponse>(`/api/harga/${hargaId}`, payload);
      return response.data;
    },

    delete: async (hargaId: number): Promise<{ message: string }> => {
      const response = await api.delete<{ message: string }>(`/api/harga/${hargaId}`);
      return response.data;
    },
  };
