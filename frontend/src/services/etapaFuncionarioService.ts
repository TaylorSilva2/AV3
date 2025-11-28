import api from "./api";

export const etapaFuncionarioService = {
  associar: async (etapaId: string, funcionarioId: number): Promise<void> => {
    await api.post("/etapas/associar-funcionario", { etapaId, funcionarioId });
  },

  listarPorEtapa: async (etapaId: string): Promise<any[]> => {
    const response = await api.get(`/etapas/${etapaId}/funcionarios`);
    return response.data;
  },
};
