import { useState } from 'react';

const SETTINGS_CONFIG = {
  mintable: {
    title: 'Mintable',
    explanation:
      'This lets you create more tokens later. Use this if you want your token supply to grow over time.',
    fields: [
      {
        name: 'mintingAuthority',
        label: 'Minting authority',
        helper:
          'Who is allowed to mint? Use “Contract Creator” or paste a custom wallet address.',
        example: 'Example: Contract Creator or 0xABC...',
        required: true,
      },
      {
        name: 'maxMintAmount',
        label: 'Maximum mint amount (optional)',
        helper:
          'The most tokens that can be minted in a single action. Leave blank for no limit.',
        example: 'Example: 100000',
        required: false,
      },
    ],
  },
  burnable: {
    title: 'Burnable',
    explanation:
      'This allows token or NFT holders to destroy (burn) their tokens or NFTs permanently.',
    fields: [],
  },
  pausable: {
    title: 'Pausable',
    explanation:
      'This lets you temporarily stop transfers if something unexpected happens.',
    fields: [
      {
        name: 'pauseAuthority',
        label: 'Pause authority',
        helper:
          'Who is allowed to pause the contract? Use “Contract Creator” or paste a wallet address.',
        example: 'Example: Contract Creator or 0xABC...',
        required: true,
      },
    ],
  },
  maxSupply: {
    title: 'Max Supply',
    explanation:
      'This sets a hard limit on how many tokens or NFTs can ever exist.',
    fields: [
      {
        name: 'maxAmount',
        label: 'Maximum supply limit',
        helper: 'Enter the total number you never want to exceed.',
        example: 'Example: 100000000',
        required: true,
      },
    ],
  },
  transferFee: {
    title: 'Transfer Fee',
    explanation:
      'This adds a small fee every time tokens move from one wallet to another.',
    fields: [
      {
        name: 'feePercent',
        label: 'Fee percentage',
        helper: 'Choose a value between 0 and 20. You can use decimals like 1.5.',
        example: 'Example: 1 or 2.5',
        required: true,
      },
      {
        name: 'feeReceiver',
        label: 'Fee recipient wallet',
        helper: 'The wallet address that will receive the fee.',
        example: 'Example: 0xABC...',
        required: true,
      },
    ],
  },
  accessControl: {
    title: 'Access Control',
    explanation:
      'This decides who can use powerful actions like minting, burning, or pausing.',
    fields: [
      {
        name: 'adminWallet',
        label: 'Admin wallet',
        helper: 'The main wallet that can manage permissions.',
        example: 'Example: 0xABC...',
        required: true,
      },
      {
        name: 'additionalOperators',
        label: 'Additional operators (optional)',
        helper:
          'Comma-separated list of wallets with special permissions, if any.',
        example: 'Example: 0xAAA..., 0xBBB...',
        required: false,
      },
    ],
  },
  mintOptions: {
    title: 'Mint Options',
    explanation:
      'This controls how people can mint new NFTs: only you, anyone, or a selected allowlist.',
    fields: [
      {
        name: 'mode',
        label: 'Mint mode',
        helper:
          'Pick the mint style that matches your launch: owner-only, public sale, or allowlist.',
        example: '',
        required: true,
      },
      {
        name: 'mintPrice',
        label: 'Mint price (ETH)',
        helper: 'How much it costs to mint one NFT. Use 0 for free mint.',
        example: 'Example: 0.05',
        required: false,
      },
      {
        name: 'maxPerWallet',
        label: 'Max per wallet',
        helper: 'Maximum number each wallet can mint.',
        example: 'Example: 3',
        required: false,
      },
      {
        name: 'totalSupplyLimit',
        label: 'Total supply limit',
        helper: 'Total number of NFTs that can be minted in this mode.',
        example: 'Example: 5000',
        required: false,
      },
      {
        name: 'walletList',
        label: 'Allowlist wallets (for C)',
        helper:
          'Paste a comma-separated list of wallet addresses that are allowed to mint.',
        example: 'Example: 0xAAA..., 0xBBB...',
        required: false,
      },
    ],
  },
  revealSystem: {
    title: 'Reveal System',
    explanation:
      'Before reveal, all NFTs show a placeholder image. After reveal, each NFT shows its actual artwork.',
    fields: [
      {
        name: 'hiddenUri',
        label: 'Hidden metadata URI',
        helper: 'The URL that serves the placeholder metadata. Must end with /.',
        example: 'Example: https://placeholder.example.com/',
        required: true,
      },
      {
        name: 'revealedUri',
        label: 'Revealed base URI',
        helper:
          'The URL for the final artwork metadata once reveal happens. Must end with /.',
        example: 'Example: https://my-nfts.com/metadata/',
        required: true,
      },
      {
        name: 'revealDate',
        label: 'Planned reveal date (optional)',
        helper:
          'When you want the artwork to reveal. The collection will automatically switch from hidden to revealed at this time.',
        example: 'Example: 2025-12-31',
        required: false,
      },
    ],
  },
  whitelist: {
    title: 'Whitelist',
    explanation:
      'Only people you approve can mint your NFT during a special window.',
    fields: [
      {
        name: 'walletList',
        label: 'Wallet list',
        helper:
          'Paste a comma-separated list of wallet addresses. At least one address is required.',
        example: 'Example: 0xAAA..., 0xBBB...',
        required: true,
      },
    ],
  },
  royalties: {
    title: 'Royalties',
    explanation:
      'This sets a small fee you earn whenever your NFT is resold.',
    fields: [
      {
        name: 'royaltyPercent',
        label: 'Royalty percentage',
        helper:
          'Choose a number between 0 and 15. You can use decimals like 2.5. This will be treated as a percent.',
        example: 'Example: 5 (for 5%)',
        required: true,
      },
      {
        name: 'royaltyWallet',
        label: 'Payout wallet',
        helper: 'The wallet that should receive royalty payments.',
        example: 'Example: 0xABC...',
        required: true,
      },
    ],
  },
};

