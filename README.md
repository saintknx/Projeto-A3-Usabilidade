# PokéBrasil — Pokédex Geográfica Interativa

> Explore lugares e descubra quais Pokémons habitariam cada região do país.

---

## Integrantes

| Nome                        | RA         |
| --------------------------- | ---------- |
| Kauã dos Santos Alves Sousa | 824149388  |
| Diogo Tayjen Dagnino        | 823130326  |
| Pietro Gregorio Cordeiro    | 822164917  |
| Ricardo Gonçalves Lima      | 824145766  |
| Laryssa Moreira Stepanov    | 824128219  |
| Erick Souza Bernardes       | 814128618  |
| Guilherme Cesar de Brito    | 8222247316 |

---

## Tema e Objetivo

O **PokéBrasil** é uma Pokédex com identidade geográfica: cada região brasileira é mapeada a um habitat da PokéAPI, permitindo ao usuário explorar o território nacional e descobrir Pokémons de forma interativa.

O objetivo é unir cultura brasileira e universo Pokémon em uma experiência visual e educativa, navegando por um mapa real do Brasil.

---

## Como executar o projeto localmente

### Pré-requisitos

- **Node.js** v18 ou superior — [nodejs.org](https://nodejs.org)
- **npm** v9 ou superior (já incluído com o Node.js)

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/saintknx/Projeto-A3-Usabilidade.git

# 2. Entre na pasta do projeto
cd Projeto-A3-Usabilidade

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

Após rodar `npm run dev`, acesse no navegador:

```
http://localhost:5173
```

> Não é necessária nenhuma chave de API (API key). O projeto consome a PokéAPI e a MyMemory API de forma pública e gratuita, sem autenticação.

---

## Tecnologias e Bibliotecas

| Tecnologia        | Versão | Uso                                           |
| ----------------- | ------ | --------------------------------------------- |
| React             | 18     | Biblioteca principal de UI                    |
| Vite              | 8      | Bundler e servidor de desenvolvimento         |
| React Router DOM  | 7      | Roteamento SPA (navegação entre páginas)      |
| React Simple Maps | 3      | Renderização do mapa SVG interativo do Brasil |
| ESLint            | 9      | Linting e qualidade de código                 |

---

## APIs Utilizadas

### 1. PokéAPI

API REST pública e gratuita com dados completos do universo Pokémon.

- [https://pokeapi.co](https://pokeapi.co)
- [Documentação](https://pokeapi.co/docs/v2)
- Sem necessidade de autenticação

### 2. MyMemory Translation API

API de tradução automática usada como fallback quando a descrição do Pokémon não está disponível em PT-BR na PokéAPI.

- [https://mymemory.translated.net](https://mymemory.translated.net)
- Sem necessidade de autenticação para uso básico
- Traduz descrições de `en` → `pt-br` automaticamente

---

## Endpoints Utilizados

### PokéAPI

| Endpoint                           | Usado em                             | O que retorna                         |
| ---------------------------------- | ------------------------------------ | ------------------------------------- |
| `GET /api/v2/pokemon/{id}`         | `usePokemon`                         | Tipos, stats, sprites e habilidades   |
| `GET /api/v2/pokemon-species/{id}` | `usePokemonSpecies`                  | Descrição em PT-BR, lendário, habitat |
| `GET /api/v2/pokemon-habitat/{id}` | `useHabitatPokemon`, `useMapMarkers` | Lista de Pokémons de um habitat       |

### MyMemory

| Endpoint                                | Usado em            | O que retorna              |
| --------------------------------------- | ------------------- | -------------------------- |
| `GET /get?q={texto}&langpair=en\|pt-br` | `usePokemonSpecies` | Texto traduzido para PT-BR |

---

## Como o consumo de API funciona

O projeto consome as APIs **diretamente pelo frontend**, usando a Fetch API nativa do JavaScript, organizada em hooks customizados do React:

```
PokéAPI / MyMemory
      │
      ▼
  hooks/
  ├── usePokemon.js          → busca dados do Pokémon (tipos, stats, sprites)
  ├── usePokemonSpecies.js   → busca descrição em PT-BR (com fallback MyMemory)
  ├── useHabitatPokemon.js   → busca todos os Pokémons de um bioma
  └── useMapMarkers.js       → sorteia marcadores reais para o mapa
      │
      ▼
  pages/
  ├── MapPage     → usa useMapMarkers
  ├── BiomaPage   → usa useHabitatPokemon
  └── PokemonPage → usa usePokemon + usePokemonSpecies
```

### Fluxo de tradução

1. `usePokemonSpecies` busca a descrição do Pokémon na PokéAPI
2. Se encontrar em `pt-br` → usa diretamente
3. Se não encontrar → pega a versão em inglês e envia para a MyMemory API traduzir
4. Se a tradução falhar → exibe o texto em inglês como fallback

Todos os hooks retornam `{ data, loading, error }` e tratam os 4 estados: **carregando**, **sucesso**, **vazio** e **erro**.

---

## Estrutura de Pastas

```
src/
├── components/
│   ├── ErrorMessage/     # Exibe erros com botão de retry
│   ├── LoadingSpinner/   # Feedback visual de carregamento
│   ├── PokemonCard/      # Card clicável de Pokémon
│   ├── StatBar/          # Barra animada de estatísticas
│   └── TypeBadge/        # Badge colorido por tipo
├── data/
│   ├── biomas.js         # Mapeamento estados → biomas → habitats
│   └── markers.js        # Coordenadas e geração de marcadores no mapa
├── hooks/
│   ├── useHabitatPokemon.js
│   ├── useMapMarkers.js
│   ├── usePokemon.js
│   └── usePokemonSpecies.js
├── pages/
│   ├── MapPage/          # Rota: /
│   ├── BiomaPage/        # Rota: /bioma/:habitat
│   └── PokemonPage/      # Rota: /pokemon/:id
├── utils/
│   ├── sprites.js        # URLs dos sprites oficiais
│   └── typeColors.js     # Cores por tipo de Pokémon
├── App.jsx               # Configuração de rotas
├── main.jsx              # Entry point
└── index.css             # Estilos globais e variáveis CSS
```

---

## Telas e Rotas

| Rota              | Tela            | Descrição                                                                                                                              |
| ----------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `/`               | **MapPage**     | Mapa interativo do Brasil colorido por bioma. Pokémons aparecem como marcadores clicáveis. Sidebar com preview do Pokémon selecionado. |
| `/bioma/:habitat` | **BiomaPage**   | Grid com todos os Pokémons do habitat selecionado.                                                                                     |
| `/pokemon/:id`    | **PokemonPage** | Página completa: sprite animado, tipos, stats, habilidades, descrição em PT-BR e habitat.                                              |

---

## Usabilidade e Acessibilidade

### Heurísticas de Nielsen aplicadas

1. **Visibilidade do status do sistema** — Spinners e mensagens de loading em todas as chamadas à API.
2. **Relação com o mundo real** — Biomas com nomes reais (Amazônia, Cerrado, Caatinga...), descrições em PT-BR, cores associadas à natureza.
3. **Controle e liberdade do usuário** — Botão "Voltar" em todas as páginas internas, reset de zoom, filtro de bioma reversível.
4. **Consistência e padrões** — Mesma paleta de cores e TypeBadges reutilizados em todas as telas.
5. **Prevenção de erros** — Fallback de imagem (`onError`), tratamento de habitats desconhecidos.
6. **Reconhecimento em vez de lembrança** — Legenda de biomas sempre visível no mapa, tooltip com nome do estado ao passar o mouse.
7. **Flexibilidade e eficiência de uso** — Filtro por região, zoom no mapa, sorteio de novos Pokémons.
8. **Estética e design minimalista** — Interface limpa com apenas informações relevantes por tela.
9. **Ajuda para reconhecer e recuperar erros** — Componente `ErrorMessage` com mensagem clara e botão de retry.

### Acessibilidade (WCAG / POUR)

1. **Alternativas em texto** — `alt` descritivo em todos os sprites e artes oficiais.
2. **Navegação por teclado** — `tabIndex={0}`, `role="button"` e `onKeyDown` em todos os elementos interativos do mapa.
3. **ARIA Labels** — `aria-label` em botões e regiões; `aria-live="polite"` no contador de Pokémons.
4. **Hierarquia de headings** — `<h1>` único por tela, `<h2>` para nomes, `<h3>` para seções internas.
5. **Feedback de estado** — `aria-pressed` nos filtros de bioma, `role="status"` no contador, `disabled` no botão de refresh durante loading.

---
