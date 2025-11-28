import { Router, Request, Response } from 'express';
import prisma from '../prisma';

const router = Router();

// Listar todos os testes
router.get('/', async (req: Request, res: Response) => {
  try {
    const testes = await prisma.teste.findMany({
      include: {
        aeronave: true,
        funcionario: {
          select: {
            id: true,
            nome: true,
            nivelPermissao: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(testes);
  } catch (error: any) {
    res.status(500).json({ error: 'Erro ao buscar testes', details: error.message });
  }
});

// Criar novo teste
router.post('/', async (req: Request, res: Response) => {
  try {
    const { tipo, resultado, aeronaveId, funcionarioId } = req.body;
    
    if (!tipo || !aeronaveId || !funcionarioId) {
      return res.status(400).json({ 
        error: 'Campos obrigatórios: tipo, aeronaveId, funcionarioId' 
      });
    }
    
    const teste = await prisma.teste.create({
      data: { tipo, resultado, aeronaveId, funcionarioId },
      include: {
        aeronave: true,
        funcionario: {
          select: { id: true, nome: true, nivelPermissao: true }
        }
      }
    });
    
    res.status(201).json(teste);
  } catch (error: any) {
    res.status(500).json({ error: 'Erro ao criar teste', details: error.message });
  }
});

// Atualizar resultado do teste
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { resultado } = req.body;
    
    const teste = await prisma.teste.update({
      where: { id },
      data: { resultado },
      include: {
        aeronave: true,
        funcionario: {
          select: { id: true, nome: true }
        }
      }
    });
    
    res.json(teste);
  } catch (error: any) {
    res.status(500).json({ error: 'Erro ao atualizar teste', details: error.message });
  }
});

export default router;