export function BlockSettingsPanel({
  selectedBlock,
  onClose,
  onSave,
  baseBlock,
  contractType,
}) {
  if (!selectedBlock) return null;

  const config = SETTINGS_CONFIG[selectedBlock.key];
  if (!config) return null;

  const [formState, setFormState] = useState(
    buildInitialFormState(selectedBlock.settings, config),
  );
  const [errors, setErrors] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const { values, errorMessages } = validateForm(
      selectedBlock.key,
      formState,
      config,
      { baseBlock, contractType },
    );
    if (errorMessages.length > 0) {
      setErrors(errorMessages);
      return;
    }
    const summary = buildSummary(selectedBlock.key, values);
    onSave(selectedBlock.id, values, summary);
    setErrors([]);
    onClose();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.panel}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>{config.title} Settings</h2>
            <p style={styles.explanation}>{config.explanation}</p>
          </div>
          <button type="button" onClick={onClose} style={styles.closeButton}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {config.fields.map((field) => {
            if (selectedBlock.key === 'mintOptions') {
              const mode = String(formState.mode || '').toUpperCase();
              if (field.name !== 'mode') {
                if (mode === 'A' || !mode) {
                  return null;
                }
                if (mode === 'B' && field.name === 'walletList') {
                  return null;
                }
              }
            }

            if (selectedBlock.key === 'mintOptions' && field.name === 'mode') {
              return (
                <div key={field.name} style={styles.field}>
                  <label style={styles.label}>{field.label}</label>
                  <div style={styles.radioGroup}>
                    <label style={styles.radioOption}>
                      <input
                        type="radio"
                        name="mode"
                        value="A"
                        checked={String(formState.mode || '').toUpperCase() === 'A'}
                        onChange={() =>
                          setFormState((prev) => ({
                            ...prev,
                            mode: 'A',
                          }))
                        }
                      />
                      <div>
                        <div style={styles.radioTitle}>Only owner can mint</div>
                        <div style={styles.radioText}>
                          Only you (or a chosen owner wallet) can create NFTs. No public mint.
                        </div>
                      </div>
                    </label>
                    <label style={styles.radioOption}>
                      <input
                        type="radio"
                        name="mode"
                        value="B"
                        checked={String(formState.mode || '').toUpperCase() === 'B'}
                        onChange={() =>
                          setFormState((prev) => ({
                            ...prev,
                            mode: 'B',
                          }))
                        }
                      />
                      <div>
                        <div style={styles.radioTitle}>Public mint</div>
                        <div style={styles.radioText}>
                          Anyone can mint while the sale is open, up to a limit per wallet.
                        </div>
                      </div>
                    </label>
                    <label style={styles.radioOption}>
                      <input
                        type="radio"
                        name="mode"
                        value="C"
                        checked={String(formState.mode || '').toUpperCase() === 'C'}
                        onChange={() =>
                          setFormState((prev) => ({
                            ...prev,
                            mode: 'C',
                          }))
                        }
                      />
                      <div>
                        <div style={styles.radioTitle}>Allowlist / whitelist</div>
                        <div style={styles.radioText}>
                          Only wallets you list are allowed to mint, often during an early access window.
                        </div>
                      </div>
                    </label>
                  </div>
                  <div style={styles.helper}>{field.helper}</div>
                  {field.required && (
                    <div style={styles.required}>Required</div>
                  )}
                </div>
              );
            }

            const commonInputProps = {
              value: formState[field.name] ?? '',
              name: field.name,
              placeholder: field.example,
              onChange: (event) =>
                setFormState((prev) => ({
                  ...prev,
                  [field.name]: event.target.value,
                })),
            };

            const isDateField =
              selectedBlock.key === 'revealSystem' && field.name === 'revealDate';
            const isRoyaltyPercent =
              selectedBlock.key === 'royalties' && field.name === 'royaltyPercent';

            return (
              <div key={field.name} style={styles.field}>
                <label style={styles.label}>{field.label}</label>
                <div style={styles.inputWrapper}>
                  <input
                    type={isDateField ? 'date' : 'text'}
                    style={styles.input}
                    {...commonInputProps}
                  />
                  {isRoyaltyPercent && <span style={styles.inputSuffix}>%</span>}
                </div>
                <div style={styles.helper}>{field.helper}</div>
                {field.required && (
                  <div style={styles.required}>Required</div>
                )}
              </div>
            );
          })}
          {errors.length > 0 && (
            <div style={styles.errorBox}>
              {errors.map((err) => (
                <div key={err} style={styles.errorText}>
                  {err}
                </div>
              ))}
            </div>
          )}
          <div style={styles.actions}>
            <button type="button" onClick={onClose} style={styles.secondaryButton}>
              Cancel
            </button>
            <button type="submit" style={styles.primaryButton}>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function buildInitialFormState(settings, config) {
  const state = {};
  config.fields.forEach((field) => {
    state[field.name] = settings?.[field.name] ?? '';
  });
  return state;
}

