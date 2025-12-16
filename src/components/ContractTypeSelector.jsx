import { CONTRACT_TYPES } from '../constants.js';

export function ContractTypeSelector({ selectedType, onSelect }) {
  return (
    <div style={styles.page}>
      <div style={styles.heroShell}>
        <div style={styles.heroContent}>
          <div style={styles.badgeRow}>
            <span style={styles.badgeDot} />
            <span style={styles.badgeText}>No-code smart contract prototype</span>
          </div>
          <h1 style={styles.title}>
            Design ERC-20 tokens and NFT collections&nbsp;
            <span style={styles.titleHighlight}>visually</span>.
          </h1>
          <p style={styles.subtitle}>
            Start with a friendly canvas, drag in the pieces you need, and see a clear
            summary of what your contract will do — without touching Solidity.
          </p>
          <div style={styles.heroMetaRow}>
            <div style={styles.metaItem}>
              <div style={styles.metaLabel}>Step 1</div>
              <div style={styles.metaText}>Choose ERC-20 or ERC-721</div>
            </div>
            <div style={styles.metaSeparator} />
            <div style={styles.metaItem}>
              <div style={styles.metaLabel}>Step 2</div>
              <div style={styles.metaText}>Drag details and features</div>
            </div>
            <div style={styles.metaSeparator} />
            <div style={styles.metaItem}>
              <div style={styles.metaLabel}>Step 3</div>
              <div style={styles.metaText}>Review a beginner-friendly summary</div>
            </div>
          </div>
        </div>

        <div style={styles.heroPanel}>
          <div style={styles.panelHeader}>
            <div style={styles.panelTitle}>Choose what you want to build</div>
            <div style={styles.panelSubtitle}>
              Pick a contract type to unlock a tailored set of drag-and-drop blocks.
            </div>
          </div>

          <div style={styles.cardsRow}>
            <TypeCard
              label="ERC-20 Token"
              type={CONTRACT_TYPES.ERC20}
              selectedType={selectedType}
              onSelect={onSelect}
              description="Create a digital token that behaves like a balance or in-app credits people can send and receive."
              chips={['Token balances', 'Fees & limits', 'Access control']}
            />
            <TypeCard
              label="ERC-721 NFT"
              type={CONTRACT_TYPES.ERC721}
              selectedType={selectedType}
              onSelect={onSelect}
              description="Create a collection of unique digital items, like artwork or collectibles, where each piece is one of a kind."
              chips={['Collections', 'Reveal flows', 'Royalties & lists']}
            />
          </div>
        </div>
      </div>

      <div style={styles.footerStrip}>
        <div style={styles.footerItem}>
          <div style={styles.footerTitle}>Beginner-friendly</div>
          <div style={styles.footerText}>
            Every block explains itself in plain language, so you always know what you&apos;re
            turning on.
          </div>
        </div>
        <div style={styles.footerDivider} />
        <div style={styles.footerItem}>
          <div style={styles.footerTitle}>No real blockchain risk</div>
          <div style={styles.footerText}>
            This is a safe prototype. You can explore ideas and layouts without deploying
            anything on-chain.
          </div>
        </div>
        <div style={styles.footerDivider} />
        <div style={styles.footerItem}>
          <div style={styles.footerTitle}>Ready for handoff</div>
          <div style={styles.footerText}>
            Use the summary view to brief developers, stakeholders, or designers on what
            the contract should do.
          </div>
        </div>
      </div>
    </div>
  );
}

function TypeCard({ label, description, chips = [], type, selectedType, onSelect }) {
  const isSelected = selectedType === type;
  return (
    <button
      type="button"
      onClick={() => onSelect(type)}
      style={{
        ...styles.card,
        ...(isSelected ? styles.cardSelected : {}),
      }}
    >
      <div style={styles.cardInner}>
        <div style={styles.cardLeft}>
          <div style={styles.cardIconOuter}>
            <div style={styles.cardIconInner}>
              {label.startsWith('ERC-20') ? '20' : '721'}
            </div>
          </div>
          <div style={styles.cardMainButton}>Select</div>
        </div>
        <div style={styles.cardRight}>
          <h2 style={styles.cardTitle}>{label}</h2>
          <p style={styles.cardText}>{description}</p>
          {chips.length > 0 && (
            <div style={styles.cardChipsRow}>
              {chips.map((chip) => (
                <span key={chip} style={styles.cardChip}>
                  {chip}
                </span>
              ))}
            </div>
          )}
          <div style={styles.cardCta}>Click anywhere on this card to start</div>
        </div>
      </div>
    </button>
  );
}

