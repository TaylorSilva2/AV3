# 🛩️ Aerocode - Sistema de Gerenciamento de Aeronaves

Sistema completo desenvolvido em **TypeScript** para gerenciamento de produção de aeronaves, implementado como uma Single Page Application (SPA) com React no frontend e API REST com Express e Prisma no backend, utilizando MySQL como banco de dados.

## 🏗️ Arquitetura do Projeto

```
AV3/
├── backend/          # API REST com Express, Prisma e TypeScript
│   ├── prisma/       # Schema e migrações do banco de dados
│   ├── src/          # Código fonte TypeScript
│   │   ├── routes/   # Rotas da API
│   │   ├── prisma.ts # Cliente Prisma
│   │   └── server.ts # Servidor Express
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/         # SPA React com TypeScript
    ├── public/       # Arquivos estáticos
    ├── src/          # Código fonte TypeScript
    │   ├── components/   # Componentes React
    │   ├── services/     # Serviços de API
    │   ├── types/        # Tipos TypeScript
    │   ├── App.tsx       # Componente principal
    │   └── index.tsx     # Entry point
    ├── package.json
    └── tsconfig.json
```

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

## 🎯 Funcionalidades Implementadas

### Backend (API REST)

- **Aeronaves**
  - ✅ Listar todas as aeronaves
  - ✅ Buscar aeronave por ID
  - ✅ Criar nova aeronave
  - ✅ Atualizar aeronave
  - ✅ Deletar aeronave

- **Peças**
  - ✅ Listar todas as peças
  - ✅ Criar nova peça
  - ✅ Atualizar status da peça
  - ✅ Deletar peça

- **Etapas**
  - ✅ Listar todas as etapas
  - ✅ Criar nova etapa
  - ✅ Atualizar status da etapa

- **Funcionários**
  - ✅ Listar todos os funcionários
  - ✅ Criar novo funcionário

- **Testes**
  - ✅ Listar todos os testes
  - ✅ Criar novo teste
  - ✅ Atualizar resultado do teste

- **Relatórios**
  - ✅ Listar todos os relatórios
  - ✅ Criar novo relatório

### Frontend (React SPA)

- ✅ Interface moderna e responsiva
- ✅ Cadastro de aeronaves
- ✅ Listagem de aeronaves
- ✅ Edição de aeronaves
- ✅ Exclusão de aeronaves
- ✅ Validação de formulários
- ✅ Feedback visual (mensagens de sucesso/erro)

## 📊 Modelo de Dados (Prisma Schema)

O sistema implementa o diagrama UML fornecido com as seguintes entidades:

- **Aeronave** (codigo, modelo, tipo, alcance)
- **Peca** (nome, grau, fornecedor, status)
- **Etapa** (nome, grau, status)
- **Funcionario** (idFunc, nome, cpf, endereco, usuario, senha, nivelPermissao)
- **Teste** (tipo, resultado)
- **Relatorio** (conteudo)

Com enums para:
- TipoAeronave: COMERCIAL, MILITAR
- StatusPeca: EM_PRODUCAO, EM_TRANSPORTE, PRONTA
- StatusEtapa: PENDENTE, ANDAMENTO, CONCLUIDA
- TipoTeste: ELETRICO, HIDRAULICO, AERODINAMICO
- ResultadoTeste: APROVADO, REPROVADO
- NivelPermissao: ADMINISTRADOR, ENGENHEIRO, OPERADOR

## 🔌 Endpoints da API

### Aeronaves
- `GET /api/aeronaves` - Listar todas
- `GET /api/aeronaves/:id` - Buscar por ID
- `POST /api/aeronaves` - Criar nova
- `PUT /api/aeronaves/:id` - Atualizar
- `DELETE /api/aeronaves/:id` - Deletar

### Peças
- `GET /api/pecas` - Listar todas
- `POST /api/pecas` - Criar nova
- `PUT /api/pecas/:id` - Atualizar
- `DELETE /api/pecas/:id` - Deletar

### Etapas
- `GET /api/etapas` - Listar todas
- `POST /api/etapas` - Criar nova
- `PUT /api/etapas/:id` - Atualizar

### Funcionários
- `GET /api/funcionarios` - Listar todos
- `POST /api/funcionarios` - Criar novo

### Testes
- `GET /api/testes` - Listar todos
- `POST /api/testes` - Criar novo
- `PUT /api/testes/:id` - Atualizar resultado

### Relatórios
- `GET /api/relatorios` - Listar todos
- `POST /api/relatorios` - Criar novo

## 🛠️ Tecnologias Utilizadas

### Backend
- **TypeScript** - Linguagem principal
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Prisma** - ORM para banco de dados
- **MySQL** - Banco de dados relacional
- **CORS** - Middleware para cross-origin requests
- **dotenv** - Gerenciamento de variáveis de ambiente

### Frontend
- **TypeScript** - Linguagem principal
- **React** - Biblioteca para UI
- **Axios** - Cliente HTTP
- **CSS3** - Estilização

## 📝 Scripts Disponíveis

### Backend
```powershell
npm run dev          # Inicia servidor em modo desenvolvimento
npm run build        # Compila TypeScript para JavaScript
npm start            # Inicia servidor em produção
npm run prisma:migrate   # Executa migrações do banco
npm run prisma:generate  # Gera Prisma Client
npm run prisma:studio    # Abre Prisma Studio (interface visual)
```

### Frontend
```powershell
npm start    # Inicia app em modo desenvolvimento
npm run build    # Cria build de produção
npm test     # Executa testes
```

## 🎨 Interface do Usuário

A interface foi desenvolvida com foco em:
- **Usabilidade**: Formulários intuitivos e clara
- **Responsividade**: Adapta-se a diferentes tamanhos de tela
- **Feedback visual**: Mensagens claras de sucesso e erro
- **Design moderno**: Gradientes e sombras suaves

## 🔐 Segurança

⚠️ **Nota**: Este é um projeto educacional. Para uso em produção, implemente:
- Autenticação JWT
- Hash de senhas (bcrypt)
- Validação de entrada robusta
- Rate limiting
- HTTPS

## 📚 Próximos Passos

Para expandir o projeto, considere implementar:
- [ ] Sistema de autenticação completo
- [ ] Interface para gerenciar peças, etapas e testes
- [ ] Dashboard com gráficos e estatísticas
- [ ] Geração de relatórios em PDF
- [ ] Histórico de alterações
- [ ] Sistema de notificações

## 👨‍💻 Desenvolvimento

Este projeto foi desenvolvido como parte da disciplina de **Programação Orientada a Objetos** no curso de **Análise e Desenvolvimento de Sistemas**.

## 📄 Licença

Este projeto é de código aberto e está disponível para fins educacionais.
