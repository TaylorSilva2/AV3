import { Router, Request, Response } from "express";
import prisma from "../prisma";

const router = Router();

// Listar todas as peças
router.get("/", async (req: Request, res: Response) => {
  try {
    const pecas = await prisma.peca.findMany({
      include: { aeronave: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(pecas);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Erro ao buscar peças", details: error.message });
  }
});

// Criar nova peça
router.post("/", async (req: Request, res: Response) => {
  try {
    const { nome, tipo, fornecedor, status, aeronaveId } = req.body;

    if (!nome || !tipo || !fornecedor || !aeronaveId) {
      return res
        .status(400)
        .json({
          error: "Campos obrigatórios: nome, tipo, fornecedor, aeronaveId",
        });
    }

    const peca = await prisma.peca.create({
      data: { nome, tipo, fornecedor, status, aeronaveId },
      include: { aeronave: true },
    });

    res.status(201).json(peca);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Erro ao criar peça", details: error.message });
  }
});

// Atualizar status da peça
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const peca = await prisma.peca.update({
      where: { id },
      data: { status },
      include: { aeronave: true },
    });

    res.json(peca);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Erro ao atualizar peça", details: error.message });
  }
});

// Deletar peça
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await prisma.peca.delete({ where: { id: req.params.id } });
    res.json({ message: "Peça deletada com sucesso" });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Erro ao deletar peça", details: error.message });
  }
});

export default router;
