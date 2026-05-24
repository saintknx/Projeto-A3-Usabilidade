import { useState, useEffect } from "react";

/**
 * Hook para buscar todos os Pokémons de um habitat na PokéAPI.
 * Endpoint: /api/v2/pokemon-habitat/{habitat}
 *
 * Retorna a lista de Pokémons daquele habitat com seus IDs.
 */

// Mapa de nome do habitat → ID na PokéAPI
const HABITAT_IDS = {
  cave:           1,
  forest:         2,
  grassland:      3,
  mountain:       4,
  rare:           5,
  "rough-terrain":6,
  sea:            7,
  urban:          8,
  "waters-edge":  9,
};

export function useHabitatPokemon(habitat) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!habitat) return;

    const habitatId = HABITAT_IDS[habitat];
    if (!habitatId) {
      setError(`Habitat "${habitat}" não encontrado.`);
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    fetch(`https://pokeapi.co/api/v2/pokemon-habitat/${habitatId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Habitat "${habitat}" não encontrado na API.`);
        return res.json();
      })
      .then((json) => {
        // Extrai ID de cada Pokémon a partir da URL
        const pokemons = json.pokemon_species.map((p) => ({
          name: p.name,
          id:   parseInt(p.url.split("/").filter(Boolean).pop()),
        }));
        setData(pokemons);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [habitat]);

  return { data, loading, error };
}