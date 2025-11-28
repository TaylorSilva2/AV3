import React, { useState, useEffect } from "react";
import { Aeronave, TipoAeronave } from "../types";

interface AeronaveFormProps {
  onSubmit: (data: {
    codigo: string;
    modelo: string;
    tipo: TipoAeronave;
    capacidade: number;
    alcance: number;
  }) => void;
  initialData?: Aeronave;
  onCancel?: () => void;
}

const AeronaveForm: React.FC<AeronaveFormProps> = ({
  onSubmit,
  initialData,
  onCancel,
}) => {
  const [formData, setFormData] = useState<{
    codigo: string;
    modelo: string;
    tipo: TipoAeronave;
    capacidade: number | "";
    alcance: number | "";
  }>({
    codigo: "",
    modelo: "",
    tipo: TipoAeronave.COMERCIAL,
    capacidade: "",
    alcance: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        codigo: initialData.codigo,
        modelo: initialData.modelo,
        tipo: initialData.tipo,
        capacidade: initialData.capacidade,
        alcance: initialData.alcance,
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      capacidade: formData.capacidade === "" ? 0 : Number(formData.capacidade),
      alcance: formData.alcance === "" ? 0 : Number(formData.alcance),
    };
    onSubmit(submitData);
    if (!initialData) {
      setFormData({
        codigo: "",
        modelo: "",
        tipo: TipoAeronave.COMERCIAL,
        capacidade: "",
        alcance: "",
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "alcance" || name === "capacidade"
          ? value === ""
            ? ""
            : parseFloat(value) || ""
          : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="codigo">Código da Aeronave *</label>
          <input
            type="text"
            id="codigo"
            name="codigo"
            value={formData.codigo}
            onChange={handleChange}
            required
            placeholder="Ex: AER-001"
          />
        </div>

        <div className="form-group">
          <label htmlFor="modelo">Modelo *</label>
          <input
            type="text"
            id="modelo"
            name="modelo"
            value={formData.modelo}
            onChange={handleChange}
            required
            placeholder="Ex: Boeing 737"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="tipo">Tipo *</label>
          <select
            id="tipo"
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            required
          >
            <option value={TipoAeronave.COMERCIAL}>Comercial</option>
            <option value={TipoAeronave.MILITAR}>Militar</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="capacidade">Capacidade (passageiros) *</label>
          <input
            type="number"
            id="capacidade"
            name="capacidade"
            value={formData.capacidade}
            onChange={handleChange}
            required
            min="0"
            placeholder="Ex: 180"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="alcance">Alcance (km) *</label>
          <input
            type="number"
            id="alcance"
            name="alcance"
            value={formData.alcance}
            onChange={handleChange}
            required
            min="0"
            step="0.1"
            placeholder="Ex: 5000"
          />
        </div>
      </div>

      <div className="actions">
        <button type="submit" className="btn btn-primary">
          {initialData ? "Atualizar Aeronave" : "Cadastrar Aeronave"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default AeronaveForm;
