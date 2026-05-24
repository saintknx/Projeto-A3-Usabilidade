import { useState, useEffect, useCallback} from "react";
import { gerarMarcadoresFromAPI } from "../data/markers";

/**
 * Hook que busca os habitats da PokéAPI e gera marcadores garantidamente
 * consistentes com os dados reais da API.
 *
 * Os marcadores do mapa são sempre um subconjunto do que a API retorna
 * para cada habitat — sem hardcoding de listas.
 */

const HABITATS = ["forest", "grassland", "cave", "rare", "waters-edge", "urban", "mountain", "rough-terrain"];

// ID de cada habitat na PokéAPI
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

// Cache em memória para não refazer fetch a cada atualização
let _poolCache = null;
// Persiste os markers entre desmontagens/remontagens do componente (navegação)
let _markersCache = null;

async function fetchAllPools() {
  if (_poolCache) return _poolCache;

  const results = await Promise.all(
    HABITATS.map(async (habitat) => {
      const id = HABITAT_IDS[habitat];
      if (!id) return [habitat, []];
      try {
        const res  = await fetch(`https://pokeapi.co/api/v2/pokemon-habitat/${id}`);
        if (!res.ok) return [habitat, []];
        const json = await res.json();
        const pokemons = json.pokemon_species.map((p) => ({
          name: p.name,
          id:   parseInt(p.url.split("/").filter(Boolean).pop()),
        }));
        return [habitat, pokemons];
      } catch {
        return [habitat, []];
      }
    })
  );

  _poolCache = Object.fromEntries(results);
  return _poolCache;
}

export function useMapMarkers(countPerBioma = 8) {
  const [markers, setMarkers]     = useState(() => _markersCache || []);
  const [loading, setLoading]     = useState(!_markersCache);
  const [error, setError]         = useState(null);

  const generateMarkers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const pools = await fetchAllPools();
      const m = gerarMarcadoresFromAPI(pools, countPerBioma);
      _markersCache = m;
      setMarkers(m);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [countPerBioma]);

  useEffect(() => {
    // Só busca se ainda não há markers em cache
    if (!_markersCache) generateMarkers();
  }, [generateMarkers]);

  const refresh = useCallback(() => {
    if (_poolCache) {
      const m = gerarMarcadoresFromAPI(_poolCache, countPerBioma);
      _markersCache = m;
      setMarkers(m);
    } else {
      generateMarkers();
    }
  }, [countPerBioma, generateMarkers]);

  return { markers, loading: loading && markers.length === 0, error, refresh };
}
