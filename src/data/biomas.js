/**
 * data/biomas.js
 * Mapeamento oficial de Estados -> Biomas e Habitats da PokéAPI.
 * Coordenadas reais [Longitude, Latitude] ajustadas para o centro de cada estado,
 * garantindo o posicionamento correto no ComposableMap (geoMercator).
 */

export const HABITAT_LABELS_PT = {
  forest: "Amazônia / Mata Atlântica",
  grassland: "Pampa / Cerrado / Caatinga",
  mountain: "Zonas Montanhosas / Planalto",
  "rough-terrain": "Pantanal / Terrenos Acidentados",
  rare: "Áreas de Preservação / Raros",
  urban: "Centros Urbanos",
  sea: "Litoral / Mar Aberto",
  "waters-edge": "Rios, Lagos e Pantanal",
};

export const BIOMAS_INFO = [
  { bioma: "Amazônia",      habitat: "forest",        cor: "#1E4620", corHover: "#2d6630", emoji: "🌳" },
  { bioma: "Cerrado",       habitat: "grassland",     cor: "#C2A649", corHover: "#dbbd58", emoji: "🌱" },
  { bioma: "Mata Atlântica", habitat: "mountain",      cor: "#0F5257", corHover: "#177e86", emoji: "⛰️" },
  { bioma: "Caatinga",      habitat: "rough-terrain",  cor: "#D4A373", corHover: "#e6b384", emoji: "🌵" },
  { bioma: "Pantanal",      habitat: "waters-edge",    cor: "#2A9D8F", corHover: "#3bc4b3", emoji: "🐊" },
  { bioma: "Pampa",         habitat: "rare",          cor: "#95D5B2", corHover: "#b7e4cb", emoji: "🌾" },
];

export const ESTADOS_BIOMA = {
  // --- REGIÃO NORTE (Predomínio Amazônia: forest) ---
  AC: { bioma: "Amazônia",      habitat: "forest",        cor: "#1E4620", corHover: "#2d6630", coords: [-70.00, -9.00] },
  AM: { bioma: "Amazônia",      habitat: "forest",        cor: "#1E4620", corHover: "#2d6630", coords: [-64.00, -4.00] },
  RR: { bioma: "Amazônia",      habitat: "forest",        cor: "#1E4620", corHover: "#2d6630", coords: [-61.30,  2.00] },
  RO: { bioma: "Amazônia",      habitat: "forest",        cor: "#1E4620", corHover: "#2d6630", coords: [-62.50, -11.00] },
  PA: { bioma: "Amazônia",      habitat: "forest",        cor: "#1E4620", corHover: "#2d6630", coords: [-53.00, -4.00] },
  AP: { bioma: "Amazônia",      habitat: "forest",        cor: "#1E4620", corHover: "#2d6630", coords: [-51.50,  1.40] },
  TO: { bioma: "Cerrado",       habitat: "grassland",     cor: "#C2A649", corHover: "#dbbd58", coords: [-48.20, -10.20] },

  // --- REGIÃO NORDESTE (Predomínio Caatinga / Cerrado) ---
  MA: { bioma: "Amazônia",      habitat: "forest",        cor: "#1E4620", corHover: "#2d6630", coords: [-45.00, -5.00] },
  PI: { bioma: "Caatinga",      habitat: "rough-terrain",  cor: "#D4A373", corHover: "#e6b384", coords: [-42.50, -7.50] },
  CE: { bioma: "Caatinga",      habitat: "rough-terrain",  cor: "#D4A373", corHover: "#e6b384", coords: [-39.50, -5.00] },
  RN: { bioma: "Caatinga",      habitat: "rough-terrain",  cor: "#D4A373", corHover: "#e6b384", coords: [-36.50, -5.70] },
  PB: { bioma: "Caatinga",      habitat: "rough-terrain",  cor: "#D4A373", corHover: "#e6b384", coords: [-36.80, -7.20] },
  PE: { bioma: "Caatinga",      habitat: "rough-terrain",  cor: "#D4A373", corHover: "#e6b384", coords: [-37.50, -8.40] },
  AL: { bioma: "Caatinga",      habitat: "rough-terrain",  cor: "#D4A373", corHover: "#e6b384", coords: [-36.50, -9.60] },
  SE: { bioma: "Caatinga",      habitat: "rough-terrain",  cor: "#D4A373", corHover: "#e6b384", coords: [-37.40, -10.60] },
  BA: { bioma: "Caatinga",      habitat: "rough-terrain",  cor: "#D4A373", corHover: "#e6b384", coords: [-41.70, -12.50] },

  // --- REGIÃO CENTRO-OESTE (Predomínio Cerrado / Pantanal) ---
  MT: { bioma: "Cerrado",       habitat: "grassland",     cor: "#C2A649", corHover: "#dbbd58", coords: [-56.00, -13.00] },
  MS: { bioma: "Pantanal",      habitat: "waters-edge",    cor: "#2A9D8F", corHover: "#3bc4b3", coords: [-54.60, -20.50] },
  GO: { bioma: "Cerrado",       habitat: "grassland",     cor: "#C2A649", corHover: "#dbbd58", coords: [-49.50, -16.00] },
  DF: { bioma: "Cerrado",       habitat: "grassland",     cor: "#C2A649", corHover: "#dbbd58", coords: [-47.90, -15.80] },

  // --- REGIÃO SUDESTE (Predomínio Mata Atlântica / Cerrado) ---
  MG: { bioma: "Cerrado",       habitat: "grassland",     cor: "#C2A649", corHover: "#dbbd58", coords: [-44.50, -18.50] },
  ES: { bioma: "Mata Atlântica", habitat: "mountain",      cor: "#0F5257", corHover: "#177e86", coords: [-40.30, -19.80] },
  RJ: { bioma: "Mata Atlântica", habitat: "mountain",      cor: "#0F5257", corHover: "#177e86", coords: [-42.50, -22.30] },
  SP: { bioma: "Mata Atlântica", habitat: "mountain",      cor: "#0F5257", corHover: "#177e86", coords: [-48.50, -22.50] },

  // --- REGIÃO SUL (Predomínio Mata Atlântica / Pampa) ---
  PR: { bioma: "Mata Atlântica", habitat: "mountain",      cor: "#0F5257", corHover: "#177e86", coords: [-51.00, -24.80] },
  SC: { bioma: "Mata Atlântica", habitat: "mountain",      cor: "#0F5257", corHover: "#177e86", coords: [-50.50, -27.20] },
  RS: { bioma: "Pampa",         habitat: "rare",          cor: "#95D5B2", corHover: "#b7e4cb", coords: [-53.50, -30.00] },
};