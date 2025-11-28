import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authService, FuncionarioAuth } from "../services/authService";
import { NivelPermissao } from "../types";

interface AuthContextData {
  user: FuncionarioAuth | null;
  login: (usuario: string, senha: string) => Promise<void>;
  logout: () => void;
  register: (data: any) => Promise<void>;
  hasPermission: (levels: NivelPermissao[]) => boolean;
  isAdmin: () => boolean;
  isEngenheiro: () => boolean;
  isOperador: () => boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<FuncionarioAuth | null>(null);

  useEffect(() => {
    // Carregar usuário do localStorage ao iniciar
    const savedUser = authService.getUser();
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  const login = async (usuario: string, senha: string) => {
    try {
      const userData = await authService.login({ usuario, senha });
      setUser(userData);
      authService.saveUser(userData);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Erro ao fazer login");
    }
  };

  const register = async (data: any) => {
    try {
      const userData = await authService.register(data);
      setUser(userData);
      authService.saveUser(userData);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Erro ao registrar");
    }
  };

  const logout = () => {
    setUser(null);
    authService.removeUser();
  };

  const hasPermission = (levels: NivelPermissao[]): boolean => {
    return user ? levels.includes(user.nivelPermissao) : false;
  };

  const isAdmin = (): boolean => {
    return user?.nivelPermissao === NivelPermissao.ADMINISTRADOR;
  };

  const isEngenheiro = (): boolean => {
    return user?.nivelPermissao === NivelPermissao.ENGENHEIRO;
  };

  const isOperador = (): boolean => {
    return user?.nivelPermissao === NivelPermissao.OPERADOR;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        hasPermission,
        isAdmin,
        isEngenheiro,
        isOperador,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
