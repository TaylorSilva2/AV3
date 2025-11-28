import { Router, Request, Response } from 'express';
import prisma from '../prisma';

const router = Router();

// Listar todos os relatórios
router.get('/', async (req: Request, res: Response) => {
  try {
    const relatorios = await prisma.relatorio.findMany({
      include: { aeronave: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(relatorios);
  } catch (error: any) {
    res.status(500).json({ error: 'Erro ao buscar relatórios', details: error.message });
  }
});

// Criar novo relatório
router.post('/', async (req: Request, res: Response) => {
  try {
    const { aeronaveId, conteudo } = req.body;
    
    if (!aeronaveId || !conteudo) {
      return res.status(400).json({ error: 'Campos obrigatórios: aeronaveId, conteudo' });
    }
    
    const relatorio = await prisma.relatorio.create({
      data: { aeronaveId, conteudo },
      include: { aeronave: true }
    });
    
    res.status(201).json(relatorio);
  } catch (error: any) {
    res.status(500).json({ error: 'Erro ao criar relatório', details: error.message });
  }
});

export default router;
