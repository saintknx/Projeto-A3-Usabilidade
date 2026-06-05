import "./TypeBadge.css";
import { TYPE_COLORS, TYPE_LABELS_PT } from "../../utils/typeColors";

// Calcula luminância relativa e decide se texto deve ser escuro
function textoEscuro(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const toLinear = (c) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  const L = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  return L > 0.35; // limiar — acima disso texto escuro garante contraste
}

export default function TypeBadge({ type }) {
  const cor     = TYPE_COLORS[type] || "#888888";
  const label   = TYPE_LABELS_PT[type] || type;
  const escuro  = textoEscuro(cor);

  return (
    <span
      className="type-badge"
      style={{
        background: cor,
        color: escuro ? "#1a1a1a" : "#ffffff",
        textShadow: escuro ? "none" : "0 1px 2px rgba(0,0,0,0.4)",
      }}
      aria-label={`Tipo ${label}`}
    >
      {label}
    </span>
  );
}