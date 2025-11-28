const express = require("express");
const router = express.Router();
const prisma = require("../prisma");

// Listar todas as etapas
router.get("/", async (req, res) => {
  try {
    const etapas = await prisma.etapa.findMany({
      include: {
        aeronave: true,
        funcionarios: {
          include: { funcionario: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(etapas);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao buscar etapas", details: error.message });
  }
});

// Criar nova etapa
router.post("/", async (req, res) => {
  try {
    const { nome, tipo, status, aeronaveId } = req.body;

    if (!nome || !tipo || !aeronaveId) {
      return res
        .status(400)
        .json({ error: "Campos obrigatórios: nome, tipo, aeronaveId" });
    }

    const etapa = await prisma.etapa.create({
      data: { nome, tipo, status, aeronaveId },
      include: { aeronave: true },
    });

    res.status(201).json(etapa);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao criar etapa", details: error.message });
  }
});

// Associar funcionário à etapa
router.post("/associar-funcionario", async (req, res) => {
  try {
    console.log("🔗 POST /associar-funcionario chamado", req.body);
    const { etapaId, funcionarioId } = req.body;

    if (!etapaId || !funcionarioId) {
      return res
        .status(400)
        .json({ error: "Campos obrigatórios: etapaId, funcionarioId" });
    }

    const associacao = await prisma.etapaFuncionario.create({
      data: { etapaId, funcionarioId },
      include: {
        funcionario: {
          select: {
            id: true,
            nome: true,
            nivelPermissao: true,
          },
        },
      },
    });

    console.log("✅ Associação criada:", associacao);
    res.status(201).json(associacao);
  } catch (error) {
    console.error("❌ Erro ao associar:", error);
    if (error.code === "P2002") {
      return res
        .status(400)
        .json({ error: "Funcionário já está associado a esta etapa" });
    }
    res
      .status(500)
      .json({ error: "Erro ao associar funcionário", details: error.message });
  }
});

// Listar funcionários de uma etapa
router.get("/:id/funcionarios", async (req, res) => {
  try {
    const { id } = req.params;

    const associacoes = await prisma.etapaFuncionario.findMany({
      where: { etapaId: id },
      include: {
        funcionario: {
          select: {
            id: true,
            nome: true,
            nivelPermissao: true,
          },
        },
      },
    });

    res.json(associacoes);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao listar funcionários", details: error.message });
  }
});

// Atualizar status da etapa
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const etapa = await prisma.etapa.update({
      where: { id },
      data: { status },
      include: { aeronave: true },
    });

    res.json(etapa);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao atualizar etapa", details: error.message });
  }
});

module.exports = router;
