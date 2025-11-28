import api from "./api";
import { Peca, TipoPeca, StatusPeca } from "../types";

export const pecaService = {
  getAll: async (): Promise<Peca[]> => {
    const response = await api.get<Peca[]>("/pecas");
    return response.data;
  },

  getByAeronave: async (aeronaveId: string): Promise<Peca[]> => {
    const response = await api.get<Peca[]>("/pecas");
    return response.data.filter((p) => p.aeronaveId === aeronaveId);
  },

  create: async (data: {
    nome: string;
    tipo: TipoPeca;
    fornecedor: string;
    status?: StatusPeca;
    aeronaveId: string;
  }): Promise<Peca> => {
    const response = await api.post<Peca>("/pecas", data);
    return response.data;
  },

  updateStatus: async (id: string, status: StatusPeca): Promise<Peca> => {
    const response = await api.put<Peca>(`/pecas/${id}`, { status });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/pecas/${id}`);
  },
};
