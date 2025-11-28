const express = require('express');
const router = express.Router();
const prisma = require('../prisma');

// Listar todos os relatórios
router.get('/', async (req, res) => {
  try {
    const relatorios = await prisma.relatorio.findMany({
      include: { aeronave: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(relatorios);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar relatórios', details: error.message });
  }
});

// Criar novo relatório
router.post('/', async (req, res) => {
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
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar relatório', details: error.message });
  }
});

module.exports = router;
