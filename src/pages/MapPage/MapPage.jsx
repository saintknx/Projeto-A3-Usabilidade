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

/**
 * MapPage — tela principal do PokéBrasil.
 * Exibe o mapa interativo do Brasil com estados coloridos por bioma
 * e Pokémons como marcadores clicáveis.
 *
 * Os marcadores são sempre um subconjunto real do que a PokéAPI retorna
 * para cada habitat — garantindo consistência total entre mapa e Pokédex.
 */
export default function MapPage() {
  const navigate = useNavigate();

  const [selectedMarker, setSelectedMarker] = useState(null);
  const [hoveredEstado, setHoveredEstado]   = useState(null);
  const [biomaFilter, setBiomaFilter]       = useState(null);
  const [zoom, setZoom]                     = useState(1);
  const [center, setCenter]                 = useState([-52, -14]);

  // Marcadores gerados a partir dos pools reais da PokéAPI
  const {
    markers:     allMarkers,
    loading:     markersLoading,
    error:       markersError,
    refresh:     handleRefreshMarkers,
  } = useMapMarkers(8);

  // Busca dados do Pokémon selecionado na API
  const { data: pokeData,    loading: pokeLoading,    error: pokeError    } = usePokemon(selectedMarker?.id);
  const { data: speciesData, loading: speciesLoading, error: speciesError } = usePokemonSpecies(selectedMarker?.id);

  const loading = pokeLoading || speciesLoading;
  const error   = pokeError  || speciesError;

  // Filtra marcadores por bioma selecionado
  const markersFiltrados = biomaFilter
    ? allMarkers.filter((m) => {
        const habitatFiltro = BIOMAS_INFO.find((b) => b.bioma === biomaFilter)?.habitat;
        return m.habitat === habitatFiltro;
      })
    : allMarkers;

  return (
    <div className="map-layout">

      {/* ── SIDEBAR ── */}
      <aside className="map-sidebar" aria-label="Painel de informações">

        {/* Header */}
        <div className="sidebar-header">
          <h1 className="sidebar-logo"> PokéBrasil</h1>
          <p className="sidebar-sub">Pokédex Geográfica Interativa</p>
        </div>

        {/* Filtros de bioma */}
        <nav className="bioma-filters" aria-label="Filtrar Pokémons por bioma">
          <button
            className={`bioma-chip ${!biomaFilter ? "active" : ""}`}
            onClick={() => setBiomaFilter(null)}
            aria-pressed={!biomaFilter}
          >
            Todos
          </button>
          {BIOMAS_INFO.map((b) => (
            <button
              key={b.bioma}
              className={`bioma-chip ${biomaFilter === b.bioma ? "active" : ""}`}
              style={{ "--bioma-cor": b.cor }}
              onClick={() => setBiomaFilter((prev) => prev === b.bioma ? null : b.bioma)}
              aria-pressed={biomaFilter === b.bioma}
              aria-label={`Filtrar por ${b.bioma}`}
            >
              {b.emoji} {b.bioma}
            </button>
          ))}
        </nav>

        {/* Contador */}
        <p className="map-counter" role="status" aria-live="polite">
          {markersLoading
            ? "Carregando Pokémons..."
            : <><span>{markersFiltrados.length}</span> Pokémons no mapa</>
          }
          <button
            className="refresh-inline-btn"
            onClick={() => { setSelectedMarker(null); handleRefreshMarkers(); }}
            aria-label="Sortear novos Pokémons no mapa"
            title="Sortear novos Pokémons"
            disabled={markersLoading}
          >
            🔄 Atualizar
          </button>
        </p>

        {/* Erro ao carregar markers */}
        {markersError && (
          <p style={{ color: "#ff6b6b", fontSize: "0.8rem", padding: "0 1rem" }}>
            ⚠️ Erro ao carregar Pokémons: {markersError}
          </p>
        )}

        {/* Painel do Pokémon selecionado */}
        <div className="poke-panel" role="region" aria-label="Detalhes do Pokémon selecionado">

          {/* Estado inicial — nenhum selecionado */}
          {!selectedMarker && (
            <div className="empty-state">
              <span aria-hidden="true">🗺️</span>
              <p>Clique em um Pokémon no mapa para ver seus detalhes</p>
            </div>
          )}

          {/* Loading */}
          {selectedMarker && loading && (
            <LoadingSpinner message="Buscando na Pokédex..." />
          )}

          {/* Erro */}
          {selectedMarker && error && !loading && (
            <ErrorMessage
              message={error}
              onRetry={() => setSelectedMarker({ ...selectedMarker })}
            />
          )}

          {/* Dados carregados */}
          {selectedMarker && pokeData && speciesData && !loading && !error && (
            <div className="poke-detail">

              {/* Header do card */}
              <div className="poke-detail-header">
                <img
                  className="poke-detail-sprite"
                  src={getOfficialArtUrl(selectedMarker.id)}
                  alt={`Ilustração oficial de ${pokeData.name}`}
                  onError={(e) => { e.target.src = getSpriteUrl(selectedMarker.id); }}
                />
                <div className="poke-detail-info">
                  <span className="poke-detail-number">
                    #{String(pokeData.id).padStart(3, "0")}
                  </span>
                  <h2 className="poke-detail-name">{pokeData.name}</h2>
                  <div className="poke-detail-types">
                    {pokeData.types.map((t) => (
                      <TypeBadge key={t.type.name} type={t.type.name} />
                    ))}
                  </div>
                  {speciesData.isLendario && (
                    <span className="lendario-badge">⭐ Lendário</span>
                  )}
                </div>
              </div>

              {/* Bioma */}
              <div className="poke-detail-bioma">
                <span
                  className="bioma-dot"
                  style={{
                    background: BIOMAS_INFO.find(
                      (b) => b.habitat === selectedMarker.habitat
                    )?.cor,
                  }}
                />
                {HABITAT_LABELS_PT[selectedMarker.habitat] || selectedMarker.habitat}
              </div>

              {/* Descrição */}
              {speciesData.descricao && (
                <p className="poke-detail-desc">"{speciesData.descricao}"</p>
              )}

              {/* Stats */}
              <div className="poke-detail-stats">
                <h3 className="stats-title">Estatísticas base</h3>
                {pokeData.stats.map((s) => (
                  <StatBar key={s.stat.name} name={s.stat.name} value={s.base_stat} />
                ))}
              </div>

              {/* Botão ver detalhes completos */}
              <button
                className="btn-ver-mais"
                onClick={() => navigate(`/pokemon/${selectedMarker.id}`)}
                aria-label={`Ver página completa de ${pokeData.name}`}
              >
                Ver detalhes completos →
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ── MAPA ── */}
      <main className="map-area" aria-label="Mapa interativo do Brasil com Pokémons">

        {/* Info do estado em hover */}
        {hoveredEstado && ESTADOS_BIOMA[hoveredEstado] && (
          <div className="estado-tooltip" aria-live="polite">
            <span className="estado-sigla">{hoveredEstado}</span>
            <span className="estado-bioma">{ESTADOS_BIOMA[hoveredEstado].bioma}</span>
            <span className="estado-habitat">
              🌿 {HABITAT_LABELS_PT[ESTADOS_BIOMA[hoveredEstado].habitat]}
            </span>
          </div>
        )}

        {/* Legenda */}
        <div className="map-legend" aria-label="Legenda de biomas">
          <p className="legend-title">Biomas</p>
          {BIOMAS_INFO.map((b) => (
            <div key={b.bioma} className="legend-item">
              <span className="legend-dot" style={{ background: b.cor }} />
              <span>{b.bioma}</span>
            </div>
          ))}
        </div>

        {/* Controles de zoom */}
        <div className="map-controls">
          <button
            className="map-btn"
            onClick={() => setZoom((z) => Math.min(z + 0.5, 5))}
            aria-label="Aproximar zoom do mapa"
          >
            +
          </button>
          <button
            className="map-btn"
            onClick={() => setZoom((z) => Math.max(z - 0.5, 1))}
            aria-label="Afastar zoom do mapa"
          >
            −
          </button>
          <button
            className="map-btn"
            onClick={() => { setZoom(1); setCenter([-52, -14]); }}
            aria-label="Resetar zoom e posição do mapa"
            title="Reset"
          >
            ⌂
          </button>
          <button
            className="map-btn refresh-btn"
            onClick={() => { setSelectedMarker(null); handleRefreshMarkers(); }}
            aria-label="Sortear novos Pokémons no mapa"
            title="Novos Pokémons"
            disabled={markersLoading}
          >
            🗘
          </button>
        </div>

        {/* Loading overlay inicial */}
        {markersLoading && (
          <div style={{
            position: "absolute", inset: 0, display: "flex",
            alignItems: "center", justifyContent: "center",
            background: "rgba(13,17,23,0.6)", zIndex: 10, pointerEvents: "none"
          }}>
            <LoadingSpinner message="Carregando Pokémons da API..." />
          </div>
        )}

        {/* Mapa SVG */}
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ center: [-52, -14], scale: 900 }}
          style={{ width: "100%", height: "100%" }}
        >
          <ZoomableGroup
            zoom={zoom}
            center={center}
            onMoveEnd={({ zoom: z, coordinates }) => {
              setZoom(z);
              setCenter(coordinates);
            }}
          >
            {/* Estados */}
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const sigla  = geo.properties.SIGLA || geo.properties.sigla || geo.properties.UF;
                  const bioma  = ESTADOS_BIOMA[sigla];
                  const hovered = hoveredEstado === sigla;
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={hovered ? (bioma?.corHover || "#444") : (bioma?.cor || "#2a2a3d")}
                      stroke="#0d1117"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover:   { outline: "none" },
                        pressed: { outline: "none" },
                      }}
                      onMouseEnter={() => setHoveredEstado(sigla)}
                      onMouseLeave={() => setHoveredEstado(null)}
                      onClick={() => bioma && navigate(`/bioma/${bioma.habitat}`)}
                      tabIndex={0}
                      role="button"
                      aria-label={`${sigla} — ${bioma?.bioma || "região"}`}
                      onKeyDown={(e) => e.key === "Enter" && bioma && navigate(`/bioma/${bioma.habitat}`)}
                    />
                  );
                })
              }
            </Geographies>

            {/* Marcadores de Pokémon */}
            {markersFiltrados.map((marker, i) => (
              <Marker key={`${marker.id}-${i}`} coordinates={marker.coords}>
                <g
                  className={`poke-marker ${selectedMarker?.id === marker.id && selectedMarker?.coords?.[0] === marker.coords[0] ? "selected" : ""}`}
                  onClick={() => setSelectedMarker(marker)}
                  onKeyDown={(e) => e.key === "Enter" && setSelectedMarker(marker)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Pokémon ${marker.name} — clique para ver detalhes`}
                >
                  <ellipse cx={0} cy={14} rx={9} ry={3} fill="rgba(0,0,0,0.3)" />
                  <image
                    href={getSpriteUrl(marker.id)}
                    x={-14} y={-14}
                    width={28} height={28}
                    style={{ imageRendering: "pixelated" }}
                  />
                </g>
              </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>
      </main>
    </div>
  );
}
