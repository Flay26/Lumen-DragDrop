export const CONTRACT_TYPES = {
  ERC20: 'ERC20',
  ERC721: 'ERC721',
};

export const ERC20_BLOCKS = {
  BASE: {
    id: 'erc20-base',
    type: 'base',
    key: 'tokenDetails',
    title: 'Token Details',
    description: 'Define the basic information for your token, like its name and symbol.',
  },
  OPTIONAL: [
    {
      key: 'mintable',
      title: 'Mintable',
      description:
        'Allow more tokens to be created later, usually by you or a trusted wallet.',
    },
    {
      key: 'burnable',
      title: 'Burnable',
      description:
        'Allow tokens to be destroyed on purpose, which can reduce the total supply.',
    },
    {
      key: 'pausable',
      title: 'Pausable',
      description:
        'Let you temporarily stop transfers if something unexpected happens.',
    },
    {
      key: 'maxSupply',
      title: 'Max Supply',
      description:
        'Set a hard limit on how many tokens can ever exist, even if minting is allowed.',
    },
    {
      key: 'transferFee',
      title: 'Transfer Fee',
      description:
        'Take a small fee whenever tokens move from one wallet to another.',
    },
    {
      key: 'accessControl',
      title: 'Access Control',
      description:
        'Decide who is allowed to use powerful actions like minting or pausing.',
    },
  ],
};

export const ERC721_BLOCKS = {
  BASE: {
    id: 'erc721-base',
    type: 'base',
    key: 'nftDetails',
    title: 'NFT Details',
    description:
      'Define the basic information for your NFT collection, like its name and where the artwork lives.',
  },
  OPTIONAL: [
    {
      key: 'mintOptions',
      title: 'Mint Options',
      description:
        'Control how new NFTs are created, such as public sale or private mint.',
    },
    {
      key: 'maxSupply',
      title: 'Max Supply',
      description:
        'Set the maximum number of NFTs that can ever exist in this collection.',
    },
    {
      key: 'revealSystem',
      title: 'Reveal System',
      description:
        'Hide the real artwork at first and reveal it later, often after minting is complete.',
    },
    {
      key: 'whitelist',
      title: 'Whitelist',
      description:
        'Let only approved wallets mint during a special early window.',
    },
    {
      key: 'royalties',
      title: 'Royalties',
      description:
        'Let you earn a small fee each time your NFT is resold on a marketplace.',
    },
    {
      key: 'burnable',
      title: 'Burnable',
      description:
        'Allow NFTs to be destroyed on purpose, which can reduce the total supply.',
    },
    {
      key: 'pausable',
      title: 'Pausable',
      description:
        'Let you temporarily stop transfers if something unexpected happens.',
    },
  ],
};


