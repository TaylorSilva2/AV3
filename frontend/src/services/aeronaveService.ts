import api from "./api";
import { Aeronave, TipoAeronave } from "../types";

export const aeronaveService = {
  getAll: async (): Promise<Aeronave[]> => {
    const response = await api.get<Aeronave[]>("/aeronaves");
    return response.data;
  },

  getById: async (id: string): Promise<Aeronave> => {
    const response = await api.get<Aeronave>(`/aeronaves/${id}`);
    return response.data;
  },

  create: async (data: {
    codigo: string;
    modelo: string;
    tipo: TipoAeronave;
    capacidade: number;
    alcance: number;
  }): Promise<Aeronave> => {
    const response = await api.post<Aeronave>("/aeronaves", data);
    return response.data;
  },

  update: async (id: string, data: Partial<Aeronave>): Promise<Aeronave> => {
    const response = await api.put<Aeronave>(`/aeronaves/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/aeronaves/${id}`);
  },
};
