import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// Login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { usuario, senha } = req.body;

    if (!usuario || !senha) {
      return res
        .status(400)
        .json({ error: "Usuário e senha são obrigatórios" });
    }

    const funcionario = await prisma.funcionario.findUnique({
      where: { usuario },
    });

    if (!funcionario) {
      return res.status(401).json({ error: "Usuário ou senha inválidos" });
    }

    // Comparação simples de senha (em produção, use bcrypt)
    if (funcionario.senha !== senha) {
      return res.status(401).json({ error: "Usuário ou senha inválidos" });
    }

    // Retorna os dados do funcionário (exceto a senha)
    const { senha: _, ...funcionarioSemSenha } = funcionario;

    res.json({
      success: true,
      funcionario: funcionarioSemSenha,
    });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ error: "Erro ao fazer login" });
  }
});

// Registro de novo funcionário
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { nome, cpf, endereco, usuario, senha, nivelPermissao } = req.body;

    if (!nome || !cpf || !endereco || !usuario || !senha) {
      return res
        .status(400)
        .json({ error: "Todos os campos são obrigatórios" });
    }

    // Verifica se o usuário já existe
    const usuarioExistente = await prisma.funcionario.findUnique({
      where: { usuario },
    });

    if (usuarioExistente) {
      return res.status(409).json({ error: "Usuário já existe" });
    }

    // Verifica se o CPF já existe
    const cpfExistente = await prisma.funcionario.findUnique({
      where: { cpf },
    });

    if (cpfExistente) {
      return res.status(409).json({ error: "CPF já cadastrado" });
    }

    // Cria o novo funcionário (em produção, use bcrypt para hash da senha)
    const novoFuncionario = await prisma.funcionario.create({
      data: {
        nome,
        cpf,
        endereco,
        usuario,
        senha, // Em produção: await bcrypt.hash(senha, 10)
        nivelPermissao: nivelPermissao || "OPERADOR",
      },
    });

    const { senha: _, ...funcionarioSemSenha } = novoFuncionario;

    res.status(201).json({
      success: true,
      funcionario: funcionarioSemSenha,
    });
  } catch (error) {
    console.error("Erro no registro:", error);
    res.status(500).json({ error: "Erro ao registrar funcionário" });
  }
});

// Verifica se o usuário está autenticado (opcional)
router.get("/me", async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    const funcionario = await prisma.funcionario.findUnique({
      where: { id: Number(userId) },
    });

    if (!funcionario) {
      return res.status(404).json({ error: "Funcionário não encontrado" });
    }

    const { senha: _, ...funcionarioSemSenha } = funcionario;
    res.json(funcionarioSemSenha);
  } catch (error) {
    console.error("Erro ao buscar funcionário:", error);
    res.status(500).json({ error: "Erro ao buscar funcionário" });
  }
});

export default router;
