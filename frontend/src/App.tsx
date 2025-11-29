import React, { useState, useEffect } from "react";
import "./App.css";
import { Aeronave, TipoAeronave, Funcionario, NivelPermissao } from "./types";
import { aeronaveService } from "./services/aeronaveService";
import { funcionarioService } from "./services/funcionarioService";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./components/Login";
import AeronaveForm from "./components/AeronaveForm";
import AeronaveList from "./components/AeronaveList";
import AeronaveDetail from "./components/AeronaveDetail";
import FuncionarioForm from "./components/FuncionarioForm";
import FuncionarioList from "./components/FuncionarioList";

function MainApp() {
  const { user, logout, isAdmin, isEngenheiro } = useAuth();
  const [activeTab, setActiveTab] = useState<"aeronaves" | "funcionarios">(
    "aeronaves"
  );
  const [aeronaves, setAeronaves] = useState<Aeronave[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingAeronave, setEditingAeronave] = useState<Aeronave | null>(null);
  const [selectedAeronave, setSelectedAeronave] = useState<Aeronave | null>(
    null
  );

  const fetchAeronaves = async () => {
    try {
      setLoading(true);
      const data = await aeronaveService.getAll();
      setAeronaves(data);
      setError(null);
    } catch (err: any) {
      setError(
        "Erro ao carregar aeronaves. Verifique se o servidor está rodando."
      );
      console.error("Erro:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFuncionarios = async () => {
    try {
      setLoading(true);
      const data = await funcionarioService.getAll();
      setFuncionarios(data);
      setError(null);
    } catch (err: any) {
      setError(
        "Erro ao carregar funcionários. Verifique se o servidor está rodando."
      );
      console.error("Erro:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "aeronaves") {
      fetchAeronaves();
    } else {
      fetchFuncionarios();
    }
  }, [activeTab]);

  const handleCreate = async (data: {
    codigo: string;
    modelo: string;
    tipo: TipoAeronave;
    capacidade: number;
    alcance: number;
  }) => {
    try {
      await aeronaveService.create(data);
      setSuccess("Aeronave criada com sucesso!");
      fetchAeronaves();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao criar aeronave");
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleUpdate = async (id: string, data: Partial<Aeronave>) => {
    try {
      await aeronaveService.update(id, data);
      setSuccess("Aeronave atualizada com sucesso!");
      setEditingAeronave(null);
      fetchAeronaves();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao atualizar aeronave");
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja deletar esta aeronave?")) {
      try {
        await aeronaveService.delete(id);
        setSuccess("Aeronave deletada com sucesso!");
        fetchAeronaves();
        setTimeout(() => setSuccess(null), 3000);
      } catch (err: any) {
        setError(err.response?.data?.error || "Erro ao deletar aeronave");
        setTimeout(() => setError(null), 5000);
      }
    }
  };

  const handleEdit = (aeronave: Aeronave) => {
    setEditingAeronave(aeronave);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingAeronave(null);
  };

  const handleViewDetails = (aeronave: Aeronave) => {
    setSelectedAeronave(aeronave);
  };

  const handleCloseDetails = () => {
    setSelectedAeronave(null);
    fetchAeronaves(); // Atualiza a lista após fechar os detalhes
  };

  const handleCreateFuncionario = async (data: {
    nome: string;
    cpf: string;
    endereco: string;
    usuario: string;
    senha: string;
    nivelPermissao: NivelPermissao;
  }) => {
    try {
      await funcionarioService.create(data);
      setSuccess("Funcionário cadastrado com sucesso!");
      fetchFuncionarios();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao cadastrar funcionário");
      setTimeout(() => setError(null), 5000);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h1>Aerocode</h1>
              <p>Sistema de Gerenciamento de Aeronaves</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: "white", marginBottom: "8px" }}>
                <strong>{user?.nome}</strong>
                <br />
                <span style={{ fontSize: "0.9em", opacity: 0.9 }}>
                  {user?.nivelPermissao}
                </span>
              </div>
              <button onClick={logout} className="btn btn-secondary">
                Sair
              </button>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="tabs">
          <button
            onClick={() => setActiveTab("aeronaves")}
            className={`tab-button ${
              activeTab === "aeronaves" ? "active" : ""
            }`}
          >
            <span>Aeronaves</span>
          </button>
          {(isAdmin() || isEngenheiro()) && (
            <button
              onClick={() => setActiveTab("funcionarios")}
              className={`tab-button ${
                activeTab === "funcionarios" ? "active" : ""
              }`}
            >
              <span>Funcionários</span>
            </button>
          )}
        </div>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        {/* Aeronaves Tab */}
        {activeTab === "aeronaves" && (
          <>
            {(isAdmin() || isEngenheiro()) && (
              <div className="card">
                <h2>
                  {editingAeronave
                    ? "Editar Aeronave"
                    : "Cadastrar Nova Aeronave"}
                </h2>
                <AeronaveForm
                  onSubmit={
                    editingAeronave
                      ? (data) => handleUpdate(editingAeronave.id, data)
                      : handleCreate
                  }
                  initialData={editingAeronave || undefined}
                  onCancel={editingAeronave ? handleCancelEdit : undefined}
                />
              </div>
            )}

            <div className="card">
              <h2>Aeronaves Cadastradas</h2>
              {loading ? (
                <div className="loading">Carregando aeronaves...</div>
              ) : (
                <AeronaveList
                  aeronaves={aeronaves}
                  onEdit={isAdmin() || isEngenheiro() ? handleEdit : undefined}
                  onDelete={isAdmin() ? handleDelete : undefined}
                  onViewDetails={handleViewDetails}
                />
              )}
            </div>
          </>
        )}

        {/* Funcionários Tab - Apenas ADMIN */}
        {activeTab === "funcionarios" && isAdmin() && (
          <>
            <div className="card">
              <h2>Cadastrar Novo Funcionário</h2>
              <FuncionarioForm onSubmit={handleCreateFuncionario} />
            </div>

            <div className="card">
              <h2>Funcionários Cadastrados</h2>
              {loading ? (
                <div className="loading">Carregando funcionários...</div>
              ) : (
                <FuncionarioList funcionarios={funcionarios} />
              )}
            </div>
          </>
        )}
      </div>

      {selectedAeronave && (
        <AeronaveDetail
          aeronave={selectedAeronave}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
}

function App() {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return <MainApp />;
}

export default function AppWithAuth() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
