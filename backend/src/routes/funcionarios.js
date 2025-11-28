const express = require("express");
const router = express.Router();
const prisma = require("../prisma");

// Listar todos os funcionários
router.get("/", async (req, res) => {
  try {
    const funcionarios = await prisma.funcionario.findMany({
      select: {
        id: true,
        nome: true,
        cpf: true,
        endereco: true,
        usuario: true,
        nivelPermissao: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { nome: "asc" },
    });
    res.json(funcionarios);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao buscar funcionários", details: error.message });
  }
});

// Criar novo funcionário
router.post("/", async (req, res) => {
  try {
    const { nome, cpf, endereco, usuario, senha, nivelPermissao } = req.body;

    if (!nome || !cpf || !usuario || !senha || !nivelPermissao) {
      return res.status(400).json({
        error: "Campos obrigatórios: nome, cpf, usuario, senha, nivelPermissao",
      });
    }

    const funcionario = await prisma.funcionario.create({
      data: { nome, cpf, endereco, usuario, senha, nivelPermissao },
      select: {
        id: true,
        nome: true,
        cpf: true,
        endereco: true,
        usuario: true,
        nivelPermissao: true,
        createdAt: true,
      },
    });

    res.status(201).json(funcionario);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({ error: "Usuário ou CPF já existe" });
    }
    res
      .status(500)
      .json({ error: "Erro ao criar funcionário", details: error.message });
  }
});

module.exports = router;
