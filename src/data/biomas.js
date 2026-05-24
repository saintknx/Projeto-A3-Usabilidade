/**
 * Mapeamento de estados brasileiros 
 * Usado para colorir o mapa e filtrar Pokémons por região
 */
export const ESTADOS_BIOMA = {
    AM: { bioma: "Amazônia",      habitat: "forest",       cor: "#1a6b3a", corHover: "#22904d" },
    PA: { bioma: "Amazônia",      habitat: "forest",       cor: "#1a6b3a", corHover: "#22904d" },
    AC: { bioma: "Amazônia",      habitat: "forest",       cor: "#1a6b3a", corHover: "#22904d" },
    RO: { bioma: "Amazônia",      habitat: "forest",       cor: "#1a6b3a", corHover: "#22904d" },
    RR: { bioma: "Amazônia",      habitat: "forest",       cor: "#1a6b3a", corHover: "#22904d" },
    AP: { bioma: "Amazônia",      habitat: "forest",       cor: "#1a6b3a", corHover: "#22904d" },
    TO: { bioma: "Cerrado",       habitat: "grassland",    cor: "#b5852a", corHover: "#d4a035" },
    MA: { bioma: "Cerrado",       habitat: "grassland",    cor: "#b5852a", corHover: "#d4a035" },
    PI: { bioma: "Caatinga",      habitat: "cave",         cor: "#c4622d", corHover: "#e07535" },
    CE: { bioma: "Caatinga",      habitat: "cave",         cor: "#c4622d", corHover: "#e07535" },
    RN: { bioma: "Caatinga",      habitat: "cave",         cor: "#c4622d", corHover: "#e07535" },
    PB: { bioma: "Caatinga",      habitat: "cave",         cor: "#c4622d", corHover: "#e07535" },
    PE: { bioma: "Caatinga",      habitat: "cave",         cor: "#c4622d", corHover: "#e07535" },
    AL: { bioma: "Mata Atlântica",habitat: "mountain",     cor: "#2d7a4f", corHover: "#3a9e65" },
    SE: { bioma: "Mata Atlântica",habitat: "mountain",     cor: "#2d7a4f", corHover: "#3a9e65" },
    BA: { bioma: "Caatinga",      habitat: "cave",         cor: "#c4622d", corHover: "#e07535" },
    MG: { bioma: "Mata Atlântica",habitat: "mountain",     cor: "#2d7a4f", corHover: "#3a9e65" },
    ES: { bioma: "Mata Atlântica",habitat: "mountain",     cor: "#2d7a4f", corHover: "#3a9e65" },
    RJ: { bioma: "Mata Atlântica",habitat: "mountain",     cor: "#2d7a4f", corHover: "#3a9e65" },
    SP: { bioma: "Urbano",        habitat: "urban",        cor: "#525252", corHover: "#646363" },
    PR: { bioma: "Mata Atlântica",habitat: "mountain",     cor: "#2d7a4f", corHover: "#3a9e65" },
    SC: { bioma: "Mata Atlântica",habitat: "mountain",     cor: "#2d7a4f", corHover: "#3a9e65" },
    RS: { bioma: "Pampa",         habitat: "rough-terrain",cor: "#7a9e3b", corHover: "#93c247" },
    MS: { bioma: "Pantanal",      habitat: "waters-edge",  cor: "#3b7a9e", corHover: "#4a9acc" },
    MT: { bioma: "Pantanal",      habitat: "waters-edge",  cor: "#3b7a9e", corHover: "#4a9acc" },
    GO: { bioma: "Cerrado",       habitat: "grassland",    cor: "#b5852a", corHover: "#d4a035" },
    DF: { bioma: "Cerrado",       habitat: "grassland",    cor: "#b5852a", corHover: "#d4a035" },
};

/**
 * Tradução dos habitats
 */
export const HABITAT_LABELS_PT = {
    forest:         "Floresta",
    grassland:      "Campos",
    cave:           "Caatinga / Semiárido",
    rare:           "Raro",
    "waters-edge":  "Pantanal / Áreas Alagadas",
    mountain:       "Montanha / Serras",
    sea:            "Mar",
    urban:          "Urbano",
    "rough-terrain": "Pampa / Campos do Sul",
};

/**
 * Regiões únicas com suas informações
 */
export const BIOMAS_INFO = [
    { bioma: "Amazônia",       habitat: "forest",      cor: "#1a6b3a", emoji: "🌳" },
    { bioma: "Cerrado",        habitat: "grassland",   cor: "#b5852a", emoji: "🌾" },
    { bioma: "Caatinga",       habitat: "cave",        cor: "#c4622d", emoji: "🏜️" },
    { bioma: "Mata Atlântica", habitat: "mountain",    cor: "#2d7a4f", emoji: "🌿" },
    { bioma: "Pantanal",       habitat: "waters-edge", cor: "#3b7a9e", emoji: "💧" },
    { bioma: "Pampa",          habitat: "rough-terrain",cor: "#7a9e3b",emoji: "🌱" },
    { bioma: "Urbano",         habitat: "urban",       cor: "#696969", emoji: "🏙️" },
];