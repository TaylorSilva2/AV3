import React, { useState, useEffect } from "react";
import {
  Aeronave,
  Peca,
  Etapa,
  Teste,
  TipoPeca,
  StatusPeca,
  StatusEtapa,
  TipoTeste,
  ResultadoTeste,
} from "../types";
import { pecaService } from "../services/pecaService";
import { etapaService } from "../services/etapaService";
import { testeService } from "../services/testeService";
import { funcionarioService } from "../services/funcionarioService";
import { etapaFuncionarioService } from "../services/etapaFuncionarioService";
import { useAuth } from "../contexts/AuthContext";

interface AeronaveDetailProps {
  aeronave: Aeronave;
  onClose: () => void;
}

const AeronaveDetail: React.FC<AeronaveDetailProps> = ({
  aeronave,
  onClose,
}) => {
  const { isAdmin, isEngenheiro } = useAuth();
  const canEdit = isAdmin() || isEngenheiro();

  const [pecas, setPecas] = useState<Peca[]>([]);
  const [etapas, setEtapas] = useState<Etapa[]>([]);
  const [testes, setTestes] = useState<Teste[]>([]);
  const [funcionarios, setFuncionarios] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"pecas" | "etapas" | "testes">(
    "pecas"
  );

  // Estados para formulários
  const [showPecaForm, setShowPecaForm] = useState(false);
  const [showEtapaForm, setShowEtapaForm] = useState(false);
  const [showTesteForm, setShowTesteForm] = useState(false);

  // Formulário de Peça
  const [pecaForm, setPecaForm] = useState({
    nome: "",
    tipo: TipoPeca.NACIONAL,
    fornecedor: "",
  });

  // Formulário de Etapa
  const [etapaForm, setEtapaForm] = useState({
    nome: "",
    tipo: "",
  });

  // Formulário de Teste
  const [testeForm, setTesteForm] = useState<{
    tipo: TipoTeste;
    funcionarioId: number | "";
  }>({
    tipo: TipoTeste.ELETRICO,
    funcionarioId: "",
  });

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aeronave.id]);

  const loadData = async () => {
    try {
      const [pecasData, etapasData, testesData, funcionariosData] =
        await Promise.all([
          pecaService.getByAeronave(aeronave.id),
          etapaService.getByAeronave(aeronave.id),
          testeService.getByAeronave(aeronave.id),
          funcionarioService.getAll(),
        ]);
      setPecas(pecasData);
      setEtapas(etapasData);
      setTestes(testesData);
      setFuncionarios(funcionariosData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  const handleAddPeca = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await pecaService.create({
        ...pecaForm,
        aeronaveId: aeronave.id,
      });
      setPecaForm({ nome: "", tipo: TipoPeca.NACIONAL, fornecedor: "" });
      setShowPecaForm(false);
      loadData();
    } catch (error) {
      console.error("Erro ao criar peça:", error);
    }
  };

  const handleAddEtapa = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await etapaService.create({
        ...etapaForm,
        aeronaveId: aeronave.id,
      });
      setEtapaForm({ nome: "", tipo: "" });
      setShowEtapaForm(false);
      loadData();
    } catch (error) {
      console.error("Erro ao criar etapa:", error);
    }
  };

  const handleAddTeste = async (e: React.FormEvent) => {
    e.preventDefault();
    if (testeForm.funcionarioId === "") {
      alert("Selecione um funcionário");
      return;
    }
    try {
      await testeService.create({
        ...testeForm,
        funcionarioId: Number(testeForm.funcionarioId),
        aeronaveId: aeronave.id,
      });
      setTesteForm({ tipo: TipoTeste.ELETRICO, funcionarioId: "" });
      setShowTesteForm(false);
      loadData();
    } catch (error) {
      console.error("Erro ao criar teste:", error);
    }
  };

  const handleUpdatePecaStatus = async (id: string, status: StatusPeca) => {
    try {
      await pecaService.updateStatus(id, status);
      loadData();
    } catch (error) {
      console.error("Erro ao atualizar status da peça:", error);
    }
  };

  const handleUpdateEtapaStatus = async (id: string, status: StatusEtapa) => {
    try {
      await etapaService.updateStatus(id, status);
      loadData();
    } catch (error) {
      console.error("Erro ao atualizar status da etapa:", error);
    }
  };

  const handleAssociarFuncionario = async (
    etapaId: string,
    funcionarioId: number
  ) => {
    try {
      await etapaFuncionarioService.associar(etapaId, funcionarioId);
      loadData();
    } catch (error: any) {
      alert(error.response?.data?.error || "Erro ao associar funcionário");
      console.error("Erro ao associar funcionário:", error);
    }
  };

  const handleUpdateTesteResultado = async (
    id: string,
    resultado: ResultadoTeste
  ) => {
    try {
      await testeService.updateResultado(id, resultado);
      loadData();
    } catch (error) {
      console.error("Erro ao atualizar resultado do teste:", error);
    }
  };

  const formatStatus = (status: string) => {
    return status
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="modal-overlay">
      <div
        className="modal-content"
        style={{ width: "100%", maxWidth: "900px" }}
      >
        <div className="modal-header">
          <h2>Detalhes da Aeronave</h2>
          <button onClick={onClose} className="modal-close">
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="card" style={{ marginBottom: "28px" }}>
            <h3
              style={{
                color: "#93c5fd",
                marginBottom: "16px",
                fontSize: "1.8em",
                fontWeight: "700",
              }}
            >
              {aeronave.modelo}
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              <p
                style={{
                  color: "#ffffff",
                  fontSize: "1.1em",
                  fontWeight: "500",
                }}
              >
                <strong style={{ color: "#60a5fa", fontWeight: "700" }}>
                  Código:
                </strong>{" "}
                {aeronave.codigo}
              </p>
              <p
                style={{
                  color: "#ffffff",
                  fontSize: "1.1em",
                  fontWeight: "500",
                }}
              >
                <strong style={{ color: "#60a5fa", fontWeight: "700" }}>
                  Tipo:
                </strong>{" "}
                {aeronave.tipo}
              </p>
              <p
                style={{
                  color: "#ffffff",
                  fontSize: "1.1em",
                  fontWeight: "500",
                }}
              >
                <strong style={{ color: "#60a5fa", fontWeight: "700" }}>
                  Alcance:
                </strong>{" "}
                {aeronave.alcance.toLocaleString("pt-BR")} km
              </p>
              <p
                style={{
                  color: "#ffffff",
                  fontSize: "1.1em",
                  fontWeight: "500",
                }}
              >
                <strong style={{ color: "#60a5fa", fontWeight: "700" }}>
                  Capacidade:
                </strong>{" "}
                {aeronave.capacidade} passageiros
              </p>
            </div>
          </div>

          {/* Sub-tabs */}
          <div className="sub-tabs">
            <button
              onClick={() => setActiveTab("pecas")}
              className={`sub-tab-button ${
                activeTab === "pecas" ? "active" : ""
              }`}
            >
              🔧 Peças ({pecas.length})
            </button>
            <button
              onClick={() => setActiveTab("etapas")}
              className={`sub-tab-button ${
                activeTab === "etapas" ? "active" : ""
              }`}
            >
              📋 Etapas ({etapas.length})
            </button>
            <button
              onClick={() => setActiveTab("testes")}
              className={`sub-tab-button ${
                activeTab === "testes" ? "active" : ""
              }`}
            >
              ✓ Testes ({testes.length})
            </button>
          </div>

          {/* Conteúdo das Tabs */}
          {activeTab === "pecas" && (
            <div>
              {canEdit && (
                <button
                  onClick={() => setShowPecaForm(!showPecaForm)}
                  className="btn btn-primary"
                  style={{ marginBottom: "15px" }}
                >
                  {showPecaForm ? "Cancelar" : "+ Adicionar Peça"}
                </button>
              )}

              {showPecaForm && canEdit && (
                <form
                  onSubmit={handleAddPeca}
                  style={{
                    marginBottom: "20px",
                    padding: "20px",
                    backgroundColor: "rgba(30, 41, 59, 0.6)",
                    borderRadius: "12px",
                    border: "1px solid rgba(148, 163, 184, 0.2)",
                  }}
                >
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Nome da peça"
                      value={pecaForm.nome}
                      onChange={(e) =>
                        setPecaForm({ ...pecaForm, nome: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <select
                      value={pecaForm.tipo}
                      onChange={(e) =>
                        setPecaForm({
                          ...pecaForm,
                          tipo: e.target.value as TipoPeca,
                        })
                      }
                      required
                    >
                      <option value={TipoPeca.NACIONAL}>Nacional</option>
                      <option value={TipoPeca.IMPORTADA}>Importada</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Fornecedor"
                      value={pecaForm.fornecedor}
                      onChange={(e) =>
                        setPecaForm({ ...pecaForm, fornecedor: e.target.value })
                      }
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-success">
                    Salvar Peça
                  </button>
                </form>
              )}

              <div style={{ display: "grid", gap: "16px" }}>
                {pecas.map((peca) => (
                  <div key={peca.id} className="item-card">
                    <h4>{peca.nome}</h4>
                    <p>
                      <strong>Tipo:</strong>{" "}
                      {peca.tipo === TipoPeca.NACIONAL
                        ? "Nacional"
                        : "Importada"}
                    </p>
                    <p>
                      <strong>Fornecedor:</strong> {peca.fornecedor}
                    </p>
                    <div
                      style={{
                        marginTop: "12px",
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                      }}
                    >
                      <span
                        className={`status-badge status-${peca.status
                          .toLowerCase()
                          .replace("_", "-")}`}
                      >
                        {formatStatus(peca.status)}
                      </span>
                      <select
                        value={peca.status}
                        onChange={(e) =>
                          handleUpdatePecaStatus(
                            peca.id,
                            e.target.value as StatusPeca
                          )
                        }
                        className="form-group"
                        style={{ flex: 1, marginBottom: 0 }}
                      >
                        <option value="EM_PRODUCAO">Em Produção</option>
                        <option value="EM_TRANSPORTE">Em Transporte</option>
                        <option value="PRONTA">Pronta</option>
                      </select>
                    </div>
                  </div>
                ))}
                {pecas.length === 0 && (
                  <p style={{ textAlign: "center", color: "#999" }}>
                    Nenhuma peça cadastrada
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === "etapas" && (
            <div>
              {canEdit && (
                <button
                  onClick={() => setShowEtapaForm(!showEtapaForm)}
                  className="btn btn-primary"
                  style={{ marginBottom: "15px" }}
                >
                  {showEtapaForm ? "Cancelar" : "+ Adicionar Etapa"}
                </button>
              )}

              {showEtapaForm && canEdit && (
                <form
                  onSubmit={handleAddEtapa}
                  style={{
                    marginBottom: "20px",
                    padding: "20px",
                    backgroundColor: "rgba(30, 41, 59, 0.6)",
                    borderRadius: "12px",
                    border: "1px solid rgba(148, 163, 184, 0.2)",
                  }}
                >
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Nome da etapa"
                      value={etapaForm.nome}
                      onChange={(e) =>
                        setEtapaForm({ ...etapaForm, nome: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Tipo"
                      value={etapaForm.tipo}
                      onChange={(e) =>
                        setEtapaForm({ ...etapaForm, tipo: e.target.value })
                      }
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-success">
                    Salvar Etapa
                  </button>
                </form>
              )}

              <div style={{ display: "grid", gap: "16px" }}>
                {etapas.map((etapa) => (
                  <div key={etapa.id} className="item-card">
                    <h4>{etapa.nome}</h4>
                    <p>
                      <strong>Tipo:</strong> {etapa.tipo}
                    </p>

                    {/* Funcionários associados */}
                    {etapa.funcionarios && etapa.funcionarios.length > 0 && (
                      <div
                        style={{
                          margin: "12px 0",
                          padding: "12px",
                          backgroundColor: "#e0e7ff",
                          borderRadius: "8px",
                          border: "1px solid #c7d2fe",
                        }}
                      >
                        <strong style={{ color: "#3730a3" }}>
                          👤 Funcionários:
                        </strong>
                        {etapa.funcionarios.map((ef: any) => (
                          <div
                            key={ef.id}
                            style={{
                              marginTop: "6px",
                              fontSize: "0.9em",
                              color: "#4338ca",
                            }}
                          >
                            • {ef.funcionario.nome} (
                            {ef.funcionario.nivelPermissao})
                          </div>
                        ))}
                      </div>
                    )}

                    <div
                      style={{
                        marginTop: "12px",
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                      }}
                    >
                      <span
                        className={`status-badge status-${etapa.status
                          .toLowerCase()
                          .replace("_", "-")}`}
                      >
                        {formatStatus(etapa.status)}
                      </span>
                      <select
                        value={etapa.status}
                        onChange={(e) =>
                          handleUpdateEtapaStatus(
                            etapa.id,
                            e.target.value as StatusEtapa
                          )
                        }
                        className="form-group"
                        style={{ flex: 1, marginBottom: 0 }}
                      >
                        <option value="PENDENTE">Pendente</option>
                        <option value="ANDAMENTO">Em Andamento</option>
                        <option value="CONCLUIDA">Concluída</option>
                      </select>
                    </div>

                    {/* Associar funcionário */}
                    <div
                      style={{
                        marginTop: "10px",
                        paddingTop: "10px",
                        borderTop: "1px solid #e0e0e0",
                      }}
                    >
                      <label style={{ fontSize: "14px", marginRight: "10px" }}>
                        <strong>Associar funcionário:</strong>
                      </label>
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            handleAssociarFuncionario(
                              etapa.id,
                              Number(e.target.value)
                            );
                            e.target.value = "";
                          }
                        }}
                        style={{ padding: "5px" }}
                      >
                        <option value="">Selecione...</option>
                        {funcionarios.map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.nome} - {f.nivelPermissao}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
                {etapas.length === 0 && (
                  <p style={{ textAlign: "center", color: "#999" }}>
                    Nenhuma etapa cadastrada
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === "testes" && (
            <div>
              {canEdit && (
                <button
                  onClick={() => setShowTesteForm(!showTesteForm)}
                  className="btn btn-primary"
                  style={{ marginBottom: "15px" }}
                >
                  {showTesteForm ? "Cancelar" : "+ Adicionar Teste"}
                </button>
              )}

              {showTesteForm && canEdit && (
                <form
                  onSubmit={handleAddTeste}
                  style={{
                    marginBottom: "20px",
                    padding: "20px",
                    backgroundColor: "rgba(30, 41, 59, 0.6)",
                    borderRadius: "12px",
                    border: "1px solid rgba(148, 163, 184, 0.2)",
                  }}
                >
                  <div className="form-group">
                    <select
                      value={testeForm.tipo}
                      onChange={(e) =>
                        setTesteForm({
                          ...testeForm,
                          tipo: e.target.value as TipoTeste,
                        })
                      }
                      required
                    >
                      <option value="ELETRICO">Elétrico</option>
                      <option value="HIDRAULICO">Hidráulico</option>
                      <option value="AERODINAMICO">Aerodinâmico</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <select
                      value={testeForm.funcionarioId}
                      onChange={(e) =>
                        setTesteForm({
                          ...testeForm,
                          funcionarioId:
                            e.target.value === "" ? "" : Number(e.target.value),
                        })
                      }
                      required
                    >
                      <option value="">Selecione o funcionário</option>
                      {funcionarios.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.nome} - {f.nivelPermissao}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" className="btn btn-success">
                    Salvar Teste
                  </button>
                </form>
              )}

              <div style={{ display: "grid", gap: "16px" }}>
                {testes.map((teste) => (
                  <div key={teste.id} className="item-card">
                    <h4>{formatStatus(teste.tipo)}</h4>
                    <p>
                      <strong>Funcionário:</strong>{" "}
                      {teste.funcionario?.nome || "N/A"}
                    </p>
                    <div
                      style={{
                        marginTop: "12px",
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                      }}
                    >
                      {teste.resultado ? (
                        <span
                          className={`status-badge status-${teste.resultado
                            .toLowerCase()
                            .replace("_", "-")}`}
                        >
                          {formatStatus(teste.resultado)}
                        </span>
                      ) : (
                        <span
                          className="status-badge"
                          style={{ background: "#f1f5f9", color: "#64748b" }}
                        >
                          Aguardando resultado
                        </span>
                      )}
                      <select
                        value={teste.resultado || ""}
                        onChange={(e) =>
                          e.target.value &&
                          handleUpdateTesteResultado(
                            teste.id,
                            e.target.value as ResultadoTeste
                          )
                        }
                        className="form-group"
                        style={{ flex: 1, marginBottom: 0 }}
                      >
                        <option value="">Definir resultado</option>
                        <option value="APROVADO">Aprovado</option>
                        <option value="REPROVADO">Reprovado</option>
                      </select>
                    </div>
                  </div>
                ))}
                {testes.length === 0 && (
                  <p
                    style={{
                      textAlign: "center",
                      color: "#94a3b8",
                      marginTop: "20px",
                    }}
                  >
                    Nenhum teste cadastrado
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AeronaveDetail;
