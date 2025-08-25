# Node API

Uma API REST construída com Node.js, Fastify, TypeScript e Drizzle ORM para gerenciamento de cursos e usuários.

## Tecnologias

- **Node.js** - Runtime JavaScript
- **Fastify** - Framework web rápido e eficiente
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Drizzle ORM** - ORM type-safe para TypeScript
- **PostgreSQL** - Banco de dados relacional
- **Docker** - Containerização do banco de dados
- **Zod** - Validação de esquemas TypeScript

## Pré-requisitos

- Node.js (versão 18 ou superior)
- Docker e Docker Compose
- npm ou yarn

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/lucasfeva/node-api.git
cd node-api
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:

```bash
cp .env.example .env
```

4. Inicie o banco de dados PostgreSQL com Docker:

```bash
docker-compose up -d
```

5. Execute as migrações do banco:

```bash
npm run db:migrate
```

## Como executar

### Desenvolvimento

```bash
npm run dev
```

A API estará disponível em `http://localhost:3333`

### Scripts disponíveis

- `npm run dev` - Inicia o servidor em modo desenvolvimento
- `npm run db:generate` - Gera novas migrações do banco
- `npm run db:migrate` - Executa as migrações pendentes
- `npm run db:studio` - Abre o Drizzle Studio para visualizar o banco

## Documentação da API

A documentação interativa da API está disponível em:

- **Swagger UI**: `http://localhost:3333/docs`

### Endpoints disponíveis

#### Cursos

| Método | Endpoint       | Descrição             |
| ------ | -------------- | --------------------- |
| GET    | `/courses`     | Lista todos os cursos |
| GET    | `/courses/:id` | Busca um curso por ID |
| POST   | `/courses`     | Cria um novo curso    |

#### Exemplos de uso

**Criar um curso:**

```http
POST http://localhost:3333/courses
Content-Type: application/json

{
  "title": "Curso de Node.js"
}
```

**Listar cursos:**

```http
GET http://localhost:3333/courses
```

**Buscar curso por ID:**

```http
GET http://localhost:3333/courses/{course-id}
```

## Banco de Dados

O projeto utiliza PostgreSQL com as seguintes tabelas:

### Tabela `users`

- `id` (UUID) - Chave primária
- `name` (TEXT) - Nome do usuário
- `email` (TEXT) - Email único do usuário

### Tabela `courses`

- `id` (UUID) - Chave primária
- `title` (TEXT) - Título único do curso
- `description` (TEXT) - Descrição opcional do curso

## Docker

O banco de dados roda em container Docker. Para gerenciar:

```bash
# Iniciar o banco
docker-compose up -d

# Parar o banco
docker-compose down

# Ver logs do banco
docker-compose logs db
```

## Configuração

### Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
NODE_ENV=development
DATABASE_URL="postgres://postgres:postgres@localhost:5432/nodeapi"
```

### Estrutura do projeto

```
├── drizzle/                 # Migrações do banco
├── src/
│   ├── database/           # Configuração do banco
│   │   ├── client.ts      # Cliente Drizzle
│   │   └── schema.ts      # Esquemas das tabelas
│   └── routes/            # Rotas da API
│       └── courses/       # Endpoints de cursos
├── .env                   # Variáveis de ambiente
├── docker-compose.yml     # Configuração do Docker
├── drizzle.config.ts     # Configuração do Drizzle
└── server.ts             # Servidor principal
```

## Fluxo principal (Mermaid)

```mermaid
sequenceDiagram
  participant C as Client
  participant S as Fastify Server
  participant V as Zod Validator
  participant DB as Drizzle + PostgreSQL

  C->>S: POST /courses {title}
  S->>V: Validar body
  V-->>S: OK ou Erro 400
  alt válido
    S->>DB: INSERT INTO courses (title)
    DB-->>S: {id}
    S-->>C: 201 {courseId}
  else inválido
    S-->>C: 400
  end

  C->>S: GET /courses
  S->>DB: SELECT id,title FROM courses
  DB-->>S: lista
  S-->>C: 200 {courses: [...]}

  C->>S: GET /courses/:id
  S->>V: Validar param id (uuid)
  V-->>S: OK ou Erro 400
  alt encontrado
    S->>DB: SELECT * FROM courses WHERE id=...
    DB-->>S: course
    S-->>C: 200 {course}
  else não encontrado
    S-->>C: 404
  end
```

## Testando a API

Você pode usar o arquivo [`client.http`](client.http) incluído no projeto para testar os endpoints diretamente no VS Code com a extensão REST Client.
