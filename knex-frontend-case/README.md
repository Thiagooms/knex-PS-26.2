# 🌍 Desafio Desenvolvedor Frontend — WorldScope

## 📋 Objetivos

Este desafio avalia:

- A capacidade de construir uma **interface funcional**, **organizada** e **visualmente agradável**
- A habilidade de **consumir e filtrar dados** de uma **API externa** de forma **tipada e eficiente**
- Senso de **componentização**, **separação de responsabilidades** e **estrutura** de projeto
- Atenção à **experiência do usuário**, incluindo temas visuais, estados de loading e tratamento de erros
- **Clareza** ao explicar as decisões técnicas e visuais tomadas
- Domínio sobre **responsividade**, garantindo boa usabilidade tanto em **mobile** quanto em **desktop**

**Stack sugerida:** React ou Next.js com TypeScript — mas o candidato é livre para utilizar qualquer outro framework, desde que utilize uma linguagem tipada.

---

## 📖 História

A **WorldScope** é uma plataforma de consulta de informações geográficas que permite a qualquer pessoa explorar dados sobre países do mundo de forma rápida, visual e intuitiva.

O time de produto identificou que usuários frequentemente precisam comparar países, filtrar por região e entender rapidamente características como população, moeda e idiomas falados — mas as ferramentas existentes são poluídas visualmente e difíceis de usar.

Você foi contratado para construir a **primeira versão do frontend da WorldScope**, consumindo a API pública [RestCountries](https://restcountries.com).

---

## 🔑 Sobre a autenticação na API

Este desafio utiliza a versão **v5** da API RestCountries, que é a versão atual e estável da plataforma. Diferente de versões anteriores, a v5 **exige uma chave de acesso (API key)** para realizar qualquer requisição.

**É responsabilidade do candidato:**

- Criar sua própria conta gratuitamente em [restcountries.com](https://restcountries.com)
- Obter sua chave de acesso pessoal através do painel da plataforma
- Ler e compreender a [documentação oficial](https://restcountries.com/docs) para entender como autenticar as requisições e quais endpoints estão disponíveis
- Incluir no repositório um arquivo `.env.example` com o nome da variável (sem o valor), para que outros desenvolvedores saibam o que configurar

> **Plano gratuito:** 500 requisições por mês — mais do que suficiente para o desenvolvimento deste desafio. Gerencie bem suas chamadas durante o desenvolvimento, evitando requisições desnecessárias.

### O que será resolvido

- Uma interface limpa e eficiente para exploração de dados geográficos
- Experiência de uso agradável em qualquer preferência visual do usuário (tema claro, escuro ou do sistema)
- Base sólida de código para uma plataforma que pode crescer no futuro

### Foco do case

| Foco | Descrição |
|---|---|
| **Interface limpa** | Apresentação de uma interface limpa, interessante e responsiva |
| **Filtros e listagens** | Capacidade de filtrar e listar dados de forma organizada e intuitiva |
| **Consumo de API externa** | Consumo correto, seguindo a documentação oficial |
| **Organização de código** | Componentização e separação de responsabilidades na estrutura do projeto |

---

## 📦 Entregáveis

### ✅ Funcionalidades obrigatórias

#### Listagem de países
- Exibir todos os países em cards contendo: bandeira, nome, região, população e moeda principal
- Campo de busca para filtrar países pelo nome em tempo real
- Filtro por região (África, Américas, Ásia, Europa, Oceania)
- Ordenação por nome ou por população, crescente ou decrescente

#### Página de detalhes do país
- Ao clicar em um país, exibir uma página dedicada com: bandeira, nome oficial, capital, região, sub-região, população, área territorial, moedas, idiomas falados, fuso horário e países fronteiriços
- Os países fronteiriços devem ser clicáveis, levando diretamente à página de detalhes daquele país

#### Temas visuais
- Suporte obrigatório a três modos: **claro**, **escuro** e **sistema** (segue a preferência do dispositivo)
- A preferência escolhida deve **persistir entre sessões** (ao recarregar a página, o tema selecionado deve ser mantido)

#### Estrutura e qualidade de código
- Estrutura de pastas clara e organizada, com separação explícita entre componentes, páginas, serviços de API, tipos e utilitários
- Todos os dados retornados pela API devem ser **tipados**, sem uso indevido de `any`
- Consumo da API centralizado em uma camada de serviço/hooks dedicada, não espalhado pelos componentes
- Componentes com responsabilidades bem definidas, evitando componentes que fazem coisas demais

#### Estados da interface
- Interface responsiva, adaptada para dispositivos mobile e desktop
- Indicador visual de carregamento (loading) enquanto os dados são buscados
- Em caso de erro na API, exibir mensagem clara e amigável ao usuário (não apenas um `console.log`)
- Caso nenhum país seja encontrado nos filtros aplicados, exibir mensagem informativa

### 🌟 Entregáveis bônus *(não obrigatórios, mas valorizados)*

**Internacionalização (i18n)**
O idioma padrão da plataforma deve ser inglês, mas é um diferencial implementar suporte a pelo menos dois idiomas: inglês e português, com alternância pela interface. Para os nomes dos países, usar o campo `translations.por.common` da API quando o português estiver ativo. Os demais textos da interface devem ser traduzidos manualmente via biblioteca de i18n de escolha do candidato.

**Caching de dados**
Como a API de países raramente muda, é um diferencial implementar uma camada de cache para evitar requisições desnecessárias e acelerar o acesso às páginas. Livre escolha da solução: React Query, SWR, Redux com persistência, cache manual via `localStorage`, ou outra abordagem — desde que consciente e explicável (trade-offs incluídos).

### 📌 Outros entregáveis

- Repositório no GitHub com **README** explicando como rodar o projeto localmente
- No README, descrever brevemente as **decisões técnicas** tomadas: escolha de bibliotecas, estrutura de pastas e decisões de design relevantes
- Interface **responsiva**, funcionando bem em desktop e mobile
- Deploy da aplicação é **opcional**, porém muito valorizado (ex: [Vercel](https://vercel.com/), [Render](https://render.com/), [GitHub Pages](https://pages.github.com/))

---

## 📊 Critérios de Avaliação

| Critério | O que será observado |
|---|---|
| **Funcionalidade** | Todas as features obrigatórias funcionam conforme o esperado? Os filtros, a busca e a navegação entre páginas se comportam corretamente? |
| **Qualidade do código** | O código está tipado corretamente? Há uso indevido de `any`? A camada de serviço/hooks está bem separada dos componentes? |
| **Componentização** | Os componentes têm responsabilidades claras? O projeto está estruturado de forma que um novo desenvolvedor consiga se localizar facilmente? |
| **Temas visuais** | Os três modos de tema funcionam corretamente? A preferência persiste entre sessões? |
| **Experiência do usuário** | A interface lida bem com loading, erros e estados vazios? A navegação é intuitiva? |
| **Responsividade** | O layout se adapta corretamente a diferentes tamanhos de tela? |
| **README e explicação** | O candidato consegue explicar as escolhas que fez de forma clara e objetiva? |
| **Bônus — i18n** | A troca de idioma funciona? Os nomes dos países são traduzidos via API? Os demais textos foram traduzidos manualmente? |
| **Bônus — Caching** | A solução de cache foi implementada corretamente? O candidato consegue explicar a escolha e seus trade-offs? |
