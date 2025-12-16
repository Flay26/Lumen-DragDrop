import { CONTRACT_TYPES } from '../constants.js';

export function SummaryPanel({
  isOpen,
  onClose,
  contractType,
  baseBlock,
  optionalBlocks,
  onCreateContract,
}) {
  if (!isOpen) return null;

  const hasBase = !!baseBlock;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div style={styles.overlay} onClick={handleOverlayClick}>
      <div style={styles.panel}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>Contract Summary</h2>
            <p style={styles.subtitle}>
              A simple, beginner-friendly overview of what you&apos;ve set up so far.
            </p>
          </div>
          <button type="button" style={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>
        <div style={styles.content}>
          {!contractType && (
            <p style={styles.textMuted}>
              Choose a contract type to see a summary.
            </p>
          )}

          {contractType && (
            <>
              <section style={styles.section}>
                <h3 style={styles.sectionTitle}>Contract Type</h3>
                <p style={styles.text}>
                  You are building an{' '}
                  {contractType === CONTRACT_TYPES.ERC20
                    ? 'ERC-20 token. This works like a digital balance that people can send, receive, or use like points.'
                    : 'ERC-721 NFT collection. This is for unique digital items, like artwork or collectibles, where each piece is one of a kind.'}
                </p>
              </section>

              {hasBase && (
                <section style={styles.section}>
                  <h3 style={styles.sectionTitle}>
                    {contractType === CONTRACT_TYPES.ERC20
                      ? 'Token Details'
                      : 'NFT Details'}
                  </h3>
                  {contractType === CONTRACT_TYPES.ERC20 ? (
                    <ul style={styles.list}>
                      <li style={styles.listItem}>
                        <strong>Name:</strong>{' '}
                        {baseBlock.fields.tokenName || 'Not set yet'}
                      </li>
                      <li style={styles.listItem}>
                        <strong>Symbol:</strong>{' '}
                        {baseBlock.fields.symbol || 'Not set yet'}
                      </li>
                      <li style={styles.listItem}>
                        <strong>Total supply:</strong>{' '}
                        {baseBlock.fields.totalSupply || 'Not set yet'}
                      </li>
                      <li style={styles.listItem}>
                        <strong>Decimals:</strong>{' '}
                        {baseBlock.fields.decimals ?? 18}
                      </li>
                    </ul>
                  ) : (
                    <ul style={styles.list}>
                      <li style={styles.listItem}>
                        <strong>Collection name:</strong>{' '}
                        {baseBlock.fields.collectionName || 'Not set yet'}
                      </li>
                      <li style={styles.listItem}>
                        <strong>Symbol:</strong>{' '}
                        {baseBlock.fields.symbol || 'Not set yet'}
                      </li>
                      <li style={styles.listItem}>
                        <strong>Base URI:</strong>{' '}
                        {baseBlock.fields.baseUri || 'Not set yet'}
                      </li>
                    </ul>
                  )}
                </section>
              )}

              {optionalBlocks.length > 0 && (
                <section style={styles.section}>
                  <h3 style={styles.sectionTitle}>Optional Features</h3>
                  <p style={styles.text}>
                    These extra features change how your token or NFTs behave. They
                    are listed in the same order as they appear on your canvas.
                  </p>
                  <ul style={styles.list}>
                    {optionalBlocks.map((block) => (
                      <li key={block.id} style={styles.listItem}>
                        <strong>{block.title}:</strong>{' '}
                        {block.summary ||
                          'Added, but details have not been filled out yet.'}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {hasBase && optionalBlocks.length === 0 && (
                <section style={styles.section}>
                  <h3 style={styles.sectionTitle}>Optional Features</h3>
                  <p style={styles.textMuted}>
                    No optional features have been added yet. You can drag blocks
                    from the sidebar to see them here.
                  </p>
                </section>
              )}

              {!hasBase && contractType && (
                <section style={styles.section}>
                  <h3 style={styles.sectionTitle}>Getting Started</h3>
                  <p style={styles.text}>
                    Drag the required details block onto the canvas first. This
                    tells the system what you&apos;re creating and unlocks all other
                    options.
                  </p>
                </section>
              )}
            </>
          )}
        </div>
        {contractType && hasBase && (
          <div style={styles.footer}>
            <button
              type="button"
              style={styles.createButton}
              onClick={() => {
                if (onCreateContract) {
                  onCreateContract();
                }
              }}
            >
              Create Smart Contract
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '16px',
    boxSizing: 'border-box',
    background: 'rgba(15, 23, 42, 0.45)',
    zIndex: 50,
    cursor: 'pointer',
  },
  panel: {
    width: '960px',
    maxWidth: '100%',
    maxHeight: '90vh',
    background: '#f9fafb',
    borderRadius: '14px',
    boxShadow: '0 24px 60px rgba(15,23,42,0.5)',
    overflow: 'hidden',
    pointerEvents: 'auto',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'default',
  },
  header: {
    padding: '16px 20px',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '12px',
  },
  title: {
    margin: '0 0 4px',
    fontSize: '20px',
    color: '#0f172a',
  },
  subtitle: {
    margin: 0,
    fontSize: '13px',
    color: '#4b5563',
  },
  closeButton: {
    border: 'none',
    background: 'transparent',
    fontSize: '22px',
    lineHeight: 1,
    cursor: 'pointer',
    color: '#6b7280',
  },
  content: {
    padding: '16px 20px 20px',
    overflowY: 'auto',
  },
  section: {
    marginBottom: '16px',
  },
  sectionTitle: {
    margin: '0 0 6px',
    fontSize: '15px',
  },
  text: {
    margin: 0,
    fontSize: '13px',
    color: '#111827',
  },
  textMuted: {
    margin: 0,
    fontSize: '13px',
    color: '#6b7280',
  },
  list: {
    paddingLeft: '16px',
    margin: '4px 0 0',
    fontSize: '13px',
    color: '#111827',
  },
  listItem: {
    marginBottom: '4px',
  },
  footer: {
    padding: '16px 20px',
    borderTop: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'flex-end',
    background: '#ffffff',
  },
  createButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    borderRadius: '999px',
    border: '1px solid #1d4ed8',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    boxShadow: '0 8px 18px rgba(37, 99, 235, 0.35)',
    transition:
      'background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease, transform 0.08s ease',
  },
};


