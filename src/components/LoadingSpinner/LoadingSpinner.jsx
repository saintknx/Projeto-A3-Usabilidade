import "./LoadingSpinner.css";

/**
 * Spinner de carregamento reutilizável.
 * Usado em todas as telas que consomem a API.
 *
 * Props:
 * - message: texto exibido abaixo do spinner
 *
 * />
 */
export default function LoadingSpinner({ message = "Carregando..." }) {
  return (
    <div
      className="spinner-wrap"
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className="spinner" aria-hidden="true" />
      <p className="spinner-message">{message}</p>
    </div>
  );
}