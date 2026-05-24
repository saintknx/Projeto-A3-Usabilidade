import "./StatBar.css";
import { STAT_LABELS_PT } from "../../utils/typeColors";

/**
 * Barra de stat animada com cor dinâmica.
 * Reutilizada em: PokemonPage, PokemonCard (sidebar do mapa).
 *
 * Props:
 * - name - nome do stat em inglês (ex: "attack")
 * - value - valor numérico do stat (0–255)
 *
 */
export default function StatBar({ name, value }) {
  const pct   = Math.min((value / 255) * 100, 100);
  const label = STAT_LABELS_PT[name] || name;
  const color =
    value >= 100 ? "var(--hp-good)" :
    value >= 60  ? "var(--hp-mid)"  :
                  "var(--hp-low)";

  return (
    <div
      className="stat-row"
      role="meter"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={255}
      aria-label={`${label}: ${value}`}
    >
      <span className="stat-name">{label}</span>
      <span className="stat-value">{value}</span>
      <div className="stat-bar-wrap">
        <div
          className="stat-bar-fill"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}