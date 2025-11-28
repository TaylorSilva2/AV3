import { Router, Request, Response } from "express";
import prisma from "../prisma";

const router = Router();

// Listar todos os funcionários
router.get("/", async (req: Request, res: Response) => {
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
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Erro ao buscar funcionários", details: error.message });
  }
});

// Criar novo funcionário
router.post("/", async (req: Request, res: Response) => {
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
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(400).json({ error: "Usuário ou CPF já existe" });
    }
    res
      .status(500)
      .json({ error: "Erro ao criar funcionário", details: error.message });
  }
});

export default router;
