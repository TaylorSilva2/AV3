import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { NivelPermissao } from "../types";
import "./Auth.css";

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    usuario: "",
    senha: "",
    nome: "",
    cpf: "",
    endereco: "",
    nivelPermissao: NivelPermissao.OPERADOR,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.usuario, formData.senha);
      } else {
        await register({
          nome: formData.nome,
          cpf: formData.cpf,
          endereco: formData.endereco,
          usuario: formData.usuario,
          senha: formData.senha,
          nivelPermissao: formData.nivelPermissao,
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setFormData({
      usuario: "",
      senha: "",
      nome: "",
      cpf: "",
      endereco: "",
      nivelPermissao: NivelPermissao.OPERADOR,
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-shape shape-1"></div>
        <div className="auth-shape shape-2"></div>
        <div className="auth-shape shape-3"></div>
      </div>

      <div className="auth-card">
        <div className="auth-header">
          <h1>Aerocode</h1>
          <p>Sistema de Gerenciamento de Aeronaves</p>
        </div>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`auth-tab ${!isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(false)}
          >
            Cadastrar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <>
              <div className="form-group">
                <label>Nome Completo</label>
                <input
                  type="text"
                  placeholder="Digite seu nome"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>CPF</label>
                <input
                  type="text"
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={(e) =>
                    setFormData({ ...formData, cpf: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Endereço</label>
                <input
                  type="text"
                  placeholder="Digite seu endereço"
                  value={formData.endereco}
                  onChange={(e) =>
                    setFormData({ ...formData, endereco: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Nível de Permissão</label>
                <select
                  value={formData.nivelPermissao}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nivelPermissao: e.target.value as NivelPermissao,
                    })
                  }
                  required
                >
                  <option value={NivelPermissao.OPERADOR}>
                    Operador (Visualização)
                  </option>
                  <option value={NivelPermissao.ENGENHEIRO}>
                    Engenheiro (Criar/Editar)
                  </option>
                  <option value={NivelPermissao.ADMINISTRADOR}>
                    Administrador (Acesso Total)
                  </option>
                </select>
              </div>
            </>
          )}

          <div className="form-group">
            <label>Usuário</label>
            <input
              type="text"
              placeholder="Digite seu usuário"
              value={formData.usuario}
              onChange={(e) =>
                setFormData({ ...formData, usuario: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              placeholder="Digite sua senha"
              value={formData.senha}
              onChange={(e) =>
                setFormData({ ...formData, senha: e.target.value })
              }
              required
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: "100%", marginTop: "20px" }}
          >
            {loading ? "Processando..." : isLogin ? "Entrar" : "Criar Conta"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}{" "}
            <button onClick={toggleMode} className="auth-link">
              {isLogin ? "Cadastre-se" : "Faça login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
