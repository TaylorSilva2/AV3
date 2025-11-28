import React, { useState } from "react";
import { NivelPermissao } from "../types";

interface FuncionarioFormProps {
  onSubmit: (data: {
    nome: string;
    cpf: string;
    endereco: string;
    usuario: string;
    senha: string;
    nivelPermissao: NivelPermissao;
  }) => void;
}

const FuncionarioForm: React.FC<FuncionarioFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    endereco: "",
    usuario: "",
    senha: "",
    nivelPermissao: NivelPermissao.OPERADOR,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      nome: "",
      cpf: "",
      endereco: "",
      usuario: "",
      senha: "",
      nivelPermissao: NivelPermissao.OPERADOR,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="nome">Nome Completo *</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
            placeholder="Ex: João da Silva"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="cpf">CPF *</label>
          <input
            type="text"
            id="cpf"
            name="cpf"
            value={formData.cpf}
            onChange={(e) => {
              const formatted = formatCPF(e.target.value);
              setFormData((prev) => ({ ...prev, cpf: formatted }));
            }}
            required
            maxLength={14}
            placeholder="000.000.000-00"
          />
        </div>

        <div className="form-group">
          <label htmlFor="endereco">Endereço *</label>
          <input
            type="text"
            id="endereco"
            name="endereco"
            value={formData.endereco}
            onChange={handleChange}
            required
            placeholder="Ex: Rua X, 123"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="usuario">Usuário *</label>
          <input
            type="text"
            id="usuario"
            name="usuario"
            value={formData.usuario}
            onChange={handleChange}
            required
            placeholder="Ex: joao.silva"
          />
        </div>

        <div className="form-group">
          <label htmlFor="senha">Senha *</label>
          <input
            type="password"
            id="senha"
            name="senha"
            value={formData.senha}
            onChange={handleChange}
            required
            minLength={6}
            placeholder="Mínimo 6 caracteres"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="nivelPermissao">Nível de Permissão *</label>
        <select
          id="nivelPermissao"
          name="nivelPermissao"
          value={formData.nivelPermissao}
          onChange={handleChange}
          required
        >
          <option value={NivelPermissao.OPERADOR}>Operador</option>
          <option value={NivelPermissao.ENGENHEIRO}>Engenheiro</option>
          <option value={NivelPermissao.ADMINISTRADOR}>Administrador</option>
        </select>
      </div>

      <div className="actions">
        <button type="submit" className="btn btn-primary">
          Cadastrar Funcionário
        </button>
      </div>
    </form>
  );
};

export default FuncionarioForm;
