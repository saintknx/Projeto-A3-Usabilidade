import "./TypeBadge.css";
import { TYPE_COLORS, TYPE_LABELS_PT } from "../../utils/typeColors";

/**
 * Badge colorido que exibe o tipo de um Pokémon.
 * Reutilizado em: MapPage, BiomaPage, PokemonPage, PokemonCard.
 *
 * Props:
 * - type - string com o tipo em inglês (ex: "fire", "water")
 *
 * 
 */
export default function TypeBadge({ type }) {
  const cor   = TYPE_COLORS[type] || "#888";
  const label = TYPE_LABELS_PT[type] || type;

  return (
    <span
      className="type-badge"
      style={{ background: cor }}
      aria-label={`Tipo ${label}`}
    >
      {label}
    </span>
  );
}