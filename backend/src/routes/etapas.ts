import { Router, Request, Response } from "express";
import prisma from "../prisma";

const router = Router();

console.log("✅ Router de etapas carregado");

// Listar todas as etapas
router.get("/", async (req: Request, res: Response) => {
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
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Erro ao buscar etapas", details: error.message });
  }
});

// Criar nova etapa
router.post("/", async (req: Request, res: Response) => {
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
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Erro ao criar etapa", details: error.message });
  }
});

// Associar funcionário à etapa (ANTES das rotas com :id)
router.post("/associar-funcionario", async (req: Request, res: Response) => {
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
  } catch (error: any) {
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

// Listar funcionários de uma etapa (ANTES das rotas com :id genérico)
router.get("/:id/funcionarios", async (req: Request, res: Response) => {
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
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Erro ao listar funcionários", details: error.message });
  }
});

// Atualizar status da etapa
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const etapa = await prisma.etapa.update({
      where: { id },
      data: { status },
      include: { aeronave: true },
    });

    res.json(etapa);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Erro ao atualizar etapa", details: error.message });
  }
});

// Handler 404 para debug
router.all("*", (req: Request, res: Response) => {
  console.log("❌ Rota não encontrada:", req.method, req.path);
  res
    .status(404)
    .json({ error: "Rota não encontrada", path: req.path, method: req.method });
});

export default router;
