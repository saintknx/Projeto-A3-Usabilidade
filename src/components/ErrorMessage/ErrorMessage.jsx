import "./ErrorMessage.css";

/**
 * Mensagem de erro reutilizável com botão de retry.
 * Usado em todas as telas que consomem a API.
 *
 * Props:
 * - message  → texto do erro
 * - onRetry  → função chamada ao clicar em "Tentar novamente"
 */
export default function ErrorMessage({ message, onRetry }) {
  return (
    <div
      className="error-wrap"
      role="alert"
      aria-live="assertive"
    >
      <span className="error-icon" aria-hidden="true">⚠️</span>
      <p className="error-text">{message || "Algo deu errado."}</p>
      {onRetry && (
        <button
          className="error-retry"
          onClick={onRetry}
          aria-label="Tentar buscar os dados novamente"
        >
          Tentar novamente
        </button>
      )}
    </div>
  );
}