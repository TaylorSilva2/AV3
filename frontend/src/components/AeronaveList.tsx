import React from "react";
import { Aeronave } from "../types";

interface AeronaveListProps {
  aeronaves: Aeronave[];
  onEdit?: (aeronave: Aeronave) => void;
  onDelete?: (id: string) => void;
  onViewDetails: (aeronave: Aeronave) => void;
}

const AeronaveList: React.FC<AeronaveListProps> = ({
  aeronaves,
  onEdit,
  onDelete,
  onViewDetails,
}) => {
  if (aeronaves.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
        <p>Nenhuma aeronave cadastrada ainda.</p>
        <p>Use o formulário acima para cadastrar a primeira aeronave.</p>
      </div>
    );
  }

  return (
    <div className="aeronave-list">
      {aeronaves.map((aeronave) => (
        <div key={aeronave.id} className="aeronave-item">
          <h3>{aeronave.modelo}</h3>
          <p>
            <strong>Código:</strong> {aeronave.codigo}
          </p>
          <p>
            <strong>Capacidade:</strong> {aeronave.capacidade} passageiros
          </p>
          <p>
            <strong>Alcance:</strong> {aeronave.alcance.toLocaleString("pt-BR")}{" "}
            km
          </p>
          <span className={`badge badge-${aeronave.tipo.toLowerCase()}`}>
            {aeronave.tipo === "COMERCIAL" ? "Comercial" : "Militar"}
          </span>

          <div className="actions">
            <button
              onClick={() => onViewDetails(aeronave)}
              className="btn btn-primary"
              style={{ fontSize: "14px", padding: "8px 16px" }}
            >
              Ver Detalhes
            </button>
            {onEdit && (
              <button
                onClick={() => onEdit(aeronave)}
                className="btn btn-secondary"
                style={{ fontSize: "14px", padding: "8px 16px" }}
              >
                Editar
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(aeronave.id)}
                className="btn btn-danger"
                style={{ fontSize: "14px", padding: "8px 16px" }}
              >
                Deletar
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AeronaveList;
