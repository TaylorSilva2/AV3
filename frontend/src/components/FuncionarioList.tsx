import React from "react";
import { Funcionario } from "../types";

interface FuncionarioListProps {
  funcionarios: Funcionario[];
}

const FuncionarioList: React.FC<FuncionarioListProps> = ({ funcionarios }) => {
  if (funcionarios.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
        <p>Nenhum funcionário cadastrado ainda.</p>
        <p>Use o formulário acima para cadastrar o primeiro funcionário.</p>
      </div>
    );
  }

  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case "ADMINISTRADOR":
        return "#f44336";
      case "ENGENHEIRO":
        return "#2196f3";
      case "OPERADOR":
        return "#4caf50";
      default:
        return "#757575";
    }
  };

  const formatNivel = (nivel: string) => {
    return nivel.charAt(0) + nivel.slice(1).toLowerCase();
  };

  return (
    <div className="aeronave-list">
      {funcionarios.map((funcionario) => (
        <div key={funcionario.id} className="aeronave-item">
          <h3>{funcionario.nome}</h3>
          <p>
            <strong>ID:</strong> {funcionario.id}
          </p>
          <p>
            <strong>CPF:</strong> {funcionario.cpf}
          </p>
          <p>
            <strong>Endereço:</strong> {funcionario.endereco}
          </p>
          <p>
            <strong>Usuário:</strong> {funcionario.usuario}
          </p>
          <span
            className="badge"
            style={{
              backgroundColor: getNivelColor(funcionario.nivelPermissao),
              color: "white",
            }}
          >
            {formatNivel(funcionario.nivelPermissao)}
          </span>
          <p style={{ fontSize: "0.85em", color: "#999", marginTop: "10px" }}>
            Cadastrado em:{" "}
            {new Date(funcionario.createdAt).toLocaleDateString("pt-BR")}
          </p>
        </div>
      ))}
    </div>
  );
};

export default FuncionarioList;
