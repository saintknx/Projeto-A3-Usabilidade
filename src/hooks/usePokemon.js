import { useState, useEffect } from "react";

/**
 * Hook para buscar dados de um Pokémon na PokéAPI.
 * Endpoint: /api/v2/pokemon/{id}
 *
 * Retorna: { data, loading, error }
 * Trata os 4 estados obrigatórios: loading, sucesso, vazio e erro.
 */
export function usePokemon(id) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);
    setData(null);

    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Pokémon #${id} não encontrado.`);
        return res.json();
      })
      .then((json) => setData(json))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { data, loading, error };
}