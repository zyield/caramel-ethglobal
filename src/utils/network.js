export const addresses = {
  homestead: {
    ens_public_resolver:
      process.env.REACT_APP_ENS_PUBLIC_RESOLVER_ADDRESS_MAINNET,
    epns_core: process.env.REACT_APP_EPNS_CORE_ADDRESS_MAINNET,
    dai: process.env.REACT_APP_DAI_ADDRESS_MAINNET
  },
  goerli: {
    ens_public_resolver:
      process.env.REACT_APP_ENS_PUBLIC_RESOLVER_ADDRESS_GOERLI,
    epns_core: process.env.REACT_APP_EPNS_CORE_ADDRESS_GOERLI,
    dai: process.env.REACT_APP_DAI_ADDRESS_GOERLI
  }
}
