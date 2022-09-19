export const addresses = {
  homestead: {
    ens_public_resolver: process.env.REACT_APP_ENS_PUBLIC_RESOLVER_ADDRESS_MAINNET
  },
  goerli: {
    ens_public_resolver: process.env.REACT_APP_ENS_PUBLIC_RESOLVER_ADDRESS_GOERLI
  }
}

export const providers = {
  homestead: {
    alchemy: process.env.REACT_APP_ALCHEMY_API_KEY_MAINNET
  },
  goerli: {
    alchemy: process.env.REACT_APP_ALCHMENY_API_KEY_GOERLI
  }
}
