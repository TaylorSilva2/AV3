const express = require("express");
const router = express.Router();
const prisma = require("../prisma");

// Listar todas as aeronaves
router.get("/", async (req, res) => {
  try {
    const aeronaves = await prisma.aeronave.findMany({
      include: {
        pecas: true,
        etapas: true,
        testes: true,
        relatorios: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(aeronaves);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao buscar aeronaves", details: error.message });
  }
});

// Buscar aeronave por ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const aeronave = await prisma.aeronave.findUnique({
      where: { id },
      include: {
        pecas: true,
        etapas: {
          include: {
            funcionarios: {
              include: {
                funcionario: true,
              },
            },
          },
        },
        testes: {
          include: {
            funcionario: true,
          },
        },
        relatorios: true,
      },
    });

    if (!aeronave) {
      return res.status(404).json({ error: "Aeronave não encontrada" });
    }

    res.json(aeronave);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao buscar aeronave", details: error.message });
  }
});

// Criar nova aeronave
router.post("/", async (req, res) => {
  try {
    const { codigo, modelo, tipo, capacidade, alcance } = req.body;

    if (
      !codigo ||
      !modelo ||
      !tipo ||
      capacidade === undefined ||
      alcance === undefined
    ) {
      return res
        .status(400)
        .json({
          error:
            "Campos obrigatórios: codigo, modelo, tipo, capacidade, alcance",
        });
    }

    const aeronave = await prisma.aeronave.create({
      data: {
        codigo,
        modelo,
        tipo,
        capacidade: parseInt(capacidade),
        alcance: parseFloat(alcance),
      },
    });

    res.status(201).json(aeronave);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({ error: "Código de aeronave já existe" });
    }
    res
      .status(500)
      .json({ error: "Erro ao criar aeronave", details: error.message });
  }
});

// Atualizar aeronave
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { codigo, modelo, tipo, alcance } = req.body;

    const aeronave = await prisma.aeronave.update({
      where: { id },
      data: {
        ...(codigo && { codigo }),
        ...(modelo && { modelo }),
        ...(tipo && { tipo }),
        ...(alcance !== undefined && { alcance: parseFloat(alcance) }),
      },
    });

    res.json(aeronave);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Aeronave não encontrada" });
    }
    if (error.code === "P2002") {
      return res.status(400).json({ error: "Código de aeronave já existe" });
    }
    res
      .status(500)
      .json({ error: "Erro ao atualizar aeronave", details: error.message });
  }
});

// Deletar aeronave
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.aeronave.delete({
      where: { id },
    });

    res.json({ message: "Aeronave deletada com sucesso" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Aeronave não encontrada" });
    }
    res
      .status(500)
      .json({ error: "Erro ao deletar aeronave", details: error.message });
  }
});

module.exports = router;
