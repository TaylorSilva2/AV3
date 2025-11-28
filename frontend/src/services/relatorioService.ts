import api from "./api";
import { Relatorio } from "../types";

export const relatorioService = {
  getAll: async (): Promise<Relatorio[]> => {
    const response = await api.get<Relatorio[]>("/relatorios");
    return response.data;
  },

  getByAeronave: async (aeronaveId: string): Promise<Relatorio[]> => {
    const response = await api.get<Relatorio[]>("/relatorios");
    return response.data.filter((r) => r.aeronaveId === aeronaveId);
  },

  create: async (data: {
    aeronaveId: string;
    conteudo: string;
  }): Promise<Relatorio> => {
    const response = await api.post<Relatorio>("/relatorios", data);
    return response.data;
  },
};
