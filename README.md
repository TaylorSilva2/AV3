# 🛩️ Aerocode - Sistema de Gerenciamento de Aeronaves

Sistema completo desenvolvido em **TypeScript** para gerenciamento de produção de aeronaves, implementado como uma Single Page Application (SPA) com React no frontend e API REST com Express e Prisma no backend, utilizando MySQL como banco de dados.



## 📋 Pré-requisitos

- **Node.js** (v18 ou superior)
- **MySQL** (v8 ou superior)
- **npm** ou **yarn**

## 🚀 Instalação e Configuração

### Opção 1: Iniciar Backend e Frontend Juntos (Recomendado)

```powershell
# Na pasta raiz do projeto (AV3/)

# 1. Instalar dependências de ambos os projetos
npm install
npm run install:all

# 2. Configurar variáveis de ambiente
# Edite o arquivo backend/.env e configure suas credenciais do MySQL
# DATABASE_URL="mysql://usuario:senha@localhost:3306/aerocode"

# 3. Configurar o banco de dados
cd backend
npm run prisma:generate
npm run prisma:migrate
cd ..

# 4. Iniciar backend e frontend simultaneamente
npm start
```

O backend estará em `http://localhost:3001` e o frontend em `http://localhost:3000`

---

### Opção 2: Iniciar Backend e Frontend Separadamente

#### 1. Configurar o Banco de Dados MySQL

Crie um banco de dados MySQL:

```sql
CREATE DATABASE aerocode;
```

#### 2. Configurar o Backend

```powershell
# Navegar até a pasta do backend
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
# Edite o arquivo .env e configure suas credenciais do MySQL
# DATABASE_URL="mysql://usuario:senha@localhost:3306/aerocode"

# Gerar o Prisma Client
npm run prisma:generate

# Executar as migrações do banco de dados
npm run prisma:migrate

# Iniciar o servidor em modo desenvolvimento
npm run dev
```

O servidor backend estará rodando em `http://localhost:3001`

#### 3. Configurar o Frontend

Abra um **novo terminal** e execute:

```powershell
# Navegar até a pasta do frontend
cd frontend

# Instalar dependências
npm install

# Iniciar a aplicação React
npm start
```

A aplicação frontend estará rodando em `http://localhost:3000`

