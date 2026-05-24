/**
 * Marcadores de Pokémon espalhados pelo mapa do Brasil
 * coords: [longitude, latitude] em cada região
 */

// ── COORDENADAS FIXAS POR BIOMA ──────────────────────────────────────────────
// Cada posição mapeia para um slot fixo na região. Os Pokémons são trocados,
// mas as posições permanecem as mesmas para que fiquem dentro dos estados corretos.

export const BIOMA_COORDS = {
    forest: [
        [-63.0, -3.5],  [-59.0, -0.5],  [-67.0, -5.0],  [-55.0, -2.0],
        [-61.0, -7.0],  [-57.0, -4.0],  [-65.0,  0.0],  [-70.0, -3.0],
        [-53.0, -1.0],  [-60.0,-10.0],  [-72.0, -9.0],  [-68.0, -7.0],
        [-56.0,  1.0],  [-64.0, -1.0],  [-58.0, -8.0],
    ],
    grassland: [
        [-48.0,-15.0], [-44.0,-12.0], [-50.0,-10.0], [-46.0,-16.0],
        [-47.5,-13.5], [-49.0,-17.5], [-45.5,-14.0], [-52.0,-15.0],
        [-47.0,-11.0], [-43.0,-10.0], [-48.5,-16.5],
    ],
    cave: [
        [-39.0,-10.0], [-36.0, -7.0], [-41.0,-13.0], [-38.5, -8.5],
        [-40.5,-11.0], [-35.5, -5.0], [-37.0, -9.0], [-42.0,-14.0],
        [-38.0,-12.0], [-36.5, -6.0], [-40.0, -7.5], [-37.5,-10.5],
        [-39.5, -4.5], [-41.5,-12.0], [-43.0,-16.0],
    ],

    "waters-edge": [
        [-57.0,-17.0], [-55.0,-19.0], [-59.0,-16.0], [-57.5,-20.0],
        [-56.0,-18.5], [-58.5,-15.5], [-55.5,-21.0], [-53.5,-16.5],
        [-57.0,-22.0], [-59.5,-18.0], [-54.0,-20.0], [-56.5,-16.0],
        [-58.0,-19.5], [-53.0,-18.0], [-60.0,-20.5],
    ],
    "rough-terrain": [
        [-53.0,-30.0], [-51.0,-28.0], [-54.5,-31.0],
        [-52.0,-29.0], [-50.5,-27.5], [-53.5,-31.5],
        [-51.5,-29.5], [-52.5,-30.5],
    ],
  // urban: exclusivo para São Paulo
    urban: [
        [-46.6,-23.5], [-47.0,-23.2], [-46.3,-23.7], [-47.5,-22.8],
        [-46.9,-23.9], [-45.8,-23.1], [-48.3,-22.5], [-46.0,-22.9],
        [-47.8,-23.5], [-45.5,-23.4],
    ],
    mountain: [
        [-43.0,-22.5], [-45.0,-20.0], [-47.0,-23.0], [-44.0,-19.0],
        [-41.5,-21.0], [-46.5,-24.0], [-49.0,-25.5], [-42.5,-20.5],
        [-44.5,-21.5], [-48.5,-26.0], [-50.0,-27.0], [-43.5,-23.5],
        [-45.5,-22.0], [-47.5,-25.0], [-51.0,-28.5],
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
