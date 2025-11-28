import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

import aeronaveRoutes from "./routes/aeronaves";
import pecaRoutes from "./routes/pecas";
import etapaRoutes from "./routes/etapas";
import funcionarioRoutes from "./routes/funcionarios";
import testeRoutes from "./routes/testes";
import relatorioRoutes from "./routes/relatorios";
import authRoutes from "./routes/auth";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Middleware de log para debug
app.use((req: Request, res: Response, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

// Rotas
app.use("/api/auth", authRoutes);
app.use("/api/aeronaves", aeronaveRoutes);
app.use("/api/pecas", pecaRoutes);
app.use("/api/etapas", etapaRoutes);
app.use("/api/funcionarios", funcionarioRoutes);
app.use("/api/testes", testeRoutes);
app.use("/api/relatorios", relatorioRoutes);

// Rota raiz
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "API Aerocode - Sistema de Gerenciamento de Aeronaves" });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
