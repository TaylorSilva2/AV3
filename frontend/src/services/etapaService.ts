import api from "./api";
import { Etapa, StatusEtapa } from "../types";

export const etapaService = {
  getAll: async (): Promise<Etapa[]> => {
    const response = await api.get<Etapa[]>("/etapas");
    return response.data;
  },

  getByAeronave: async (aeronaveId: string): Promise<Etapa[]> => {
    const response = await api.get<Etapa[]>("/etapas");
    return response.data.filter((e) => e.aeronaveId === aeronaveId);
  },

  create: async (data: {
    nome: string;
    tipo: string;
    status?: StatusEtapa;
    aeronaveId: string;
  }): Promise<Etapa> => {
    const response = await api.post<Etapa>("/etapas", data);
    return response.data;
  },

  updateStatus: async (id: string, status: StatusEtapa): Promise<Etapa> => {
    const response = await api.put<Etapa>(`/etapas/${id}`, { status });
    return response.data;
  },
};
