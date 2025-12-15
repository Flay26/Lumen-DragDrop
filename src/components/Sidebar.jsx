import { CONTRACT_TYPES, ERC20_BLOCKS, ERC721_BLOCKS } from '../constants.js';

export function Sidebar({
  contractType,
  hasBaseBlock,
  onStartDragBase,
  onStartDragOptional,
  draggingEnabled,
  onShowBlockedMessage,
}) {
  const { baseBlockDef, optionalBlocks } = getBlocksForType(contractType);

  if (!contractType) {
    return (
      <aside style={styles.sidebar}>
        <h2 style={styles.heading}>Blocks</h2>
        <p style={styles.hint}>Choose a contract type to see available blocks.</p>
      </aside>
    );
  }

  const handleDragStartBase = (event) => {
    if (!draggingEnabled) {
      event.preventDefault();
      if (onShowBlockedMessage) {
        onShowBlockedMessage('Choose a contract type to begin.');
      }
      return;
    }
    if (!baseBlockDef) return;
    event.dataTransfer.setData(
      'application/json',
      JSON.stringify({ source: 'sidebar', kind: 'base', key: baseBlockDef.key }),
    );
    if (onStartDragBase) onStartDragBase();
  };

  const handleDragStartOptional = (event, block) => {
    if (!hasBaseBlock) {
      event.preventDefault();
      if (onShowBlockedMessage) {
        onShowBlockedMessage('Add Token/NFT Details first.');
      }
      return;
    }
    event.dataTransfer.setData(
      'application/json',
      JSON.stringify({ source: 'sidebar', kind: 'optional', key: block.key }),
    );
    if (onStartDragOptional) onStartDragOptional(block.key);
  };

  return (
    <aside style={styles.sidebar}>
      <h2 style={styles.heading}>Blocks</h2>
      {baseBlockDef && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Required</h3>
          <div
            draggable={!hasBaseBlock}
            onDragStart={handleDragStartBase}
            style={{
              ...styles.blockCard,
              ...(hasBaseBlock ? styles.blockCardDisabled : {}),
            }}
          >
            <div style={styles.blockTitle}>{baseBlockDef.title}</div>
            <p style={styles.blockDescription}>{baseBlockDef.description}</p>
            {hasBaseBlock && (
              <p style={styles.blockHint}>Already added to canvas.</p>
            )}
          </div>
        </div>
      )}

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Optional Features</h3>
        {!hasBaseBlock && (
          <p style={styles.hintSmall}>
            Add {baseBlockDef ? baseBlockDef.title : 'the base block'} first to
            unlock optional features.
          </p>
        )}
        <div style={styles.optionalList}>
          {optionalBlocks.map((block) => (
            <div
              key={block.key}
              draggable={hasBaseBlock}
              onDragStart={(event) => handleDragStartOptional(event, block)}
              style={{
                ...styles.blockCard,
                ...(!hasBaseBlock ? styles.blockCardDisabled : {}),
              }}
            >
              <div style={styles.blockTitle}>{block.title}</div>
              <p style={styles.blockDescription}>{block.description}</p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

function getBlocksForType(contractType) {
  if (contractType === CONTRACT_TYPES.ERC20) {
    return { baseBlockDef: ERC20_BLOCKS.BASE, optionalBlocks: ERC20_BLOCKS.OPTIONAL };
  }
  if (contractType === CONTRACT_TYPES.ERC721) {
    return { baseBlockDef: ERC721_BLOCKS.BASE, optionalBlocks: ERC721_BLOCKS.OPTIONAL };
  }
  return { baseBlockDef: null, optionalBlocks: [] };
}

const styles = {
  sidebar: {
    width: '280px',
    borderRight: '1px solid #dbeafe',
    padding: '16px 14px 16px 16px',
    boxSizing: 'border-box',
    overflowY: 'auto',
    background: 'rgba(255,255,255,0.92)',
    backdropFilter: 'blur(6px)',
  },
  heading: {
    margin: '0 0 8px',
    fontSize: '18px',
    color: '#1e3a8a',
  },
  section: {
    marginTop: '16px',
  },
  sectionTitle: {
    margin: '0 0 8px',
    fontSize: '14px',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    color: '#60a5fa',
  },
  blockCard: {
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '10px 12px',
    marginBottom: '8px',
    background: '#ffffff',
    cursor: 'grab',
    fontSize: '13px',
    boxShadow: '0 4px 12px rgba(148, 163, 184, 0.18)',
    transition:
      'border-color 0.12s ease, box-shadow 0.12s ease, transform 0.08s ease',
  },
  blockCardDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  blockTitle: {
    fontWeight: 600,
    marginBottom: '4px',
    color: '#0f172a',
  },
  blockDescription: {
    margin: 0,
    color: '#4b5563',
  },
  blockHint: {
    margin: '6px 0 0',
    fontSize: '11px',
    color: '#6b7280',
  },
  hint: {
    margin: 0,
    fontSize: '13px',
    color: '#4b5563',
  },
  hintSmall: {
    margin: '0 0 8px',
    fontSize: '12px',
    color: '#6b7280',
  },
  optionalList: {
    marginTop: '4px',
  },
};


