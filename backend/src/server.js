const express = require('express');
const cors = require('cors');
require('dotenv').config();

const aeronaveRoutes = require('./routes/aeronaves');
const pecaRoutes = require('./routes/pecas');
const etapaRoutes = require('./routes/etapas');
const funcionarioRoutes = require('./routes/funcionarios');
const testeRoutes = require('./routes/testes');
const relatorioRoutes = require('./routes/relatorios');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/aeronaves', aeronaveRoutes);
app.use('/api/pecas', pecaRoutes);
app.use('/api/etapas', etapaRoutes);
app.use('/api/funcionarios', funcionarioRoutes);
app.use('/api/testes', testeRoutes);
app.use('/api/relatorios', relatorioRoutes);

// Rota raiz
app.get('/', (req, res) => {
  res.json({ message: 'API Aerocode - Sistema de Gerenciamento de Aeronaves' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