const styles = {
  page: {
    padding: '8px 24px 28px',
    display: 'flex',
    flexDirection: 'column',
    gap: '28px',
  },
  heroShell: {
    maxWidth: 960,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    alignItems: 'center',
  },
  heroContent: {
    flex: '1 1 320px',
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  badgeRow: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    borderRadius: '999px',
    background: 'rgba(219, 234, 254, 0.7)',
    border: '1px solid #bfdbfe',
    width: 'fit-content',
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: '999px',
    background: '#22c55e',
  },
  badgeText: {
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#1d4ed8',
    fontWeight: 600,
  },
  title: {
    margin: '4px 0 4px',
    fontSize: '32px',
    lineHeight: 1.2,
    color: '#0f172a',
  },
  titleHighlight: {
    color: '#1d4ed8',
  },
  subtitle: {
    margin: 0,
    color: '#475569',
    fontSize: '14px',
    maxWidth: 520,
  },
  heroMetaRow: {
    marginTop: '12px',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    alignItems: 'center',
  },
  metaItem: {
    padding: '8px 12px',
    borderRadius: '999px',
    background: 'rgba(15,23,42,0.03)',
    border: '1px solid rgba(148,163,184,0.4)',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '8px',
  },
  metaLabel: {
    fontSize: '11px',
    fontWeight: 600,
    color: '#0f172a',
  },
  metaText: {
    fontSize: '11px',
    color: '#4b5563',
  },
  metaSeparator: {
    width: 1,
    height: 26,
    background: 'rgba(148,163,184,0.5)',
  },
  heroPanel: {
    flex: '0 0 auto',
    minWidth: 0,
    width: '100%',
    maxWidth: 860,
    marginTop: '-70px',
    marginBottom: '30px',
    borderRadius: '18px',
    background: 'rgba(255,255,255,0.96)',
    border: '1px solid #dbeafe',
    padding: '18px 20px 20px',
    boxShadow: '0 20px 60px rgba(15, 23, 42, 0.20)',
  },
  panelHeader: {
    marginBottom: '12px',
    textAlign: 'center',
  },
  panelTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#0f172a',
    marginBottom: '4px',
  },
  panelSubtitle: {
    fontSize: '13px',
    color: '#64748b',
  },
  cardsRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '8px',
    alignItems: 'center',
  },
  card: {
    border: '1px solid #dbeafe',
    borderRadius: '12px',
    padding: '20px 18px',
    width: '100%',
    maxWidth: 520,
    textAlign: 'left',
    background: '#ffffff',
    cursor: 'pointer',
    boxShadow: '0 16px 40px rgba(15, 23, 42, 0.10)',
    transition:
      'border-color 0.15s ease, box-shadow 0.15s ease, transform 0.1s ease',
  },
  cardSelected: {
    borderColor: '#2563eb',
    boxShadow: '0 18px 45px rgba(37, 99, 235, 0.30)',
    transform: 'translateY(-1px) scale(1.01)',
  },
  cardInner: {
    display: 'flex',
    flexDirection: 'row',
    gap: '14px',
    alignItems: 'center',
  },
  cardLeft: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    minWidth: 80,
  },
  cardRight: {
    flex: 1,
    minWidth: 0,
  },
  cardIconOuter: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: '999px',
    background: '#eff6ff',
    border: '1px solid #bfdbfe',
  },
  cardIconInner: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#1d4ed8',
  },
  cardTitle: {
    margin: '0 0 4px',
    fontSize: '18px',
    color: '#0f172a',
  },
  cardText: {
    margin: 0,
    fontSize: '14px',
    color: '#4b5563',
  },
  cardChipsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginTop: '10px',
  },
  cardChip: {
    padding: '3px 8px',
    borderRadius: '999px',
    background: '#eff6ff',
    border: '1px solid #bfdbfe',
    fontSize: '11px',
    color: '#1d4ed8',
  },
  cardCta: {
    marginTop: '10px',
    fontSize: '11px',
    fontWeight: 500,
    color: '#1d4ed8',
  },
  cardMainButton: {
    padding: '8px 16px',
    borderRadius: '999px',
    border: '1px solid #2563eb',
    background: 'linear-gradient(to bottom, #2563eb, #1d4ed8)',
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: 600,
    boxShadow: '0 10px 20px rgba(37,99,235,0.45)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  footerStrip: {
    maxWidth: 1040,
    margin: '0 auto',
    padding: '12px 16px',
    borderRadius: '999px',
    background: 'rgba(15,23,42,0.03)',
    border: '1px solid rgba(148,163,184,0.3)',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    alignItems: 'center',
  },
  footerItem: {
    flex: '1 1 220px',
    minWidth: 0,
  },
  footerTitle: {
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#0f172a',
    marginBottom: '2px',
  },
  footerText: {
    fontSize: '11px',
    color: '#4b5563',
  },
  footerDivider: {
    width: 1,
    height: 30,
    background: 'rgba(148,163,184,0.5)',
  },
};


