export enum TipoAeronave {
  COMERCIAL = "COMERCIAL",
  MILITAR = "MILITAR",
}

export enum TipoPeca {
  NACIONAL = "NACIONAL",
  IMPORTADA = "IMPORTADA",
}

export enum StatusPeca {
  EM_PRODUCAO = "EM_PRODUCAO",
  EM_TRANSPORTE = "EM_TRANSPORTE",
  PRONTA = "PRONTA",
}

export enum StatusEtapa {
  PENDENTE = "PENDENTE",
  ANDAMENTO = "ANDAMENTO",
  CONCLUIDA = "CONCLUIDA",
}

export enum TipoTeste {
  ELETRICO = "ELETRICO",
  HIDRAULICO = "HIDRAULICO",
  AERODINAMICO = "AERODINAMICO",
}

export enum ResultadoTeste {
  APROVADO = "APROVADO",
  REPROVADO = "REPROVADO",
}

export enum NivelPermissao {
  ADMINISTRADOR = "ADMINISTRADOR",
  ENGENHEIRO = "ENGENHEIRO",
  OPERADOR = "OPERADOR",
}

export interface Aeronave {
  id: string;
  codigo: string;
  modelo: string;
  tipo: TipoAeronave;
  capacidade: number;
  alcance: number;
  createdAt: string;
  updatedAt: string;
  pecas?: Peca[];
  etapas?: Etapa[];
  testes?: Teste[];
  relatorios?: Relatorio[];
}

export interface Peca {
  id: string;
  nome: string;
  tipo: TipoPeca;
  fornecedor: string;
  status: StatusPeca;
  aeronaveId: string;
  aeronave?: Aeronave;
  createdAt: string;
  updatedAt: string;
}

export interface Etapa {
  id: string;
  nome: string;
  tipo: string;
  status: StatusEtapa;
  aeronaveId: string;
  aeronave?: Aeronave;
  funcionarios?: Array<{
    id: string;
    funcionario: {
      id: number;
      nome: string;
      nivelPermissao: string;
    };
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface Funcionario {
  id: number;
  nome: string;
  cpf: string;
  endereco: string;
  usuario: string;
  nivelPermissao: string;
  createdAt: string;
  updatedAt: string;
}

export interface Teste {
  id: string;
  tipo: TipoTeste;
  resultado?: ResultadoTeste;
  aeronaveId: string;
  funcionarioId: number;
  aeronave?: Aeronave;
  funcionario?: Funcionario;
  createdAt: string;
  updatedAt: string;
}

export interface Relatorio {
  id: string;
  aeronaveId: string;
  conteudo: string;
  aeronave?: Aeronave;
  createdAt: string;
  updatedAt: string;
}
