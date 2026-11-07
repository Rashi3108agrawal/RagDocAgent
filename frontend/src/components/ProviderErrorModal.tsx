import { useI18n } from '../lib/i18n'

/** Detects provider-side failures worth explaining in a friendly modal:
 *  exhausted balance (429), quota, invalid/missing API key (401/403). */
export function isProviderError(text: string | undefined | null): boolean {
  if (!text) return false
  return /insufficient balance|please recharge|error code:\s*429|status code:\s*429|баланс|пополн|quota|api key|unauthorized|error code:\s*401|error code:\s*403/i.test(
    text,
  )
}

/** Explains common provider authentication, quota, and balance failures. */
export function ProviderErrorModal({
  message,
  onClose,
}: {
  message: string
  onClose: () => void
}) {
  const { t } = useI18n()

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box modal-box-center" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">{t('providerErrorTitle')}</h3>
        <p className="modal-desc">{t('providerErrorBody')}</p>
        <details className="provider-error-detail">
          <summary>{t('providerErrorDetails')}</summary>
          <pre>
            <code>{message.slice(0, 500)}</code>
          </pre>
        </details>
        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            {t('providerErrorClose')}
          </button>
        </div>
      </div>
    </div>
  )
}
