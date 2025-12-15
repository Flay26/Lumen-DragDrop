import { useState } from 'react';

export function Canvas({
  contractType,
  baseBlock,
  optionalBlocks,
  onDropFromSidebar,
  onSelectOptionalBlock,
  onReorderOptionalBlock,
  onAttemptMoveBase,
  onUpdateBaseFields,
  onDeleteOptionalBlock,
}) {
  const hasBaseBlock = !!baseBlock;

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const raw = event.dataTransfer.getData('application/json');
    if (!raw) return;
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      return;
    }
    if (data.source === 'sidebar') {
      onDropFromSidebar(data);
    } else if (data.source === 'canvas' && data.kind === 'optional') {
      const targetIndex =
        typeof event.currentTarget.dataset.index !== 'undefined'
          ? Number(event.currentTarget.dataset.index)
          : optionalBlocks.length;
      onReorderOptionalBlock(data.blockId, targetIndex);
    }
  };

  const handleDragStartOptionalExisting = (event, blockId) => {
    event.dataTransfer.setData(
      'application/json',
      JSON.stringify({ source: 'canvas', kind: 'optional', blockId }),
    );
  };

  return (
    <section style={styles.canvasWrapper}>
      <div
        style={{
          ...styles.canvas,
          ...(hasBaseBlock ? {} : styles.canvasEmpty),
        }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {!hasBaseBlock && (
          <div style={styles.placeholder}>
            <p style={styles.placeholderText}>
              Drag the required Token/NFT Details block here to begin.
            </p>
          </div>
        )}

        {hasBaseBlock && (
          <div style={styles.block}>
            <div style={styles.blockHeader}>
              <div>
                <div style={styles.blockTitle}>
                  {contractType === 'ERC20' ? 'Token Details' : 'NFT Details'}
                </div>
                <div style={styles.blockTag}>Required base block</div>
              </div>
              <button
                type="button"
                style={styles.blockActionDisabled}
                onClick={onAttemptMoveBase}
              >
                Base locked
              </button>
            </div>
            <BaseBlockForm
              baseBlock={baseBlock}
              onUpdateBaseFields={onUpdateBaseFields}
            />
          </div>
        )}

        {hasBaseBlock && optionalBlocks.length > 0 && (
          <div style={styles.optionalStack}>
            {optionalBlocks.map((block, index) => (
              <div key={block.id}>
                <div
                  data-index={index}
                  style={styles.dropZone}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                />
                <div
                  style={styles.block}
                  draggable
                  onDragStart={(event) =>
                    handleDragStartOptionalExisting(event, block.id)
                  }
                  onClick={() => onSelectOptionalBlock(block.id)}
                >
                  <div style={styles.blockHeader}>
                    <div>
                      <div style={styles.blockTitle}>{block.title}</div>
                      <div style={styles.blockSubtitle}>
                        {block.description}
                      </div>
                    </div>
                    <div style={styles.blockHeaderRight}>
                      <span style={styles.dragHint}>Drag to reorder</span>
                      <button
                        type="button"
                        style={styles.deleteButton}
                        onClick={(event) => {
                          event.stopPropagation();
                          if (!onDeleteOptionalBlock) return;
                          const confirmed = window.confirm(
                            'Are you sure you want to remove this block?',
                          );
                          if (confirmed) {
                            onDeleteOptionalBlock(block.id);
                          }
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  {block.summary ? (
                    <div style={styles.blockSummary}>{block.summary}</div>
                  ) : (
                    <div style={styles.blockSummaryMuted}>
                      No settings saved yet. Click to edit.
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div
              data-index={optionalBlocks.length}
              style={styles.dropZoneTail}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
          </div>
        )}
      </div>
    </section>
  );
}

function BaseBlockForm({ baseBlock, onUpdateBaseFields }) {
  const { fields } = baseBlock;
  const [errors, setErrors] = useState({});

  const handleFieldChange = (key, value) => {
    if (!onUpdateBaseFields) return;
    const validationError = validateBaseField(key, value);
    setErrors((prev) => ({ ...prev, [key]: validationError }));
    onUpdateBaseFields({ [key]: value });
  };

  return (
    <div style={styles.baseForm}>
      {'tokenName' in fields ? (
        <>
          <LabeledField
            label="Token Name"
            value={fields.tokenName || ''}
            placeholder="Example: Lumen Token"
            onChange={(value) => handleFieldChange('tokenName', value)}
            error={errors.tokenName}
          />
          <LabeledField
            label="Symbol"
            value={fields.symbol || ''}
            placeholder="Example: LUMEN"
            onChange={(value) => handleFieldChange('symbol', value)}
            error={errors.symbol}
          />
          <LabeledField
            label="Total Supply"
            value={fields.totalSupply || ''}
            placeholder="Example: 1,000,000"
            onChange={(value) => handleFieldChange('totalSupply', value)}
            error={errors.totalSupply}
          />
          <LabeledField
            label="Decimals"
            value={fields.decimals ?? 18}
            placeholder="18"
            onChange={(value) => handleFieldChange('decimals', value)}
            error={errors.decimals}
          />
        </>
      ) : (
        <>
          <LabeledField
            label="Collection Name"
            value={fields.collectionName || ''}
            placeholder="Example: Lumen Collectibles"
            onChange={(value) => handleFieldChange('collectionName', value)}
            error={errors.collectionName}
          />
          <LabeledField
            label="Symbol"
            value={fields.symbol || ''}
            placeholder="Example: LUMEN"
            onChange={(value) => handleFieldChange('symbol', value)}
            error={errors.symbol}
          />
          <LabeledField
            label="Base URI"
            value={fields.baseUri || ''}
            placeholder="Example: https://example.com/metadata/"
            onChange={(value) => handleFieldChange('baseUri', value)}
            error={errors.baseUri}
          />
        </>
      )}
      <p style={styles.baseHint}>
        These details are for your prototype only and do not create a real smart contract.
      </p>
    </div>
  );
}

function validateBaseField(key, rawValue) {
  const value = String(rawValue ?? '').trim();
  if (key === 'tokenName') {
    if (!value) return 'Token name is required.';
    if (value.length < 1 || value.length > 50) {
      return 'Token name must be between 1 and 50 characters.';
    }
    if (!/[A-Za-z]/.test(value)) {
      return 'Token name must contain at least one letter.';
    }
  }
  if (key === 'symbol') {
    if (!value) return 'Symbol is required.';
    if (!/^[A-Z]{2,10}$/.test(value)) {
      return 'Symbol must be 2–10 uppercase letters with no spaces.';
    }
  }
  if (key === 'totalSupply') {
    if (!value) return 'Total supply is required.';
    if (!/^[0-9]+$/.test(value)) {
      return 'Total supply must be a whole number with no decimals.';
    }
    try {
      const num = BigInt(value);
      if (num <= 0n) {
        return 'Total supply must be a positive number.';
      }
      const max = BigInt('1' + '0'.repeat(30));
      if (num > max) {
        return 'Total supply must be less than or equal to 10^30 in this prototype.';
      }
    } catch {
      return 'Total supply is too large or invalid.';
    }
  }
  if (key === 'decimals') {
    if (!value && value !== '0') return 'Decimals are required.';
    if (!/^[0-9]+$/.test(value)) {
      return 'Decimals must be a whole number between 0 and 18.';
    }
    const num = Number(value);
    if (Number.isNaN(num) || num < 0 || num > 18) {
      return 'Decimals must be between 0 and 18.';
    }
  }
  if (key === 'collectionName') {
    if (!value) return 'Collection name is required.';
    if (value.length < 1 || value.length > 50) {
      return 'Collection name must be between 1 and 50 characters.';
    }
    if (!/^[A-Za-z0-9 ]+$/.test(value)) {
      return 'Collection name can only use letters, numbers, and spaces.';
    }
  }
  if (key === 'baseUri') {
    if (!value) return 'Base URI is required.';
    if (!value.endsWith('/')) {
      return 'Base URI must end with a “/”.';
    }
    if (value.startsWith('ipfs://')) {
      return null;
    }
    try {
      // eslint-disable-next-line no-new
      new URL(value);
    } catch {
      return 'Base URI must be a valid URL or IPFS link.';
    }
  }
  return null;
}

function LabeledField({ label, value, placeholder, onChange, error }) {
  return (
    <div style={styles.field}>
      <label style={styles.fieldLabel}>{label}</label>
      <input
        style={styles.fieldInput}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange && onChange(event.target.value)}
      />
      {error && <div style={styles.fieldError}>{error}</div>}
    </div>
  );
}

const styles = {
  canvasWrapper: {
    flex: 1,
    padding: '0 0 0 16px',
    boxSizing: 'border-box',
    overflowY: 'auto',
  },
  canvas: {
    minHeight: '100%',
    borderRadius: '14px',
    border: '1px dashed #bfdbfe',
    padding: '16px',
    background: 'rgba(255,255,255,0.96)',
    boxSizing: 'border-box',
    boxShadow: '0 10px 35px rgba(15, 23, 42, 0.10)',
  },
  canvasEmpty: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    textAlign: 'center',
    color: '#64748b',
  },
  placeholderText: {
    margin: 0,
  },
  block: {
    background: '#ffffff',
    borderRadius: '10px',
    border: '1px solid #e5e7eb',
    padding: '12px 14px',
    marginBottom: '10px',
    boxShadow: '0 10px 24px rgba(15,23,42,0.10)',
    cursor: 'pointer',
  },
  blockHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '8px',
  },
  blockHeaderRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  blockTitle: {
    fontWeight: 600,
    marginBottom: '2px',
    color: '#0f172a',
  },
  blockSubtitle: {
    fontSize: '12px',
    color: '#4b5563',
  },
  blockTag: {
    marginTop: '2px',
    fontSize: '11px',
    color: '#1d4ed8',
  },
  blockActionDisabled: {
    fontSize: '11px',
    background: '#eff6ff',
    borderRadius: '999px',
    border: 'none',
    padding: '4px 8px',
    color: '#1d4ed8',
    cursor: 'not-allowed',
  },
  dragHint: {
    fontSize: '11px',
    color: '#6b7280',
  },
  deleteButton: {
    borderRadius: '999px',
    border: '1px solid #fecaca',
    padding: '2px 8px',
    fontSize: '11px',
    background: '#fef2f2',
    color: '#b91c1c',
    cursor: 'pointer',
  },
  baseForm: {
    marginTop: '10px',
  },
  baseHint: {
    marginTop: '8px',
    fontSize: '11px',
    color: '#6b7280',
  },
  field: {
    marginBottom: '6px',
  },
  fieldLabel: {
    display: 'block',
    fontSize: '11px',
    marginBottom: '2px',
    color: '#4b5563',
  },
  fieldInput: {
    width: '100%',
    padding: '6px 8px',
    fontSize: '12px',
    borderRadius: '4px',
    border: '1px solid #e5e7eb',
    background: '#f9fafb',
  },
  fieldError: {
    marginTop: '2px',
    fontSize: '11px',
    color: '#b91c1c',
  },
  optionalStack: {
    marginTop: '10px',
  },
  dropZone: {
    height: '10px',
  },
  dropZoneTail: {
    height: '16px',
  },
  blockSummary: {
    marginTop: '6px',
    fontSize: '12px',
    color: '#111827',
  },
  blockSummaryMuted: {
    marginTop: '6px',
    fontSize: '12px',
    color: '#9ca3af',
  },
};


