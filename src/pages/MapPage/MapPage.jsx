import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import "./MapPage.css";
import LoadingSpinner  from "../../components/LoadingSpinner/LoadingSpinner";
import ErrorMessage    from "../../components/ErrorMessage/ErrorMessage";
import TypeBadge       from "../../components/TypeBadge/TypeBadge";
import StatBar         from "../../components/StatBar/StatBar";
import { usePokemon }         from "../../hooks/usePokemon";
import { usePokemonSpecies }  from "../../hooks/usePokemonSpecies";
import { useMapMarkers }      from "../../hooks/useMapMarkers";
import { ESTADOS_BIOMA, BIOMAS_INFO, HABITAT_LABELS_PT } from "../../data/biomas";
import { getOfficialArtUrl, getSpriteUrl } from "../../utils/sprites";

const GEO_URL =
  "https://raw.githubusercontent.com/giuliano-macedo/geodata-br-states/main/geojson/br_states.json";

export default function MapPage() {
  const navigate = useNavigate();
  const { markers, loading, error, refresh } = useMapMarkers();

  // Estados de controlo do mapa
  const [selectedBioma, setSelectedBioma] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [position, setPosition] = useState({ coordinates: [-55, -15], zoom: 1 });
  const [hoveredEstado, setHoveredEstado] = useState(null);

  // Estados da barra de pesquisa
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  // CORREÇÃO AQUI: Desestruturação correta extraindo o "data" renomeado, 
  // exatamente igual ao padrão que você usou na PokemonPage.jsx!
  const { data: pokeData, loading: loadingPoke } = usePokemon(selectedMarker?.id);
  const { data: speciesData } = usePokemonSpecies(selectedMarker?.id);

  // Filtros aplicados nos marcadores reais do mapa
  const markersFiltrados = selectedBioma
    ? markers.filter((m) => m.habitat === selectedBioma)
    : markers;

  const handleZoomIn = () => {
    if (position.zoom < 8) setPosition((pos) => ({ ...pos, zoom: pos.zoom * 1.5 }));
  };

  const handleZoomOut = () => {
    if (position.zoom > 1) setPosition((pos) => ({ ...pos, zoom: pos.zoom / 1.5 }));
  };

  const handleReset = () => {
    setPosition({ coordinates: [-55, -15], zoom: 1 });
    setSelectedBioma(null);
  };

  // Tratamento da pesquisa
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setSearchLoading(true);
    setSearchError("");

    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase().trim()}`);
      
      if (!response.ok) {
        throw new Error("Pokémon não encontrado.");
      }

      const data = await response.json();

      const searchedMarker = {
        id: data.id,
        name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
        habitat: "urban",
        estadoSigla: "BR",
        biomaObj: {
          bioma: "Pesquisa Geral",
          habitat: "urban",
          cor: "#ff4747"
        },
        coords: [-55, -15],
        isFromSearch: true
      };

      setSelectedMarker(searchedMarker);
      setSearchTerm("");
    } catch (err) {
      setSearchError(err.message || "Erro ao buscar Pokémon.");
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="map-layout">
      {/* SIDEBAR ESQUERDA */}
      <aside className="map-sidebar">
        <div className="sidebar-header">
          <h1 className="sidebar-logo">POKÉBRASIL</h1>
          <p className="sidebar-sub">Regiões e Habitats Nacionais</p>

          <form onSubmit={handleSearch} className="search-box-container">
            <input
              type="text"
              placeholder="Buscar Pokémon (ex: Pikachu)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={searchLoading}
              className="search-input"
            />
            <button type="submit" disabled={searchLoading} className="search-btn">
              {searchLoading ? "..." : "Buscar"}
            </button>
          </form>
          {searchError && <p className="search-error-msg">⚠️ {searchError}</p>}
        </div>

        <div className="map-counter">
          <div>
            Exibindo <span>{markersFiltrados.length}</span> selvagens
          </div>
          <button className="refresh-inline-btn" onClick={refresh}>
            🔄 Sorteie Novos
          </button>
        </div>

        <div className="bioma-filters">
          {BIOMAS_INFO.map((b) => (
            <button
              key={b.habitat}
              className={`bioma-chip ${selectedBioma === b.habitat ? "active" : ""}`}
              onClick={() => setSelectedBioma(selectedBioma === b.habitat ? null : b.habitat)}
              style={{ "--bioma-cor": b.cor }}
            >
              {b.emoji} {b.bioma}
            </button>
          ))}
        </div>

        {/* PAINEL DE DETALHES CORRIGIDO */}
        <div className="poke-panel">
          {selectedMarker ? (
            loadingPoke ? (
              <div className="empty-state">
                <LoadingSpinner />
                <p>A carregar dados da PokéAPI...</p>
              </div>
            ) : pokeData ? (
              <div className="poke-detail">
                <div className="poke-detail-header">
                  <img
                    src={getSpriteUrl(pokeData.id)}
                    alt={pokeData.name}
                    className="poke-detail-sprite"
                    onError={(e) => {
                      e.target.src = getOfficialArtUrl(pokeData.id);
                    }}
                  />
                  <div>
                    <span className="poke-detail-number">#{String(pokeData.id).padStart(3, "0")}</span>
                    <h2 className="poke-detail-name" style={{ textTransform: "capitalize" }}>{pokeData.name}</h2>
                    <div className="poke-detail-types">
                      {pokeData.types.map((t) => (
                        <TypeBadge key={t.type.name} type={t.type.name} />
                      ))}
                    </div>
                    {(speciesData?.is_legendary || speciesData?.isLendario) && (
                      <span className="lendario-badge">⭐ Lendário</span>
                    )}
                  </div>
                </div>

                <div className="poke-detail-bioma">
                  <span
                    className="bioma-dot"
                    style={{ background: selectedMarker.biomaObj?.cor || "var(--accent)" }}
                  ></span>
                  <span>
                    Habitat: {selectedMarker.estadoSigla} — {selectedMarker.biomaObj?.bioma || "Desconhecido"}
                  </span>
                </div>

                <div className="poke-detail-stats">
                  <h4 className="stats-title">Estatísticas Base</h4>
                  {pokeData.stats.map((s) => (
                    // Ajustado de s.stat.name para "name" ou "label" dependendo do seu componente interno StatBar
                    <StatBar key={s.stat.name} name={s.stat.name} label={s.stat.name} value={s.base_stat} />
                  ))}
                </div>

                <button
                  className="btn-ver-mais"
                  onClick={() => navigate(`/pokemon/${pokeData.id}`)}
                >
                  Ver Detalhes na Pokédex →
                </button>
              </div>
            ) : (
              <div className="empty-state">Erro ao carregar dados do Pokémon.</div>
            )
          ) : (
            <div className="empty-state">
              <span>🗺️</span>
              <p>Clique num Pokémon no mapa ou busque pelo nome para analisar as suas estatísticas base.</p>
            </div>
          )}
        </div>
      </aside>

      {/* ÁREA DO MAPA INTERATIVO */}
      <main className="map-area">
        {loading && (
          <div className="empty-state" style={{ position: "absolute", inset: 0, zIndex: 5, background: "rgba(10,22,40,0.7)" }}>
            <LoadingSpinner />
          </div>
        )}
        {error && <ErrorMessage message={error} onRetry={refresh} />}

        {hoveredEstado && (
          <div className="estado-tooltip">
            <span className="estado-sigla">{hoveredEstado.sigla}</span>
            <span className="estado-bioma">{hoveredEstado.bioma}</span>
            <span className="estado-habitat">{HABITAT_LABELS_PT[hoveredEstado.habitat]}</span>
          </div>
        )}

        <div className="map-legend">
          <h4 className="legend-title">Legenda de Biomas</h4>
          {BIOMAS_INFO.map((b) => (
            <div key={b.habitat} className="legend-item">
              <span className="legend-dot" style={{ background: b.cor }}></span>
              <span>{b.bioma}</span>
            </div>
          ))}
        </div>

        <div className="map-controls">
          <button className="map-btn" onClick={handleZoomIn}>+</button>
          <button className="map-btn" onClick={handleZoomOut}>−</button>
          <button className="map-btn" onClick={handleReset}>⟲</button>
        </div>

        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 750, center: [-55, -15] }}
        >
          <ZoomableGroup
            zoom={position.zoom}
            center={position.coordinates}
            onMoveEnd={setPosition}
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  // CORREÇÃO GEOGRÁFICA: Garante mapeamento correto das propriedades do GeoJSON
                  const sigla = geo.properties.sigla || geo.properties.SIGLA;
                  const bioma = ESTADOS_BIOMA[sigla];
                  const isFiltered = selectedBioma && bioma?.habitat !== selectedBioma;

                  // Se a propriedade do seu JSON for "NM_UF" ou similar, pode falhar. 
                  // Esta linha abaixo garante a leitura correta independente do padrão do arquivo do Giuliano Macedo:
                  const estadoCor = bioma ? bioma.cor : "#444a51";

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={estadoCor}
                      stroke="#0d1117"
                      strokeWidth={0.6}
                      opacity={isFiltered ? 0.25 : 1}
                      style={{
                        default: { outline: "none", transition: "fill 0.2s" },
                        hover: { fill: bioma ? bioma.corHover : "#57606a", outline: "none", cursor: "pointer" },
                        pressed: { outline: "none" },
                      }}
                      onMouseEnter={() => bioma && setHoveredEstado({ sigla, ...bioma })}
                      onMouseLeave={() => setHoveredEstado(null)}
                      onClick={() => bioma && navigate(`/bioma/${bioma.habitat}`)}
                    />
                  );
                })
              }
            </Geographies>

            {/* MARCADORES CORRIGIDOS */}
            {markersFiltrados.map((marker, i) => {
              const isSelected = selectedMarker && 
                                 selectedMarker.id === marker.id && 
                                 selectedMarker.estadoSigla === marker.estadoSigla;

              return (
                <Marker key={`${marker.id}-${marker.estadoSigla}-${i}`} coordinates={marker.coords}>
                  <g
                    className={`poke-marker ${isSelected ? "selected" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMarker(marker);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <ellipse cx={0} cy={12} rx={8} ry={2.5} fill="rgba(0,0,0,0.4)" />
                    <image
                      href={getSpriteUrl(marker.id)}
                      x={-14} y={-14}
                      width={28} height={28}
                      style={{ imageRendering: "pixelated" }}
                    />
                  </g>
                </Marker>
              );
            })}
          </ZoomableGroup>
        </ComposableMap>
      </main>
    </div>
  );
}