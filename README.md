# Booking API

Sistema de agendamento (estilo consultório/clínica/salão) construído como projeto de estudo de backend profissional, com foco em conceitos que aparecem em vagas reais: arquitetura em camadas, concorrência, fuso horário, validação, segurança, documentação e deploy.

> **Sobre este projeto:** este é um projeto de aprendizado, construído por um desenvolvedor backend iniciante. Cada parte foi implementada junto com o entendimento do conceito por trás dela, das decisões técnicas envolvidas e dos trade-offs — o objetivo não foi só "fazer funcionar", foi entender **por que** cada peça existe e como ela apareceria numa empresa real.

## Índice

- [Objetivo](#objetivo)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Como rodar o projeto](#como-rodar-o-projeto)
- [Documentação da API](#documentação-da-api)
- [Endpoints](#endpoints)
- [Minha jornada de aprendizado](#minha-jornada-de-aprendizado)
- [Conceitos-chave aprendidos](#conceitos-chave-aprendidos)
- [Testes](#testes)
- [CI/CD e Deploy](#cicd-e-deploy)

## Objetivo

API REST para gerenciamento de agendamentos, cobrindo os desafios reais de um sistema de agenda:

- Listagem de profissionais, serviços e horários disponíveis
- Criação de reservas **sem conflito de horário**, mesmo sob concorrência real (dois clientes tentando o mesmo horário ao mesmo tempo)
- Manipulação correta de datas/horas com fuso horário (armazenamento em UTC, exibição no fuso do profissional)
- Regras de negócio de agenda: horário de funcionamento, feriados, cancelamento com prazo mínimo
- Validação de entrada e segurança básica de API
- Documentação interativa e pipeline de testes automáticos

## Tecnologias

- **Node.js** + **TypeScript** (modo `strict`)
- **Express** — escolhido de propósito no lugar de um framework opinativo (como NestJS), para aprender a montar arquitetura em camadas e injeção de dependência manualmente, sem "mágica" de decorators
- **PostgreSQL** + **Prisma ORM**
- **Docker / Docker Compose**
- **date-fns** / **date-fns-tz** — manipulação de datas e conversão de fuso horário
- **Zod** — validação de entrada
- **Jest** + **Supertest** — testes unitários, de integração e E2E
- **Helmet**, **cors**, **express-rate-limit** — segurança básica de API
- **Swagger/OpenAPI** — documentação interativa da API
- **GitHub Actions** — pipeline de integração contínua (CI)

## Arquitetura

O projeto segue **Clean Architecture** em camadas, aplicada manualmente (sem framework fazendo isso por trás):

```
Route → Controller → Service → Repository
```

- **Route** — só mapeia `método HTTP + path` para um handler. Sem lógica.
- **Controller** — traduz HTTP (`req`/`res`) para chamadas de método simples. Sem regra de negócio.
- **Service** — onde mora a regra de negócio. Não sabe que HTTP existe, não sabe que Prisma existe.
- **Repository** — só conversa com o banco. Implementa uma *interface*, nunca é chamado diretamente pelo Service.

A montagem de tudo acontece num único lugar, o **composition root** (`src/infra/http/container.ts`), que instancia cada peça na ordem certa e injeta as dependências via construtor — o mesmo princípio de Inversão de Dependência (o "D" do SOLID) que frameworks como NestJS fazem automaticamente com decorators.

```
src/
├── modules/
│   ├── professional/
│   ├── service/
│   ├── availability/
│   ├── blocked-date/
│   └── booking/
│       cada módulo: types → repository (interface) → prisma-repository (implementação)
│                    → service → controller → routes (com validação zod e documentação openapi)
├── scheduling/
│   └── orquestra availability + blocked-date + booking + service
│       para calcular horários disponíveis (não tem tabela própria)
├── shared/
│   ├── errors/        (hierarquia de erros de domínio: AppError, NotFoundError, ConflictError...)
│   └── middlewares/    (asyncHandler, error-handler, validate, rate-limit)
├── infra/
│   ├── database/       (Prisma Client como singleton)
│   └── http/            (app.ts, container.ts, server.ts, swagger.ts)
└── generated/prisma/client   (client do Prisma, com output customizado)
```

## Como rodar o projeto

Pré-requisitos: Node.js, Docker.

```bash
# 1. Instalar dependências
npm install

# 2. Subir o Postgres via Docker
docker compose up -d

# 3. Configurar variáveis de ambiente
cp .env.example .env
# edite o .env se necessário (porta do banco, etc.)

# 4. Rodar as migrations
npx prisma migrate dev

# 5. Gerar o Prisma Client
npx prisma generate

# 6. Subir o servidor em modo desenvolvimento
npm run dev
```

O servidor sobe em `http://localhost:3000`. Health check: `GET /health`.

### Rodando com Docker (build de produção)

```bash
docker build -t booking-api .
docker run -p 3000:3000 --env-file .env booking-api
```

Ou, com o compose de produção completo (API + Postgres):

```bash
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml exec api npx prisma migrate deploy
```

## Documentação da API

Com o servidor rodando, a documentação interativa (Swagger UI) fica disponível em:

```
http://localhost:3000/api-docs
```

Lá é possível ver todos os endpoints, os formatos de requisição/resposta esperados, todos os códigos de status que cada rota pode devolver, e testar chamadas reais direto do navegador.

## Endpoints

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/health` | Verifica se a API está no ar |
| `GET` | `/api-docs` | Documentação interativa (Swagger UI) |
| `POST` | `/professionals` | Cria um profissional |
| `GET` | `/professionals` | Lista profissionais |
| `GET` | `/professionals/:id` | Busca um profissional |
| `POST` | `/services` | Cria um serviço |
| `GET` | `/services?professionalId=` | Lista serviços de um profissional |
| `GET` | `/services/:id` | Busca um serviço |
| `POST` | `/availabilities` | Cadastra uma janela de disponibilidade recorrente |
| `GET` | `/availabilities?professionalId=&weekday=` | Lista disponibilidade |
| `POST` | `/blocked-dates` | Bloqueia um dia (feriado, folga) |
| `GET` | `/blocked-dates?professionalId=` | Lista dias bloqueados |
| `GET` | `/professionals/:id/available-slots?serviceId=&date=` | **Calcula os horários disponíveis** de um profissional numa data, combinando disponibilidade, bloqueios e reservas existentes |
| `POST` | `/bookings` | Cria uma reserva (com trava de concorrência e validação completa de regra de negócio) |
| `PATCH` | `/bookings/:id/cancel` | Cancela uma reserva (respeitando prazo mínimo de antecedência) |

## Minha jornada de aprendizado

Esse projeto foi construído em módulos progressivos, sempre entendendo o conceito e a decisão técnica antes de escrever qualquer código. Como iniciante em backend, o objetivo em cada etapa não era só "fazer o endpoint responder", era entender **por que** aquela era a forma certa de resolver o problema — e boa parte do aprendizado real veio justamente de depurar os próprios erros ao longo do caminho.

1. **Fundamentos e Setup** — Express, cadeia de middleware, TypeScript, Docker + Postgres, Prisma
2. **Arquitetura em Camadas** — Clean Architecture sem framework mágico, composition root manual, injeção de dependência via construtor
3. **Modelagem de Dados** — entidades do domínio, decisões de schema (UUID, `Decimal` para dinheiro, soft delete)
4. **Lógica de Disponibilidade (Slots)** — o algoritmo que calcula horários livres combinando disponibilidade, bloqueios e reservas existentes; isolado como função pura e testável
5. **Concorrência e Trava de Horários** — o coração do projeto: como impedir que dois clientes reservem o mesmo horário ao mesmo tempo, combinando verificação na aplicação com constraint única no banco dentro de uma transação
6. **Fuso Horário** — banco e lógica interna sempre em UTC; conversão de/para o fuso horário do profissional concentrada nas bordas do sistema
7. **Validações de Regra de Negócio** — toda escrita revalida o que a leitura já sugeria; regras de cancelamento com prazo mínimo
8. **Testes Automatizados** — pirâmide de testes (unitário → integração → E2E), incluindo um teste real de concorrência disparando requisições simultâneas contra o banco
9. **Segurança Backend** — validação de entrada centralizada com Zod, rate limiting, Helmet, CORS explícito, erros que não vazam detalhes internos em produção
10. **Documentação** — especificação OpenAPI documentando cada rota, cada formato de dado e cada código de status possível, servida de forma interativa
11. **Deploy e DevOps** — Dockerfile de produção multi-stage, Docker Compose de produção, pipeline de CI com GitHub Actions rodando os testes (incluindo o de concorrência) a cada push

## Conceitos-chave aprendidos

Alguns dos aprendizados mais importantes desse projeto, do tipo que aparece em entrevista técnica de backend:

- **TOCTOU (Time-Of-Check to Time-Of-Use):** verificar algo e agir sobre isso depois não é seguro sob concorrência — a única garantia real vem do banco de dados (constraint única + transação).
- **Nunca confiar em validação de uma chamada anterior:** o endpoint de leitura sugere horários livres, mas o de escrita revalida tudo de forma independente — nada garante que o cliente respeitou a sugestão antes de reservar.
- **UTC como fonte única de verdade:** todo instante de tempo é armazenado e comparado em UTC; conversão de fuso horário só acontece nas bordas do sistema.
- **Função pura vs. função com I/O:** lógica que pode ser isolada sem depender de banco/rede deve ser isolada — fica mais fácil de testar e de raciocinar sobre ela.
- **Interfaces desacoplam Service de implementação:** um Service nunca depende do Prisma diretamente, só de uma interface de Repository — isso permite trocar a implementação (ou usar um mock em teste) sem tocar em regra de negócio.
- **Build de produção é diferente de rodar em desenvolvimento:** imagem Docker enxuta (multi-stage), processo rodando com usuário sem privilégios, segredos vindos só de variável de ambiente.
- **CI existe para pegar erro antes de virar problema em produção:** todo push roda a suíte de testes completa contra um banco real, incluindo o teste de concorrência.

## Testes

```bash
npm test                      # roda toda a suíte
npx jest slot-generator       # só os testes do algoritmo de slots
npx jest booking-concurrency  # o teste de concorrência real (usa banco de teste)
```

O teste de concorrência dispara múltiplas requisições simultâneas pelo mesmo horário e confirma que **exatamente uma** é aceita — é a prova formal de que a trava de horários funciona de verdade, não só na teoria.

## CI/CD e Deploy

Todo push ou Pull Request contra a branch `main` dispara automaticamente, via GitHub Actions:

1. Subida de um banco Postgres efêmero para os testes
2. Geração do Prisma Client e aplicação das migrations
3. Checagem de tipos (`tsc --noEmit`)
4. Execução da suíte de testes completa (unitários, integração e o teste de concorrência)
5. Build de produção

Isso garante que nenhuma mudança quebrada chega na branch principal sem que o pipeline sinalize o problema primeiro.

O deploy é feito via imagem Docker (multi-stage, com usuário não-root) e `docker-compose.prod.yml`, com todas as credenciais vindas de variáveis de ambiente do servidor — nada de segredo commitado no repositório.

---

*Projeto construído como estudo prático de backend com Node.js, TypeScript, Express e Prisma, aplicando conceitos de arquitetura, concorrência, segurança e boas práticas usadas no mercado — por um desenvolvedor iniciante em backend, em processo de aprendizado contínuo.*
