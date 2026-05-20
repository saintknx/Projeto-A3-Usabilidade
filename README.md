# PokéBrasil — Pokédex Geográfica Interativa

> Explore os biomas brasileiros e descubra quais Pokémons habitam cada região do país.

---

## Integrantes

Kauã dos Santos Alves Sousa - 824149388 

Diogo Tayjen Dagnino - 823130326

Pietro Gregorio Cordeiro - 822164917

Ricardo Gonçalves Lima - 824145766

Laryssa Moreira Stepanov - 824128219

Erick Souza Bernardes - 814128618

Guilherme Cesar de Brito - 8222247316

---

## Tema e Objetivo

O **PokéBrasil** é uma Pokédex com identidade geográfica brasileira: cada região definida é mapeado a um habitat da PokéAPI com seus respectivos Pokémons, permitindo ao usuário explorar o território nacional e descobrir Pokémons de forma interativa.

O objetivo é unir cultura brasileira e universo Pokémon em uma experiência visual e educativa, navegando por um mapa real do Brasil.

---

## APIs Utilizadas

### PokéAPI

API REST pública e gratuita com dados completos do universo Pokémon.

- Link: [https://pokeapi.co](https://pokeapi.co)
- Documentação: [https://pokeapi.co/docs/v2](https://pokeapi.co/docs/v2)
- Sem necessidade de autenticação / API key

---

## Endpoints Principais

### PokéAPI

`GET /api/v2/pokemon-habitat/` - Lista todos os habitats disponíveis

`GET /api/v2/pokemon-habitat/{habitat}` - Retorna todos os Pokémons de um habitat (ex: `forest`, `grassland`)

`GET /api/v2/pokemon/{id}` - Dados do Pokémon: tipos, stats, sprites, habilidades

`GET /api/v2/pokemon-species/{id}` - Dados da espécie: descrição em PT-BR, lendário, habitat


---

## Escopo

### Telas / Rotas

`/`: **MapPage** - Mapa interativo do Brasil colorido por bioma. Pokémons aparecem como marcadores clicáveis. Sidebar com preview do Pokémon selecionado.

`/bioma/:habitat`: **BiomaPage** - Grid com todos os Pokémons do habitat clicado no mapa.

`/pokemon/:id`: **PokemonPage** - Página completa do Pokémon: sprite animado, tipos, stats, habilidades, descrição e habitat.

### Funcionalidades Principais

- **Mapa interativo** do Brasil com estados coloridos por região definida
- **Marcadores de Pokémon** no mapa, gerados dinamicamente via PokéAPI
- **Filtro por bioma** na sidebar do mapa
- **Sorteio de novos Pokémons** no mapa (ícone de atualizar)
- **Preview rápido** do Pokémon selecionado na sidebar (sem sair do mapa)
- **Página de detalhes** completa com stats e habilidades
- **Acessibilidade**: navegação por teclado, ARIA labels, alt em imagens

---

## Setup do Projeto

### Stack

- **React 18** + **Vite**
- **React Router DOM v7** (roteamento SPA)
- **React Simple Maps** (mapa SVG do Brasil)

### Estrutura de Pastas

```
pokebrasil/
├── public/
│   └── pokebola.svg
├── src/
│   ├── components/
│   │   ├── ErrorMessage/
│   │   ├── LoadingSpinner/
│   │   ├── PokemonCard/
│   │   ├── StatBar/
│   │   └── TypeBadge/
│   ├── data/
│   │   ├── biomas.js
│   │   └── markers.js
│   ├── hooks/
│   │   ├── useHabitatPokemon.js
│   │   ├── useMapMarkers.js
│   │   ├── usePokemon.js
│   │   └── usePokemonSpecies.js
│   ├── pages/
│   │   ├── BiomaPage/
│   │   ├── MapPage/
│   │   └── PokemonPage/
│   ├── utils/
│   │   ├── sprites.js
│   │   └── typeColors.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
└── vite.config.js
```
---

## Heurísticas

### 5 Heurísticas de Nielsen priorizadas

1. **Visibilidade do status do sistema** — Spinners e mensagens de loading nas chamadas à API.
2. **Controle e liberdade do usuário** — Botão "Voltar ao mapa" em todas as páginas internas; botão de reset do zoom; possibilidade de desfazer filtro de bioma clicando novamente.
3. **Consistência e padrões** — TypeBadges com cores fixas por tipo, mesma paleta de biomas em todo o projeto (mapa, legenda, filtros, cards).
4. **Reconhecimento em vez de lembrança** — Legenda de biomas sempre visível no mapa; tooltip com nome do estado e bioma ao passar o mouse; ícones/emojis junto aos rótulos de bioma.
5. **Estética e design minimalista — interface limpa com apenas informações relevantes por tela.

### 5 Itens de Acessibilidade (WCAG / POUR)

1. **Alternativas em texto para imagens** (`alt` descritivo em todos os sprites e artes oficiais dos Pokémons).
2. **Navegação por teclado** — todos os elementos interativos do mapa serão navegáveis pelo teclado
3. **ARIA Labels** — `aria-label` em botões, regiões (`role="region"`) e navegação (`aria-label` nas `<nav>`); `aria-live="polite"` no contador de Pokémons e tooltip do mapa.
4. **Hierarquia de headings** — cada tela usa um único `<h1>` semântico, `<h2>` para nomes de Pokémon e `<h3>` para seções internas (ex: "Estatísticas base").
5. **Feedback de estado** — `aria-pressed` nos botões de filtro de bioma para indicar seleção; `role="status"` no contador; `disabled` no botão de refresh durante o loading.

---
```
