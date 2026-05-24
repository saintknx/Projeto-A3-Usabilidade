import { useParams, useNavigate } from "react-router-dom";
import "./PokemonPage.css";
import { usePokemon }        from "../../hooks/usePokemon";
import { usePokemonSpecies } from "../../hooks/usePokemonSpecies";
import LoadingSpinner        from "../../components/LoadingSpinner/LoadingSpinner";
import ErrorMessage          from "../../components/ErrorMessage/ErrorMessage";
import TypeBadge             from "../../components/TypeBadge/TypeBadge";
import StatBar               from "../../components/StatBar/StatBar";
import { getOfficialArtUrl, getSpriteUrl, getShowdownSpriteUrl } from "../../utils/sprites";
import { HABITAT_LABELS_PT } from "../../data/biomas";

/**
 * PokemonPage — página completa de detalhes de um Pokémon.
 * Rota: /pokemon/:id
 *
 * Consome: usePokemon + usePokemonSpecies
 * Exibe: sprite animado, tipos, stats, habilidades, descrição, habitat
 */
export default function PokemonPage() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const { data: poke,    loading: pokeLoading,    error: pokeError    } = usePokemon(id);
  const { data: species, loading: speciesLoading, error: speciesError } = usePokemonSpecies(id);

  const loading = pokeLoading || speciesLoading;
  const error   = pokeError  || speciesError;

  // Cor de fundo baseada no tipo principal
  const tipoPrincipal = poke?.types?.[0]?.type?.name;

  return (
    <div className="pokemon-layout">

      {/* Header com botão voltar */}
      <header className="pokemon-header">
        <button
          className="btn-voltar"
          onClick={() => navigate(-1)}
          aria-label="Voltar à página anterior"
        >
          ← Voltar
        </button>
        {poke && (
          <span className="pokemon-header-name">
            {poke.name} · #{String(poke.id).padStart(3, "0")}
          </span>
        )}
      </header>

      {/* Conteúdo */}
      <main className="pokemon-content" aria-label={`Detalhes de ${poke?.name || "Pokémon"}`}>

        {/* Loading */}
        {loading && <LoadingSpinner message="Carregando detalhes do Pokémon..." />}

        {/* Erro */}
        {error && !loading && (
          <ErrorMessage
            message={error}
            onRetry={() => window.location.reload()}
          />
        )}

        {/* Dados carregados */}
        {poke && species && !loading && !error && (
          <div className="pokemon-card-full">

            {/* Coluna esquerda — sprite e info básica */}
            <section className="pokemon-col-left" aria-label="Informações do Pokémon">
              <div
                className="pokemon-sprite-wrap"
                style={{ "--tipo-cor": `var(--tipo-${tipoPrincipal}, #2a2a3d)` }}
              >
                <img
                  className="pokemon-sprite-animated"
                  src={getShowdownSpriteUrl(poke.id)}
                  alt={`Sprite animado de ${poke.name}`}
                  onError={(e) => {
                    e.target.src = getOfficialArtUrl(poke.id);
                    e.target.onError = () => { e.target.src = getSpriteUrl(poke.id); };
                  }}
                />
                <img
                  className="pokemon-artwork"
                  src={getOfficialArtUrl(poke.id)}
                  alt={`Arte oficial de ${poke.name}`}
                  onError={(e) => { e.target.src = getSpriteUrl(poke.id); }}
                />
              </div>

              <div className="pokemon-basic-info">
                <span className="pokemon-number">
                  #{String(poke.id).padStart(3, "0")}
                </span>
                <h1 className="pokemon-name">{poke.name}</h1>

                {/* Badges de status */}
                <div className="pokemon-badges">
                  {species.isLendario && <span className="badge lendario">⭐ Lendário</span>}
                  {species.isMitico   && <span className="badge mitico">✨ Mítico</span>}
                </div>

                {/* Tipos */}
                <div className="pokemon-types" aria-label="Tipos do Pokémon">
                  {poke.types.map((t) => (
                    <TypeBadge key={t.type.name} type={t.type.name} />
                  ))}
                </div>

                {/* Descrição */}
                {species.descricao && (
                  <blockquote className="pokemon-desc">
                    "{species.descricao}"
                  </blockquote>
                )}

                {/* Habitat */}
                {species.habitat && (
                  <p className="pokemon-habitat">
                    🌿 Habitat: {HABITAT_LABELS_PT[species.habitat] || species.habitat}
                  </p>
                )}

                {/* Medidas */}
                <div className="pokemon-medidas">
                  <div className="medida-item">
                    <span className="medida-label">Altura</span>
                    <span className="medida-valor">{(poke.height / 10).toFixed(1)}m</span>
                  </div>
                  <div className="medida-item">
                    <span className="medida-label">Peso</span>
                    <span className="medida-valor">{(poke.weight / 10).toFixed(1)}kg</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Coluna direita — stats e habilidades */}
            <section className="pokemon-col-right" aria-label="Estatísticas e habilidades">

              {/* Stats */}
              <div className="pokemon-section">
                <h2 className="section-title">Estatísticas base</h2>
                {poke.stats.map((s) => (
                  <StatBar key={s.stat.name} name={s.stat.name} value={s.base_stat} />
                ))}
              </div>

              {/* Habilidades */}
              <div className="pokemon-section">
                <h2 className="section-title">Habilidades</h2>
                <div className="habilidades-list">
                  {poke.abilities.map((a) => (
                    <span
                      key={a.ability.name}
                      className={`habilidade-chip ${a.is_hidden ? "oculta" : ""}`}
                      aria-label={`Habilidade ${a.ability.name}${a.is_hidden ? ", habilidade oculta" : ""}`}
                    >
                      {a.ability.name}
                      {a.is_hidden && <span className="oculta-label"> (oculta)</span>}
                    </span>
                  ))}
                </div>
              </div>

              {/* Moves (primeiros 10) */}
              <div className="pokemon-section">
                <h2 className="section-title">Movimentos ({poke.moves.length} no total)</h2>
                <div className="moves-list">
                  {poke.moves.slice(0, 12).map((m) => (
                    <span key={m.move.name} className="move-chip">
                      {m.move.name}
                    </span>
                  ))}
                  {poke.moves.length > 12 && (
                    <span className="move-chip mais">
                      +{poke.moves.length - 12} mais
                    </span>
                  )}
                </div>
              </div>

            </section>
          </div>
        )}
      </main>
    </div>
  );
}