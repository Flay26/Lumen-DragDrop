import { useState } from 'react';
import { ContractTypeSelector } from './components/ContractTypeSelector.jsx';
import { Sidebar } from './components/Sidebar.jsx';
import { Canvas } from './components/Canvas.jsx';
import { BlockSettingsPanel } from './components/BlockSettingsPanel.jsx';
import { SummaryPanel } from './components/SummaryPanel.jsx';
import { CONTRACT_TYPES } from './constants.js';
import { useLocalLayout } from './hooks.js';

export default function App() {
  const [contractType, setContractType] = useState(null);
  const [baseBlock, setBaseBlock] = useState(null);
  const [optionalBlocks, setOptionalBlocks] = useState([]);
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [message, setMessage] = useState('');
  const [isSummaryOpen, setSummaryOpen] = useState(false);
  const [isBackConfirmOpen, setBackConfirmOpen] = useState(false);

  const { savedLayout, saveLayout } = useLocalLayout();

  const handleSelectContractType = (type) => {
    setContractType(type);
    // Reset canvas but keep previous layout logic separate
    setBaseBlock(null);
    setOptionalBlocks([]);
    setSelectedBlockId(null);
    setMessage('Drag the required details block from the sidebar onto the canvas to begin.');
  };

  const handleBackToSelection = () => {
    if (!contractType) return;
    const hasBlocks = baseBlock || optionalBlocks.length > 0;
    if (hasBlocks) {
      setBackConfirmOpen(true);
      return;
    }
    setContractType(null);
    setBaseBlock(null);
    setOptionalBlocks([]);
    setSelectedBlockId(null);
    setSummaryOpen(false);
    setMessage('Start by choosing a contract type.');
  };

  const handleDropFromSidebar = (data) => {
    if (!contractType) {
      setMessage('Choose a contract type to begin.');
      return;
    }

    if (data.kind === 'base') {
      if (baseBlock) {
        setMessage('Only one base block is allowed.');
        return;
      }
      const newBase =
        contractType === CONTRACT_TYPES.ERC20
          ? {
              id: 'base-erc20',
              type: 'base',
              fields: {
                tokenName: '',
                symbol: '',
                totalSupply: '',
                decimals: 18,
              },
            }
          : {
              id: 'base-erc721',
              type: 'base',
              fields: {
                collectionName: '',
                symbol: '',
                baseUri: '',
              },
            };
      setBaseBlock(newBase);
      setMessage('Base block added. You can now drag optional feature blocks onto the canvas.');
      return;
    }

    if (data.kind === 'optional') {
      if (!baseBlock) {
        setMessage('Add Token/NFT Details first.');
        return;
      }
      const newBlock = {
        id: `opt-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
        type: 'optional',
        key: data.key,
        title: toTitleFromKey(data.key),
        description: '', // Canvas will show from definition; description not required here
        settings: {},
        summary: '',
      };
      setOptionalBlocks((prev) => [...prev, newBlock]);
      setMessage('Optional block added. Click it to edit settings.');
    }
  };

  const handleReorderOptionalBlock = (blockId, targetIndex) => {
    setOptionalBlocks((prev) => {
      const currentIndex = prev.findIndex((b) => b.id === blockId);
      if (currentIndex === -1 || currentIndex === targetIndex) return prev;
      const updated = [...prev];
      const [moved] = updated.splice(currentIndex, 1);
      updated.splice(targetIndex, 0, moved);
      return updated;
    });
  };

  const handleSettingsSave = (blockId, settings, summary) => {
    setOptionalBlocks((prev) =>
      prev.map((block) =>
        block.id === blockId ? { ...block, settings, summary } : block,
      ),
    );
    setMessage('Settings saved. Summary updated.');
  };

  const handleResetCanvas = () => {
    const confirmed = window.confirm(
      'This will remove all blocks from the canvas but keep your selected contract type. Continue?',
    );
    if (!confirmed) return;
    setBaseBlock(null);
    setOptionalBlocks([]);
    setSelectedBlockId(null);
    setMessage('Canvas reset. Drag the base block to begin again.');
  };

  const handleSaveLayout = () => {
    if (!contractType || !baseBlock) {
      setMessage('Add the base block before saving your layout.');
      return;
    }
    const ok = saveLayout({
      contractType,
      baseBlock,
      optionalBlocks,
    });
    setMessage(
      ok
        ? 'Layout saved locally in this browser.'
        : 'Could not save layout. Check your browser storage settings.',
    );
  };

  const handleLoadLayout = () => {
    if (!savedLayout) {
      setMessage('No saved layout found.');
      return;
    }
    setContractType(savedLayout.contractType || null);
    setBaseBlock(savedLayout.baseBlock || null);
    setOptionalBlocks(savedLayout.optionalBlocks || []);
    setSelectedBlockId(null);
    setMessage('Saved layout loaded.');
  };

  const selectedBlock =
    optionalBlocks.find((b) => b.id === selectedBlockId) || null;

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          {contractType && (
            <button
              type="button"
              style={{ ...styles.headerButton, ...styles.headerButtonGhost, ...styles.backButton }}
              onClick={handleBackToSelection}
            >
              ← Back
            </button>
          )}
          <div>
            <div style={styles.appName}>Smart Contract Creator</div>
            <div style={styles.appTagline}>
              Drag-and-drop your ERC-20 or ERC-721 contract in a friendly, code-free way.
            </div>
          </div>
        </div>
        {contractType && (
          <div style={styles.headerActions}>
            <button
              type="button"
              style={{ ...styles.headerButton, ...styles.headerButtonGhost }}
              onClick={() => setSummaryOpen(true)}
            >
              View Summary
            </button>
            <button
              type="button"
              style={{ ...styles.headerButton, ...styles.headerButtonDanger }}
              onClick={handleResetCanvas}
              disabled={!baseBlock && optionalBlocks.length === 0}
            >
              Reset Canvas
            </button>
          </div>
        )}
      </header>

      {!contractType && (
        <ContractTypeSelector
          selectedType={contractType}
          onSelect={handleSelectContractType}
        />
      )}

      {contractType && (
        <main style={styles.main}>
          <Sidebar
            contractType={contractType}
            hasBaseBlock={!!baseBlock}
            onStartDragBase={() => setMessage('Dragging base block...')}
            onStartDragOptional={() => setMessage('Dragging optional block...')}
            draggingEnabled
            onShowBlockedMessage={setMessage}
          />
          <Canvas
            contractType={contractType}
            baseBlock={baseBlock}
            optionalBlocks={optionalBlocks}
            onDropFromSidebar={handleDropFromSidebar}
            onSelectOptionalBlock={setSelectedBlockId}
            onReorderOptionalBlock={handleReorderOptionalBlock}
            onAttemptMoveBase={() =>
              setMessage('The base block cannot be moved or removed in this prototype.')
            }
            onUpdateBaseFields={(patch) =>
              setBaseBlock((prev) =>
                prev
                  ? { ...prev, fields: { ...prev.fields, ...patch } }
                  : prev,
              )
            }
            onDeleteOptionalBlock={(blockId) => {
              const found = optionalBlocks.find((b) => b.id === blockId);
              setOptionalBlocks((prev) => prev.filter((b) => b.id !== blockId));
              setMessage(
                found
                  ? `Removed “${found.title}” from the canvas.`
                  : 'Block removed.',
              );
            }}
          />
        </main>
      )}

      <footer style={styles.footer}>
        <div style={styles.footerText}>
          {message || 'Start by choosing a contract type.'}
        </div>
      </footer>

      <BlockSettingsPanel
        key={selectedBlock ? selectedBlock.id : 'none'}
        selectedBlock={selectedBlock}
        onClose={() => setSelectedBlockId(null)}
        onSave={handleSettingsSave}
      />

      <SummaryPanel
        isOpen={isSummaryOpen}
        onClose={() => setSummaryOpen(false)}
        contractType={contractType}
        baseBlock={baseBlock}
        optionalBlocks={optionalBlocks}
      />

      {isBackConfirmOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <div style={styles.modalHeader}>
              <div style={styles.modalTitle}>Leave this contract setup?</div>
              <button
                type="button"
                style={styles.modalClose}
                onClick={() => setBackConfirmOpen(false)}
              >
                ×
              </button>
            </div>
            <div style={styles.modalBody}>
              Going back to the contract type selection will{' '}
              <strong>clear all blocks on this canvas</strong>. Your saved layouts (if
              you used Save Layout) will still be available.
            </div>
            <div style={styles.modalActions}>
              <button
                type="button"
                style={styles.modalSecondary}
                onClick={() => setBackConfirmOpen(false)}
              >
                Stay here
              </button>
              <button
                type="button"
                style={styles.modalPrimary}
                onClick={() => {
                  setBackConfirmOpen(false);
                  setContractType(null);
                  setBaseBlock(null);
                  setOptionalBlocks([]);
                  setSelectedBlockId(null);
                  setSummaryOpen(false);
                  setMessage('Start by choosing a contract type.');
                }}
              >
                Clear canvas & go back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function toTitleFromKey(key) {
  switch (key) {
    case 'mintable':
      return 'Mintable';
    case 'burnable':
      return 'Burnable';
    case 'pausable':
      return 'Pausable';
    case 'maxSupply':
      return 'Max Supply';
    case 'transferFee':
      return 'Transfer Fee';
    case 'accessControl':
      return 'Access Control';
    case 'mintOptions':
      return 'Mint Options';
    case 'revealSystem':
      return 'Reveal System';
    case 'whitelist':
      return 'Whitelist';
    case 'royalties':
      return 'Royalties';
    default:
      return key;
  }
}

const styles = {
  app: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
    background: 'linear-gradient(to bottom right, #eff6ff, #e0f2fe)',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  header: {
    padding: '14px 22px',
    borderBottom: '1px solid #dbeafe',
    background: '#f8fafc',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    boxShadow: '0 12px 30px rgba(15, 23, 42, 0.06)',
  },
  appName: {
    fontWeight: 600,
    fontSize: '19px',
    letterSpacing: '0.02em',
  },
  appTagline: {
    fontSize: '12px',
    color: '#6b7280',
  },
  headerActions: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  headerButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    borderRadius: '999px',
    border: '1px solid transparent',
    padding: '6px 14px',
    fontSize: '12px',
    fontWeight: 500,
    cursor: 'pointer',
    transition:
      'background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease, transform 0.08s ease',
  },
  headerButtonPrimary: {
    backgroundColor: '#2563eb',
    borderColor: '#1d4ed8',
    color: '#ffffff',
    boxShadow: '0 8px 18px rgba(37, 99, 235, 0.35)',
  },
  headerButtonSecondary: {
    backgroundColor: '#ffffff',
    borderColor: '#bfdbfe',
    color: '#1d4ed8',
    boxShadow: '0 4px 12px rgba(148, 163, 184, 0.25)',
  },
  headerButtonGhost: {
    backgroundColor: 'transparent',
    borderColor: '#c7d2fe',
    color: '#1e3a8a',
  },
  headerButtonDanger: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    color: '#b91c1c',
  },
  backButton: {
    paddingInline: '10px',
    fontSize: '11px',
  },
  main: {
    flex: 1,
    display: 'flex',
    minHeight: 0,
    padding: '16px',
    boxSizing: 'border-box',
  },
  footer: {
    padding: '8px 20px',
    borderTop: '1px solid #e5e7eb',
    background: '#f8fafc',
  },
  footerText: {
    fontSize: '12px',
    color: '#1e3a8a',
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15,23,42,0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
    padding: '16px',
    boxSizing: 'border-box',
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: '16px',
    background: '#ffffff',
    boxShadow: '0 22px 60px rgba(15,23,42,0.5)',
    padding: '16px 18px 14px',
    boxSizing: 'border-box',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '8px',
    marginBottom: '8px',
  },
  modalTitle: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#0f172a',
  },
  modalClose: {
    border: 'none',
    background: 'transparent',
    fontSize: '20px',
    lineHeight: 1,
    cursor: 'pointer',
    color: '#6b7280',
  },
  modalBody: {
    fontSize: '13px',
    color: '#4b5563',
    marginBottom: '12px',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
  },
  modalPrimary: {
    padding: '6px 14px',
    borderRadius: '999px',
    border: '1px solid #b91c1c',
    background: '#fee2e2',
    color: '#b91c1c',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  modalSecondary: {
    padding: '6px 14px',
    borderRadius: '999px',
    border: '1px solid #e5e7eb',
    background: '#f9fafb',
    color: '#111827',
    fontSize: '12px',
    cursor: 'pointer',
  },
};

