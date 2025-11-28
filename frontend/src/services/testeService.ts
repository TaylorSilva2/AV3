import api from "./api";
import { Teste, TipoTeste, ResultadoTeste } from "../types";

export const testeService = {
  getAll: async (): Promise<Teste[]> => {
    const response = await api.get<Teste[]>("/testes");
    return response.data;
  },

  getByAeronave: async (aeronaveId: string): Promise<Teste[]> => {
    const response = await api.get<Teste[]>("/testes");
    return response.data.filter((t) => t.aeronaveId === aeronaveId);
  },

  create: async (data: {
    tipo: TipoTeste;
    resultado?: ResultadoTeste;
    aeronaveId: string;
    funcionarioId: number;
  }): Promise<Teste> => {
    const response = await api.post<Teste>("/testes", data);
    return response.data;
  },

  updateResultado: async (
    id: string,
    resultado: ResultadoTeste
  ): Promise<Teste> => {
    const response = await api.put<Teste>(`/testes/${id}`, { resultado });
    return response.data;
  },
};
