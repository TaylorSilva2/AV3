import axios from "axios";
import { NivelPermissao } from "../types";

const API_URL = "http://localhost:3001/api/auth";

export interface LoginData {
  usuario: string;
  senha: string;
}

export interface RegisterData {
  nome: string;
  cpf: string;
  endereco: string;
  usuario: string;
  senha: string;
  nivelPermissao?: NivelPermissao;
}

export interface FuncionarioAuth {
  id: number;
  nome: string;
  cpf: string;
  endereco: string;
  usuario: string;
  nivelPermissao: NivelPermissao;
  createdAt: string;
  updatedAt: string;
}

export const authService = {
  async login(data: LoginData): Promise<FuncionarioAuth> {
    const response = await axios.post(`${API_URL}/login`, data);
    return response.data.funcionario;
  },

  async register(data: RegisterData): Promise<FuncionarioAuth> {
    const response = await axios.post(`${API_URL}/register`, data);
    return response.data.funcionario;
  },

  async getCurrentUser(userId: number): Promise<FuncionarioAuth> {
    const response = await axios.get(`${API_URL}/me?userId=${userId}`);
    return response.data;
  },

  // Salvar usuário no localStorage
  saveUser(user: FuncionarioAuth): void {
    localStorage.setItem("user", JSON.stringify(user));
  },

  // Obter usuário do localStorage
  getUser(): FuncionarioAuth | null {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  // Remover usuário do localStorage
  removeUser(): void {
    localStorage.removeItem("user");
  },

  // Verificar se está autenticado
  isAuthenticated(): boolean {
    return this.getUser() !== null;
  },

  // Obter nível de permissão
  getPermissionLevel(): NivelPermissao | null {
    const user = this.getUser();
    return user ? user.nivelPermissao : null;
  },

  // Verificar se tem permissão
  hasPermission(requiredLevel: NivelPermissao[]): boolean {
    const userLevel = this.getPermissionLevel();
    return userLevel ? requiredLevel.includes(userLevel) : false;
  },
};