function validateForm(key, formState, config, context) {
  const values = {};
  const errorMessages = [];

  config.fields.forEach((field) => {
    const value = formState[field.name];
    const trimmed = typeof value === 'string' ? value.trim() : value;
    values[field.name] = trimmed;
    if (field.required && !trimmed) {
      errorMessages.push(`Please fill out “${field.label}”.`);
    }
  });

  // Additional per-block validation
  if (key === 'mintable') {
    const auth = values.mintingAuthority || '';
    if (
      auth &&
      auth.toLowerCase() !== 'contract creator' &&
      !isEthAddress(auth)
    ) {
      errorMessages.push(
        'Minting authority must be “Contract Creator” or a valid Ethereum address.',
      );
    }
    if (values.maxMintAmount) {
      if (!/^[0-9]+$/.test(values.maxMintAmount)) {
        errorMessages.push('Maximum mint amount must be a positive whole number.');
      }
    }
  }

  if (key === 'pausable') {
    const auth = values.pauseAuthority || '';
    if (
      auth &&
      auth.toLowerCase() !== 'contract creator' &&
      !isEthAddress(auth)
    ) {
      errorMessages.push(
        'Pause authority must be “Contract Creator” or a valid Ethereum address.',
      );
    }
  }

  if (key === 'maxSupply') {
    if (!/^[0-9]+$/.test(values.maxAmount || '')) {
      errorMessages.push('Maximum supply limit must be a whole number.');
    } else if (context?.baseBlock?.fields?.totalSupply) {
      const maxVal = BigInt(values.maxAmount);
      const totalSupply = BigInt(
        String(context.baseBlock.fields.totalSupply || '0') || '0',
      );
      if (maxVal < totalSupply) {
        errorMessages.push(
          'Maximum supply limit must be greater than or equal to the initial total supply.',
        );
      }
    }
  }

  if (key === 'transferFee') {
    const percent = Number(values.feePercent);
    if (Number.isNaN(percent) || percent < 0 || percent > 20) {
      errorMessages.push('Fee percentage must be between 0 and 20.');
    }
    if (!isEthAddress(values.feeReceiver || '')) {
      errorMessages.push('Fee recipient wallet must be a valid Ethereum address.');
    }
  }

  if (key === 'accessControl') {
    if (!isEthAddress(values.adminWallet || '')) {
      errorMessages.push('Admin wallet must be a valid Ethereum address.');
    }
    if (values.additionalOperators) {
      const list = values.additionalOperators
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const invalid = list.filter((addr) => !isEthAddress(addr));
      if (invalid.length > 0) {
        errorMessages.push(
          'All additional operators must be valid Ethereum addresses.',
        );
      }
    }
  }

  if (key === 'mintOptions') {
    const mode = String(values.mode || '').toUpperCase();
    if (!['A', 'B', 'C'].includes(mode)) {
      errorMessages.push('Mint mode must be A, B, or C.');
    }
    if (mode === 'B' || mode === 'C') {
      const price = Number(values.mintPrice);
      if (Number.isNaN(price) || price < 0) {
        errorMessages.push('Mint price must be 0 or higher.');
      }
      if (!/^[0-9]+$/.test(values.maxPerWallet || '')) {
        errorMessages.push('Max per wallet must be a whole number.');
      }
      if (!/^[0-9]+$/.test(values.totalSupplyLimit || '')) {
        errorMessages.push('Total supply limit must be a positive whole number.');
      }
    }
    if (mode === 'C') {
      const list = (values.walletList || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      if (list.length === 0) {
        errorMessages.push('Wallet list must contain at least one address.');
      } else {
        const invalid = list.filter((addr) => !isEthAddress(addr));
        if (invalid.length > 0) {
          errorMessages.push(
            'All wallets in the allowlist must be valid Ethereum addresses.',
          );
        }
      }
    }
  }

  if (key === 'revealSystem') {
    if (!isValidUrlWithSlash(values.hiddenUri || '')) {
      errorMessages.push(
        'Hidden metadata URI must be a valid URL and end with a “/”.',
      );
    }
    if (!isValidUrlWithSlash(values.revealedUri || '')) {
      errorMessages.push(
        'Revealed base URI must be a valid URL and end with a “/”.',
      );
    }
    if (values.revealDate) {
      // basic ISO date check (YYYY-MM-DD)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(values.revealDate)) {
        errorMessages.push(
          'Reveal date should use the format YYYY-MM-DD (for example, 2025-12-31).',
        );
      }
    }
  }

  if (key === 'whitelist') {
    const list = (values.walletList || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (list.length === 0) {
      errorMessages.push('Wallet list must contain at least one address.');
    } else {
      const invalid = list.filter((addr) => !isEthAddress(addr));
      if (invalid.length > 0) {
        errorMessages.push('All wallets in the whitelist must be valid addresses.');
      }
    }
  }

  if (key === 'royalties') {
    const p = Number(values.royaltyPercent);
    if (Number.isNaN(p) || p < 0 || p > 15) {
      errorMessages.push('Royalty percentage must be between 0 and 15.');
    }
    if (!isEthAddress(values.royaltyWallet || '')) {
      errorMessages.push('Payout wallet must be a valid Ethereum address.');
    }
  }

  return { values, hasError: errorMessages.length > 0, errorMessages };
}

function isEthAddress(value) {
  return /^0x[a-fA-F0-9]{40}$/.test(value.trim());
}

function isValidUrlWithSlash(value) {
  const v = value.trim();
  if (!v.endsWith('/')) return false;
  try {
    // eslint-disable-next-line no-new
    new URL(v);
    return true;
  } catch {
    return false;
  }
}

function buildSummary(key, values) {
  switch (key) {
    case 'mintable':
      return `Minting enabled so more tokens can be created later. Authority: ${
        values.mintingAuthority || 'not set yet'
      }${
        values.maxMintAmount
          ? `, with a maximum of ${values.maxMintAmount} tokens in a single mint.`
          : '.'
      }`;
    case 'burnable':
      return 'Burning allowed. Holders can permanently destroy their tokens or NFTs.';
    case 'pausable':
      return `Contract can be paused in emergencies by ${
        values.pauseAuthority || 'a chosen wallet (not set yet)'
      } to temporarily stop transfers.`;
    case 'maxSupply':
      return `Maximum supply set to ${values.maxAmount || 'not set yet'}.`;
    case 'transferFee':
      return `Each transfer applies a fee of ${
        values.feePercent || 'not set yet'
      }% that is sent to ${values.feeReceiver || 'no wallet set yet'}.`;
    case 'accessControl':
      return `Powerful actions are controlled by admin wallet ${
        values.adminWallet || 'not set yet'
      }${
        values.additionalOperators
          ? `, with extra operator wallets: ${values.additionalOperators}.`
          : '.'
      }`;
    case 'mintOptions':
      return `Mint options set to ${describeMintMode(values)}.`;
    case 'revealSystem':
      return `Reveal system configured with hidden and revealed artwork URIs${
        values.revealDate ? `, planned reveal date: ${values.revealDate}` : ''
      }.`;
    case 'whitelist':
      return 'Whitelist enabled with a custom wallet list.';
    case 'royalties':
      return `Royalties set to ${values.royaltyPercent || 'not set yet'}% on resales, paid to ${
        values.royaltyWallet || 'no wallet set yet'
      }.`;
    default:
      return '';
  }
}

function describeMintMode(values) {
  const mode = String(values.mode || '').toUpperCase();
  if (mode === 'A') {
    return 'only you (or a chosen owner wallet) can create new NFTs; there is no public mint';
  }
  if (mode === 'B') {
    return `anyone can mint while the sale is open, paying ${
      values.mintPrice || '0'
    } ETH per NFT, up to ${values.maxPerWallet || 'a chosen limit'} per wallet and ${
      values.totalSupplyLimit || 'a chosen total limit'
    } NFTs overall.`;
  }
  if (mode === 'C') {
    return `only wallets on your allowlist can mint, paying ${
      values.mintPrice || '0'
    } ETH per NFT, up to ${values.maxPerWallet || 'a chosen limit'} NFTs per wallet.`;
  }
  return 'no mint mode selected yet';
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15,23,42,0.40)',
    display: 'flex',
    justifyContent: 'flex-end',
    zIndex: 40,
  },
  panel: {
    width: '360px',
    maxWidth: '100%',
    background: '#f9fafb',
    boxShadow: '-6px 0 22px rgba(15,23,42,0.18)',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '16px 16px 8px',
    borderBottom: '1px solid #e5e7eb',
  },
  title: {
    margin: '0 0 4px',
    fontSize: '18px',
    color: '#0f172a',
  },
  explanation: {
    margin: 0,
    fontSize: '13px',
    color: '#4b5563',
  },
  closeButton: {
    border: 'none',
    background: 'transparent',
    fontSize: '20px',
    lineHeight: 1,
    cursor: 'pointer',
    color: '#6b7280',
  },
  form: {
    padding: '12px 16px 16px',
    overflowY: 'auto',
  },
  field: {
    marginBottom: '10px',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: 500,
    marginBottom: '4px',
  },
  input: {
    width: '100%',
    borderRadius: '4px',
    border: '1px solid #bfdbfe',
    padding: '6px 8px',
    fontSize: '13px',
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  inputSuffix: {
    fontSize: '12px',
    color: '#6b7280',
  },
  helper: {
    marginTop: '4px',
    fontSize: '12px',
    color: '#6b7280',
  },
  required: {
    marginTop: '2px',
    fontSize: '11px',
    color: '#b91c1c',
  },
  actions: {
    marginTop: '16px',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
  },
  primaryButton: {
    background: '#2563eb',
    color: '#fff',
    borderRadius: '4px',
    border: 'none',
    padding: '6px 10px',
    fontSize: '13px',
    cursor: 'pointer',
  },
  secondaryButton: {
    background: '#e5effe',
    color: '#1d4ed8',
    borderRadius: '4px',
    border: 'none',
    padding: '6px 10px',
    fontSize: '13px',
    cursor: 'pointer',
  },
  errorBox: {
    marginTop: '8px',
    padding: '8px',
    background: '#fef2f2',
    borderRadius: '4px',
  },
  errorText: {
    fontSize: '12px',
    color: '#b91c1c',
  },
  radioGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginTop: '4px',
  },
  radioOption: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    padding: '6px 8px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    background: '#ffffff',
    fontSize: '12px',
  },
  radioTitle: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#0f172a',
    marginBottom: '2px',
  },
  radioText: {
    fontSize: '11px',
    color: '#6b7280',
  },
};


