import api from "./api";
import { Funcionario, NivelPermissao } from "../types";

export const funcionarioService = {
  getAll: async (): Promise<Funcionario[]> => {
    const response = await api.get<Funcionario[]>("/funcionarios");
    return response.data;
  },

  create: async (data: {
    nome: string;
    cpf: string;
    endereco: string;
    usuario: string;
    senha: string;
    nivelPermissao: NivelPermissao;
  }): Promise<Funcionario> => {
    const response = await api.post<Funcionario>("/funcionarios", data);
    return response.data;
  },
};
