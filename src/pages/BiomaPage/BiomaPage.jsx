import { useParams, useNavigate } from "react-router-dom";
import "./BiomaPage.css";
import { useHabitatPokemon } from "../../hooks/useHabitatPokemon";
import { usePokemon }        from "../../hooks/usePokemon";
import LoadingSpinner        from "../../components/LoadingSpinner/LoadingSpinner";
import ErrorMessage          from "../../components/ErrorMessage/ErrorMessage";
import TypeBadge             from "../../components/TypeBadge/TypeBadge";
import { BIOMAS_INFO, HABITAT_LABELS_PT } from "../../data/biomas";
import { getOfficialArtUrl, getSpriteUrl } from "../../utils/sprites";

/**
 * Card interno usado apenas na BiomaPage.
 * Busca dados do Pokémon individualmente para exibir tipos.
 */
function BiomaPokeCard({ id, name }) {
  const navigate       = useNavigate();
  const { data, loading } = usePokemon(id);
  const numero         = String(id).padStart(3, "0");

  return (
    <li className="bioma-poke-item">
      <button
        className="bioma-poke-card"
        onClick={() => navigate(`/pokemon/${id}`)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            navigate(`/pokemon/${id}`);
          }
        }}
        aria-label={`Ver detalhes de ${name}, número ${numero}`}
      >
        <div className="bioma-card-img-wrap">
          <img
            src={getOfficialArtUrl(id)}
            alt={`Ilustração de ${name}`}
            onError={(e) => { e.target.src = getSpriteUrl(id); }}
            loading="lazy"
          />
        </div>
        <div className="bioma-card-body">
          <span className="bioma-card-number">#{numero}</span>
          <h2 className="bioma-card-name">{name}</h2>
          <div className="bioma-card-types">
            {loading && <span className="loading-types">...</span>}
            {data?.types?.map((t) => (
              <TypeBadge key={t.type.name} type={t.type.name} />
            ))}
          </div>
        </div>
      </button>
    </li>
  );
}

/**
 * BiomaPage — exibe todos os Pokémons de um habitat.
 * Rota: /bioma/:habitat
 *
 * Trata estados: loading, erro, vazio e sucesso.
 */
export default function BiomaPage() {
  const { habitat }  = useParams();
  const navigate     = useNavigate();
  const biomaInfo    = BIOMAS_INFO.find((b) => b.habitat === habitat);
  const label        = HABITAT_LABELS_PT[habitat] || habitat;

  const { data, loading, error } = useHabitatPokemon(habitat);

  return (
    <div className="bioma-layout">

      {/* Header */}
      <header className="bioma-header">
        <button
          className="btn-voltar"
          onClick={() => navigate("/")}
          aria-label="Voltar para o mapa"
        >
          ← Voltar ao mapa
        </button>

        <div className="bioma-titulo-wrap">
          {biomaInfo && (
            <span
              className="bioma-cor-dot"
              style={{ background: biomaInfo.cor }}
              aria-hidden="true"
            />
          )}
          <div>
            <h1 className="bioma-titulo">
              {biomaInfo?.emoji} {biomaInfo?.bioma || label}
            </h1>
            <p className="bioma-subtitulo">
              Habitat: {label} · {data ? `${data.length} Pokémons encontrados` : ""}
            </p>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="bioma-content" aria-label={`Pokémons do bioma ${label}`}>

        {/* Loading */}
        {loading && <LoadingSpinner message={`Buscando Pokémons do bioma ${label}...`} />}

        {/* Erro */}
        {error && !loading && (
          <ErrorMessage
            message={error}
            onRetry={() => window.location.reload()}
          />
        )}

        {/* Vazio */}
        {!loading && !error && data && data.length === 0 && (
          <div className="bioma-vazio" role="status">
            <span aria-hidden="true">🌿</span>
            <p>Nenhum Pokémon encontrado neste habitat.</p>
          </div>
        )}

        {/* Grid de Pokémons */}
        {!loading && !error && data && data.length > 0 && (
          <ul className="bioma-grid" aria-label={`Lista de Pokémons do bioma ${label}`}>
            {data.map((pk) => (
              <BiomaPokeCard key={pk.id} id={pk.id} name={pk.name} />
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}