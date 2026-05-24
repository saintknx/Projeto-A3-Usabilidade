import { useState, useEffect } from "react";

/**
 * Hook para buscar dados de espécie de um Pokémon na PokéAPI.
 * Endpoint: /api/v2/pokemon-species/{id}
 *
 * Retorna descrição em português, se é lendário/mítico,
 * e o ID da cadeia de evolução.
 */
export function usePokemonSpecies(id) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);
    setData(null);

    fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Espécie #${id} não encontrada.`);
        return res.json();
      })
      .then((json) => {
        const descricaoPt = json.flavor_text_entries
          .find((e) => e.language.name === "pt-br")?.flavor_text;

        const descricaoEn = json.flavor_text_entries
          .find((e) => e.language.name === "en")?.flavor_text || "";

        const evolutionChainId = json.evolution_chain?.url
          ? json.evolution_chain.url.split("/").filter(Boolean).pop()
          : null;

        const base = {
          isLendario: json.is_legendary,
          isMitico:   json.is_mythical,
          cor:        json.color?.name,
          habitat:    json.habitat?.name,
          evolutionChainId,
          nomePt: json.names?.find((n) => n.language.name === "pt-br")?.name || null,
        };

        const texto = (descricaoPt || descricaoEn).replace(/\f/g, " ").replace(/\n/g, " ");

        if (descricaoPt) {
          setData({ ...base, descricao: texto });
          setLoading(false);
          return;
        }

        fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(texto)}&langpair=en|pt-br`)
          .then((r) => r.json())
          .then((t) => setData({ ...base, descricao: t.responseData?.translatedText || texto }))
          .catch(() => setData({ ...base, descricao: texto }))
          .finally(() => setLoading(false));
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  return { data, loading, error };
}