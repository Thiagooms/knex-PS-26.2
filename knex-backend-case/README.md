# 🛒 Desafio do Processo Seletivo — Desenvolvedor Back-end

## KNEX Consultoria Jr.

## 📋 Objetivos

Este desafio avalia:

- A capacidade de estruturar uma **API REST** funcional e organizada
- O entendimento de **regras de negócio** e como traduzi-las em código
- **Clareza** na comunicação técnica — se o candidato consegue explicar o que construiu e por que tomou cada decisão
- **Boas práticas** básicas como organização de pastas, nomenclatura e tratamento de erros

**Stack sugerida:** Node.js com **Express** ou **NestJS** — mas o candidato é livre para usar o que preferir.

---

## 📖 História

A **TechMart** é uma loja virtual em fase inicial que precisa de um sistema simples para gerenciar seus produtos e vendas. A startup ainda não tem um sistema interno e os vendedores controlam tudo em planilhas, o que gera erros constantes de estoque e conflitos de venda.

Você foi contratado como o **primeiro desenvolvedor** da TechMart e sua missão é criar a primeira versão da API interna da loja, que permitirá que vendedores gerenciem o catálogo de produtos e que clientes possam visualizar e comprar itens disponíveis.

### O que será resolvido

- Controle de estoque com separação de responsabilidades entre usuários
- Simulação de um fluxo básico de compra
- Exibição de dados de produtos para possível construção de dashboard

### Foco do case

| Foco | Descrição |
|---|---|
| **Autenticação e autorização** | Cadastro, login e permissionamento correto das rotas |
| **CRUD de produtos** | CRUD básico para as movimentações básicas de produtos |
| **Lógica de pagamentos** | Simulação simples de compra/venda de um produto |
| **Apresentação coerente de dados** | Retorno coerente e organizado dos dados requisitados nas rotas |

---

## 🗂️ Entidades do Sistema

### Usuário

O sistema possui um único tipo de entidade para representar todas as pessoas que interagem com a plataforma, sejam compradores ou responsáveis pela loja.

- Identificador único
- Nome
- E-mail (usado para autenticação)
- Senha armazenada de forma segura (**nunca em texto puro**)
- Papel no sistema: `cliente` ou `vendedor` (únicas opções válidas)
- Data de cadastro

### Produto

Representa um item disponível na loja.

- Identificador único
- Nome
- Descrição
- Preço de venda
- Quantidade disponível em estoque (deve refletir em tempo real o quanto ainda pode ser comprado)
- Data de criação e de última modificação
- **Flag permanente indicando se o produto já foi vendido ao menos uma vez**, independente do estado atual do estoque — essa informação nunca deve ser alterada manualmente; é consequência de uma compra ter acontecido

### Pedido

Representa o momento em que um cliente realizou uma compra na loja.

- Identificador único
- Vinculado obrigatoriamente a um único cliente
- Valor total da compra **no momento em que ela foi realizada** (não deve ser recalculado dinamicamente com base nos preços atuais, pois preços mudam e o histórico financeiro precisa ser preservado)
- Data/hora exata em que o pedido foi feito

### Item do Pedido

Elo entre um pedido e os produtos que ele contém — é através dela que o sistema sabe exatamente o que foi comprado em cada transação.

- Identificador único
- Vinculado ao pedido ao qual pertence
- Vinculado ao produto que representa
- Quantidade daquele produto que foi comprada
- Preço unitário armazenado no momento da compra (mesma lógica de preservação de histórico do pedido)

---

## 📦 Entregáveis

### Regras de Negócio

**Usuários**
- Devem existir dois tipos de usuário: `cliente` e `vendedor`
- O sistema deve ter autenticação
- Um usuário não pode realizar ações fora do seu papel

**Produtos**
- Todo produto deve ter: nome, descrição, preço e quantidade em estoque
- Um produto só pode ser editado ou excluído pelo **vendedor**
- Um produto **não pode ser excluído** se já tiver sido vendido ao menos uma vez
- Produtos com estoque zero não podem ser comprados
- Se o produto informado nunca tiver sido vendido, retornar uma mensagem informativa clara ao invés de uma lista vazia sem contexto
- A rota `/seller/sales` deve retornar, para cada pedido: quais produtos foram comprados, a quantidade de cada um e o valor total
- A rota `/seller/sales/:product_id` deve retornar o histórico de vendas de um produto específico, com quantidade total já vendida e receita gerada por ele

**Compras**
- O cliente pode comprar um produto informando a quantidade desejada
- A cada compra, o estoque do produto deve ser decrementado corretamente
- O sistema deve registrar a compra com: produto, quantidade, valor total e data

### Rotas Esperadas

**Autenticação**

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/auth/register` | Cadastrar usuário (informando tipo: cliente ou vendedor) |
| `POST` | `/auth/login` | Login e retorno do token JWT |

**Produtos**

| Método | Rota | Descrição | Acesso |
|---|---|---|---|
| `GET` | `/products` | Listar todos os produtos | Cliente e vendedor |
| `GET` | `/products/:id` | Detalhar um produto | Cliente e vendedor |
| `POST` | `/products` | Criar produto | Somente vendedor |
| `PUT` | `/products/:id` | Editar produto | Somente vendedor |
| `DELETE` | `/products/:id` | Excluir produto (se não vendido) | Somente vendedor |

**Compras**

| Método | Rota | Descrição | Acesso |
|---|---|---|---|
| `POST` | `/orders` | Realizar uma compra | Somente cliente |
| `GET` | `/orders` | Listar compras do cliente autenticado | Cliente |

**Vendedor**

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/seller/sales` | Listar todos os pedidos realizados na loja |
| `GET` | `/seller/sales/:product_id` | Ver pedidos de um produto específico |

### 📌 Outros entregáveis

- Repositório no GitHub com **README** explicando como rodar o projeto localmente
- No README, descrever brevemente as **decisões técnicas** tomadas (por que escolheu a stack, como organizou o projeto, etc.)
- Instruções claras de como testar as rotas e o projeto
- Não é obrigatório banco de dados real — pode usar SQLite, JSON em arquivo ou banco em memória
- Não é necessária a entrega de conteinerização, mas é um diferencial para quem entregar

---

## 📊 Critérios de Avaliação

| Critério | O que será observado |
|---|---|
| **Funcionalidade** | As rotas funcionam conforme o esperado? As regras de negócio foram respeitadas? |
| **Organização do código** | O projeto está estruturado de forma legível? Há separação mínima de responsabilidades? |
| **Autenticação** | A autenticação foi implementada corretamente? As rotas protegidas realmente bloqueiam acessos indevidos? |
| **Tratamento de erros** | O sistema retorna mensagens de erro claras e códigos HTTP adequados? |
| **README e explicação** | O candidato consegue explicar o que fez de forma clara e objetiva? |
| **Boas práticas básicas** | Nomenclatura, consistência e ausência de código morto ou gambiarras evidentes |

---

## 📤 Envio

- Envie o desafio através do e-mail [org.knex@gmail.com](mailto:org.knex@gmail.com), com o assunto **"DESAFIO - DESENVOLVEDOR - KNEX CONSULTORIA"**
- **Obs.:** no e-mail, deve ser enviado o link do repositório do GitHub
- **Prazo:** até o dia 22/07 às 18h

> Qualquer alteração nestas instruções será divulgada pelos canais oficiais do Processo Seletivo da KNEX Consultoria Jr.

**🍀 Boa sorte! Estamos ansiosos para conhecer sua capacidade de organização, análise financeira e visão estratégica!**
