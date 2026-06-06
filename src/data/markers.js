/**
 * Marcadores de Pokémon espalhados pelo mapa do Brasil
 * coords: [longitude, latitude] em cada região
 */

// ── COORDENADAS FIXAS POR BIOMA ──────────────────────────────────────────────
// Cada posição mapeia para um slot fixo na região. Os Pokémons são trocados,
// mas as posições permanecem as mesmas para que fiquem dentro dos estados corretos.

export const BIOMA_COORDS = {
  // Amazônia — 65 pontos possíveis
  "forest": [
    [-68, 0], [-66, 0], [-64, 0], [-62, 2], [-60, 2],
    [-60, 0], [-62, 0], [-68,-2], [-66,-2], [-64,-2],
    [-64,-4], [-68,-4], [-66,-4], [-66,-6], [-68,-6],
    [-70,-6], [-64,-6], [-62,-6], [-62,-4], [-64,-10],
    [-66,-8], [-68,-8], [-64,-8], [-70,-8], [-72,-8],
    [-70,-10],[-68,-10],[-62,-2], [-60,-2], [-58,-2],
    [-60,-4], [-58,-4], [-60,-6], [-60,-8], [-62,-8],
    [-58,-6], [-58, 0], [-56, 0], [-54, 0], [-54,-2],
    [-56,-2], [-56,-4], [-54,-4], [-54,-6], [-56,-6],
    [-56,-8], [-54,-8], [-52,-6], [-52,-8], [-50,-8],
    [-50,-6], [-50,-4], [-52,-4], [-50,-2], [-52,-2],
    [-52, 0], [-52, 2], [-54, 2], [-56, 2], [-62, 4],
    [-50, 0], [-48,-2], [-48,-4], [-64,-12],[-62,-12],
  ],

  // Cerrado — 16 pontos possíveis
  "grassland": [
    [-48,-8], [-48,-10],[-46,-8], [-46,-6], [-44,-4],
    [-46,-4], [-44,-6], [-44,-2], [-50,-12],[-48,-12],
    [-50,-14],[-48,-14],[-48,-16],[-50,-16],[-50,-18],
    [-52,-18],
  ],

  // Caatinga — 21 pontos possíveis
  "cave": [
    [-42,-4], [-42,-6], [-44,-8], [-42,-8], [-44,-10],
    [-44,-12],[-42,-14],[-42,-12],[-40,-12],[-40,-14],
    [-40,-10],[-38,-12],[-42,-10],[-40,-8], [-38,-8],
    [-36,-8], [-36,-6], [-38,-6], [-40,-6], [-40,-4],
    [-38,-4],
  ],

  // Mata Atlântica — 22 pontos possíveis
  "mountain": [
    [-46,-16],[-46,-18],[-46,-20],[-44,-18],[-44,-16],
    [-42,-16],[-42,-18],[-44,-20],[-42,-20],[-44,-22],
    [-46,-22],[-42,-22],[-40,-20],[-40,-18],[-52,-24],
    [-54,-24],[-50,-24],[-50,-26],[-52,-26],[-54,-26],
    [-48,-26],[-50,-28],
  ],

  // Urbano SP/PR — 6 pontos possíveis
  "urban": [
    [-48,-22],[-50,-22],[-52,-22],
    [-48,-24],[-46,-24],[-50,-20],
  ],

  // Pampa RS — 9 pontos possíveis
  "rough-terrain": [
    [-52,-30],[-54,-28],[-52,-28],[-50,-30],[-54,-30],
    [-54,-32],[-52,-32],[-56,-30],[-56,-28],
  ],

  // Pantanal — 26 pontos possíveis
  "waters-edge": [
    [-54,-22],[-54,-20],[-56,-20],[-58,-20],[-58,-22],
    [-56,-22],[-54,-18],[-56,-18],[-58,-18],[-58,-16],
    [-56,-16],[-54,-16],[-54,-14],[-52,-14],[-54,-12],
    [-52,-12],[-54,-10],[-56,-10],[-56,-12],[-58,-12],
    [-58,-10],[-60,-10],[-60,-14],[-58,-14],[-56,-14],
    [-60,-16],
  ],
};


// ── HELPERS ────────────────────────────────────────────────────────────────────

function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
return a;
}

/**
 * Gera marcadores a partir de pools vindos da API.
 * @param {Object} apiPools — { [habitat]: Array<{id, name}> }
 * @param {number} countPerBioma — quantos markers por bioma
 */
// Pesos para distribuir pokémons lendários pelas regiões
const RARE_WEIGHTS = [
  { habitat: "forest",       weight: 15 },
  { habitat: "grassland",    weight: 20 },
  { habitat: "cave",         weight: 10 },
  { habitat: "waters-edge",  weight: 20 },
  { habitat: "urban",        weight: 35 },
];

function sortearHabitatRare() {
  const total = RARE_WEIGHTS.reduce((s, e) => s + e.weight, 0);
  let r = Math.random() * total;
  for (const { habitat, weight } of RARE_WEIGHTS) {
    r -= weight;
    if (r <= 0) return habitat;
  }
  return RARE_WEIGHTS[RARE_WEIGHTS.length - 1].habitat;
}

export function gerarMarcadoresFromAPI(apiPools, countPerBioma = 8) {
  const markers = [];
  // Rastreia slots usados para evitar sobreposição
  const usedSlots = {};

  for (const [habitat, pool] of Object.entries(apiPools)) {
    if (!pool || pool.length === 0) continue;
    if (habitat === "rare") continue; // tratado separadamente abaixo

    const coords = BIOMA_COORDS[habitat] || [];
    if (coords.length === 0) continue;

    const count  = Math.min(countPerBioma, coords.length, pool.length);
    const picked = shuffle(pool).slice(0, count);
    const slots  = shuffle([...Array(coords.length).keys()]).slice(0, count);

    if (!usedSlots[habitat]) usedSlots[habitat] = new Set();
    picked.forEach((poke, idx) => {
      usedSlots[habitat].add(slots[idx]);
      markers.push({ id: poke.id, name: poke.name, coords: coords[slots[idx]], habitat });
    });
  }

  // Distribui pokémons lendários dos outros biomas com pesos
  const rarePool = apiPools["rare"] || [];
  if (rarePool.length > 0) {
    const rareCount = Math.min(6, rarePool.length);
    shuffle(rarePool).slice(0, rareCount).forEach((poke) => {
      for (let t = 0; t < 8; t++) {
        const h = sortearHabitatRare();
        const coords = BIOMA_COORDS[h] || [];
        if (!usedSlots[h]) usedSlots[h] = new Set();
        const free = coords.map((_, i) => i).filter((i) => !usedSlots[h].has(i));
        if (free.length === 0) continue;
        const idx = free[Math.floor(Math.random() * free.length)];
        usedSlots[h].add(idx);
        markers.push({ id: poke.id, name: poke.name, coords: coords[idx], habitat: "rare" });
        break;
      }
    });
  }

  return markers;
}
