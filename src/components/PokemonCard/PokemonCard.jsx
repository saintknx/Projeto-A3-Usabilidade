import { useNavigate } from "react-router-dom";
import "./PokemonCard.css";
import TypeBadge from "../TypeBadge/TypeBadge";
import { getOfficialArtUrl, getSpriteUrl } from "../../utils/sprites";

/**
 * Card reutilizável de Pokémon.
 * Reutilizado em: BiomaPage (grid), MapPage (sidebar).
 *
 * Props:
 * - id      - ID do Pokémon
 * - name    - nome do Pokémon
 * - types   - array de tipos (ex: ["fire", "flying"])
 * - onClick - função opcional — se não passado, navega para /pokemon/:id
 */
export default function PokemonCard({ id, name, types = [], onClick }) {
  const navigate = useNavigate();
  const numero   = String(id).padStart(3, "0");

  function handleClick() {
    if (onClick) onClick(id);
    else navigate(`/pokemon/${id}`);
  }

  return (
    <article
      className="pokemon-card"
      onClick={handleClick}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      tabIndex={0}
      role="button"
      aria-label={`Ver detalhes de ${name}, número ${numero}`}
    >
      <div className="pokemon-card-img-wrap">
        <img
          className="pokemon-card-img"
          src={getOfficialArtUrl(id)}
          alt={`Sprite de ${name}`}
          onError={(e) => { e.target.src = getSpriteUrl(id); }}
          loading="lazy"
        />
      </div>

      <div className="pokemon-card-body">
        <span className="pokemon-card-number">#{numero}</span>
        <h2 className="pokemon-card-name">{name}</h2>
        <div className="pokemon-card-types">
          {types.map((t) => (
            <TypeBadge key={t} type={t} />
          ))}
        </div>
      </div>
    </article>
  );
}