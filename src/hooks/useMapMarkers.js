import { useState, useEffect, useCallback } from "react";
import { BIOMAS_INFO, ESTADOS_BIOMA } from "../data/biomas";

/**
 * Hook para buscar pokémons da PokéAPI com base nos habitats dos biomas
 * e gerar marcadores com coordenadas geográficas reais [Long, Lat].
 * Agora com sistema de balanceamento regional para preencher o Norte e aliviar o Sul.
 */
export function useMapMarkers() {
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadMarkers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const allGeneratedMarkers = [];

      // Mapeia quais estados pertencem a cada habitat para fazer o spawn correto
      const habitatParaEstados = {};
      Object.entries(ESTADOS_BIOMA).forEach(([sigla, info]) => {
        if (!habitatParaEstados[info.habitat]) {
          habitatParaEstados[info.habitat] = [];
        }
        habitatParaEstados[info.habitat].push({ sigla, ...info });
      });

      // Busca os Pokémons para cada bioma definido
      for (const bioma of BIOMAS_INFO) {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon-habitat/${bioma.habitat}`
        );

        if (!response.ok) {
          throw new Error(`Erro ao buscar habitat: ${bioma.habitat}`);
        }

        const data = await response.json();
        const pokemonSpeciesList = data.pokemon_species || [];

        if (pokemonSpeciesList.length === 0) continue;

        // --- SISTEMA DE CONTROLE DE DENSIDADE (BALANCEAMENTO) ---
        // Definimos dinamicamente quantos Pokémons vão nascer dependendo do habitat
        let quantidadeSorteada = 6; 

        if (bioma.habitat === "forest") {
          // Aumenta drasticamente a população do Norte (Amazônia) para preencher o topo
          quantidadeSorteada = 22; 
        } else if (bioma.habitat === "grassland") {
          // Cerrado é grande, ganha um leve bônus no centro-norte
          quantidadeSorteada = 10;
        } else if (bioma.habitat === "rough-terrain" || bioma.habitat === "mountain" || bioma.habitat === "rare") {
          // Diminui os habitats do Sul, Sudeste e Nordeste para aliviar a superpopulação da parte de baixo
          quantidadeSorteada = 4; 
        }

        // Sorteia a quantidade ajustada de pokémons deste habitat
        const shuffled = [...pokemonSpeciesList].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, quantidadeSorteada);

        const estadosDisponiveis = habitatParaEstados[bioma.habitat] || [];

        selected.forEach((specie) => {
          // Extrai o ID a partir da URL da espécie
          const urlParts = specie.url.split("/");
          const id = parseInt(urlParts[urlParts.length - 2], 10);

          if (estadosDisponiveis.length > 0) {
            // Sorteia um estado pertencente a esse bioma para o Pokémon dar spawn
            const estadoSorteado =
              estadosDisponiveis[Math.floor(Math.random() * estadosDisponiveis.length)];

            // Pega a coordenada central real [Longitude, Latitude] do estado
            const [baseLong, baseLat] = estadoSorteado.coords;

            // --- SISTEMA DE ESPALHAMENTO (JITTER) ESPACIAL ---
            let fatorEspalhamento = 1.6;

            // Se for nos estados gigantes do Norte, espalha ainda mais para ocupar o continente vazio
            if (estadoSorteado.sigla === "AM" || estadoSorteado.sigla === "PA") {
              fatorEspalhamento = 5.0; // Espalha por toda a imensidão da selva
            } else if (estadoSorteado.sigla === "MS" || estadoSorteado.sigla === "RS") {
              fatorEspalhamento = 3.5; // Mantém um bom espalhamento nas pontas isoladas
            } else if (estadoSorteado.sigla === "AC" || estadoSorteado.sigla === "RO" || estadoSorteado.sigla === "RR") {
              fatorEspalhamento = 2.5;
            }

            const jitterLong = (Math.random() - 0.5) * fatorEspalhamento;
            const jitterLat = (Math.random() - 0.5) * fatorEspalhamento;

            allGeneratedMarkers.push({
              id,
              name: specie.name.charAt(0).toUpperCase() + specie.name.slice(1),
              habitat: bioma.habitat,
              bioma: bioma.bioma,
              estado: estadoSorteado.sigla,
              coords: [baseLong + jitterLong, baseLat + jitterLat],
            });
          }
        });
      }

      // Sorteia a ordem final dos marcadores para misturar a renderização na tela
      setMarkers(allGeneratedMarkers.sort(() => 0.5 - Math.random()));
    } catch (err) {
      console.error("Erro no useMapMarkers:", err);
      setError(err.message || "Erro desconhecido ao carregar marcadores.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMarkers();
  }, [loadMarkers]);

  return {
    markers,
    loading,
    error,
    refresh: loadMarkers,
  };
}