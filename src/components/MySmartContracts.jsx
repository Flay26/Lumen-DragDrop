import { useState } from 'react';
import { CONTRACT_TYPES } from '../constants.js';

export function MySmartContracts({ contracts, onDeleteContract, onBackToHome }) {
  const [selectedContract, setSelectedContract] = useState(null);

  if (contracts.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📄</div>
          <h2 style={styles.emptyTitle}>No Smart Contracts Yet</h2>
          <p style={styles.emptyText}>
            Create your first smart contract by designing it on the canvas and clicking
            "Create Smart Contract" in the summary view.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div>
            <h1 style={styles.title}>My Smart Contracts</h1>
            <p style={styles.subtitle}>
              {contracts.length} {contracts.length === 1 ? 'contract' : 'contracts'} created
            </p>
          </div>
          {onBackToHome && (
            <button
              type="button"
              style={styles.backButton}
              onClick={onBackToHome}
            >
              ← Back to Home
            </button>
          )}
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.listContainer}>
          <div style={styles.list}>
            {contracts.map((contract) => (
              <div
                key={contract.id}
                style={{
                  ...styles.contractCard,
                  ...(selectedContract?.id === contract.id
                    ? styles.contractCardSelected
                    : {}),
                }}
                onClick={() => setSelectedContract(contract)}
              >
                <div style={styles.cardHeader}>
                  <div style={styles.cardTitleRow}>
                    <div style={styles.contractTypeBadge}>
                      {contract.contractType === CONTRACT_TYPES.ERC20 ? 'ERC-20' : 'ERC-721'}
                    </div>
                    <h3 style={styles.cardTitle}>
                      {contract.contractType === CONTRACT_TYPES.ERC20
                        ? contract.baseBlock?.fields?.tokenName || 'Unnamed Token'
                        : contract.baseBlock?.fields?.collectionName || 'Unnamed Collection'}
                    </h3>
                  </div>
                  <button
                    type="button"
                    style={styles.deleteButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (
                        window.confirm(
                          'Are you sure you want to delete this smart contract?',
                        )
                      ) {
                        onDeleteContract(contract.id);
                        if (selectedContract?.id === contract.id) {
                          setSelectedContract(null);
                        }
                      }
                    }}
                  >
                    ×
                  </button>
                </div>
                <div style={styles.cardMeta}>
                  <span style={styles.cardMetaItem}>
                    {contract.baseBlock
                      ? `${contract.optionalBlocks?.length || 0} optional feature${
                          (contract.optionalBlocks?.length || 0) !== 1 ? 's' : ''
                        }`
                      : 'Incomplete'}
                  </span>
                  <span style={styles.cardMetaItem}>
                    {new Date(contract.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedContract && (
          <div style={styles.detailPanel}>
            <div style={styles.detailHeader}>
              <h2 style={styles.detailTitle}>Contract Details</h2>
              <button
                type="button"
                style={styles.closeDetailButton}
                onClick={() => setSelectedContract(null)}
              >
                ×
              </button>
            </div>
            <div style={styles.detailContent}>
              <section style={styles.detailSection}>
                <h3 style={styles.detailSectionTitle}>Contract Type</h3>
                <p style={styles.detailText}>
                  {selectedContract.contractType === CONTRACT_TYPES.ERC20
                    ? 'ERC-20 Token'
                    : 'ERC-721 NFT Collection'}
                </p>
              </section>

              {selectedContract.baseBlock && (
                <>
                  <section style={styles.detailSection}>
                    <h3 style={styles.detailSectionTitle}>
                      {selectedContract.contractType === CONTRACT_TYPES.ERC20
                        ? 'Token Details'
                        : 'NFT Details'}
                    </h3>
                    {selectedContract.contractType === CONTRACT_TYPES.ERC20 ? (
                      <ul style={styles.detailList}>
                        <li style={styles.detailListItem}>
                          <strong>Name:</strong>{' '}
                          {selectedContract.baseBlock.fields.tokenName || 'Not set'}
                        </li>
                        <li style={styles.detailListItem}>
                          <strong>Symbol:</strong>{' '}
                          {selectedContract.baseBlock.fields.symbol || 'Not set'}
                        </li>
                        <li style={styles.detailListItem}>
                          <strong>Total supply:</strong>{' '}
                          {selectedContract.baseBlock.fields.totalSupply || 'Not set'}
                        </li>
                        <li style={styles.detailListItem}>
                          <strong>Decimals:</strong>{' '}
                          {selectedContract.baseBlock.fields.decimals ?? 18}
                        </li>
                      </ul>
                    ) : (
                      <ul style={styles.detailList}>
                        <li style={styles.detailListItem}>
                          <strong>Collection name:</strong>{' '}
                          {selectedContract.baseBlock.fields.collectionName || 'Not set'}
                        </li>
                        <li style={styles.detailListItem}>
                          <strong>Symbol:</strong>{' '}
                          {selectedContract.baseBlock.fields.symbol || 'Not set'}
                        </li>
                        <li style={styles.detailListItem}>
                          <strong>Base URI:</strong>{' '}
                          {selectedContract.baseBlock.fields.baseUri || 'Not set'}
                        </li>
                      </ul>
                    )}
                  </section>

                  {selectedContract.optionalBlocks &&
                    selectedContract.optionalBlocks.length > 0 && (
                      <section style={styles.detailSection}>
                        <h3 style={styles.detailSectionTitle}>Optional Features</h3>
                        <ul style={styles.detailList}>
                          {selectedContract.optionalBlocks.map((block) => (
                            <li key={block.id} style={styles.detailListItem}>
                              <strong>{block.title}:</strong>{' '}
                              {block.summary ||
                                'Added, but details have not been filled out yet.'}
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}
                </>
              )}

              <section style={styles.detailSection}>
                <h3 style={styles.detailSectionTitle}>Created</h3>
                <p style={styles.detailText}>
                  {new Date(selectedContract.createdAt).toLocaleString()}
                </p>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '24px',
    maxWidth: 1200,
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box',
  },
  header: {
    marginBottom: '24px',
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '16px',
  },
  backButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    borderRadius: '999px',
    border: '1px solid #c7d2fe',
    padding: '8px 16px',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    backgroundColor: 'transparent',
    color: '#1e3a8a',
    transition:
      'background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease',
  },
  title: {
    margin: '0 0 4px',
    fontSize: '28px',
    fontWeight: 600,
    color: '#0f172a',
  },
  subtitle: {
    margin: 0,
    fontSize: '14px',
    color: '#64748b',
  },
  content: {
    flex: 1,
    display: 'flex',
    gap: '24px',
    minHeight: 0,
  },
  listContainer: {
    flex: '0 0 400px',
    minWidth: 0,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    maxHeight: 'calc(100vh - 200px)',
    overflowY: 'auto',
    paddingRight: '8px',
  },
  contractCard: {
    padding: '16px',
    borderRadius: '12px',
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  contractCardSelected: {
    borderColor: '#2563eb',
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
    background: '#f8faff',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '8px',
  },
  cardTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flex: 1,
    minWidth: 0,
  },
  contractTypeBadge: {
    padding: '2px 8px',
    borderRadius: '999px',
    background: '#eff6ff',
    border: '1px solid #bfdbfe',
    fontSize: '11px',
    fontWeight: 600,
    color: '#1d4ed8',
    whiteSpace: 'nowrap',
  },
  cardTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 600,
    color: '#0f172a',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  deleteButton: {
    border: 'none',
    background: 'transparent',
    fontSize: '20px',
    lineHeight: 1,
    cursor: 'pointer',
    color: '#9ca3af',
    padding: '0',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    flexShrink: 0,
  },
  cardMeta: {
    display: 'flex',
    gap: '12px',
    fontSize: '12px',
    color: '#6b7280',
  },
  cardMetaItem: {
    fontSize: '12px',
    color: '#6b7280',
  },
  detailPanel: {
    flex: 1,
    background: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: 'calc(100vh - 200px)',
    overflow: 'hidden',
  },
  detailHeader: {
    padding: '16px 20px',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailTitle: {
    margin: 0,
    fontSize: '20px',
    fontWeight: 600,
    color: '#0f172a',
  },
  closeDetailButton: {
    border: 'none',
    background: 'transparent',
    fontSize: '22px',
    lineHeight: 1,
    cursor: 'pointer',
    color: '#6b7280',
    padding: 0,
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
  },
  detailContent: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
  },
  detailSection: {
    marginBottom: '24px',
  },
  detailSectionTitle: {
    margin: '0 0 8px',
    fontSize: '16px',
    fontWeight: 600,
    color: '#0f172a',
  },
  detailText: {
    margin: 0,
    fontSize: '14px',
    color: '#374151',
  },
  detailList: {
    paddingLeft: '20px',
    margin: 0,
    fontSize: '14px',
    color: '#374151',
  },
  detailListItem: {
    marginBottom: '6px',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 24px',
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '16px',
  },
  emptyTitle: {
    margin: '0 0 8px',
    fontSize: '24px',
    fontWeight: 600,
    color: '#0f172a',
  },
  emptyText: {
    margin: 0,
    fontSize: '14px',
    color: '#6b7280',
    maxWidth: 400,
  },
};

