# Caramel decentralized ENS blogging

This dApp is self-contained and the only depedencies are Infura (for ipfs gateway)
and Alchemy for JSON-RPC calls.

You need to setup the following in your .env

```
REACT_APP_ALCHEMY_API_KEY=
REACT_APP_INFURA_USERNAME=
REACT_APP_INFURA_SECRET=

# kovan
REACT_APP_EPNS_CORE_ADDRESS_KOVAN=0x97d7c5f14b8fe94ef2b4ba589379f5ec992197da
REACT_APP_DAI_ADDRESS_KOVAN=0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD

# goerli
REACT_APP_ENS_PUBLIC_RESOLVER_ADDRESS_GOERLI=0x4b1488b7a6b320d2d721406204abc3eeaa9ad329
REACT_APP_EPNS_CORE_ADDRESS_GOERLI=0xd4E3ceC407cD36d9e3767cD189ccCaFBF549202C
REACT_APP_DAI_ADDRESS_GOERLI=0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60

# mainnet
REACT_APP_ENS_PUBLIC_RESOLVER_ADDRESS_MAINNET=0x4976fb03c32e5b8cfe2b6ccb31c09ba78ebaba41
REACT_APP_EPNS_CORE_ADDRESS_MAINNET=0x66329Fdd4042928BfCAB60b179e1538D56eeeeeE
REACT_APP_DAI_ADDRESS_MAINNET=0x6B175474E89094C44Da98b954EedeAC495271d0F
```

The dApp is fully functional in Goerli, sans the .eth.limo | .eth.link access. The ENS domains 
in testnet are not resolved using those two services. Kovan, even though deprecated, is the only
test net available for EPNS. Note that ENS does not work in Kovan, we only used Kovan to test out
the EPNS implementation.

## How to run the app

Simply run `yarn start` to star the app

## Where is the app hosted and deployment process

We registered an ENS domain for `crml.eth`. To publish the app, we recursively added the static `./build` 
to IPFS and published the root CID to IPNS. Every time we need to update it, we publish the new CID to IPNS
without having to refresh the contentHash stored in ENS.

The main dApp is accessibe at the following locations:

- https://crml.eth.limo
- https://crml.eth.link
- ipns/k51qzi5uqu5dg7ogzhgnvhrskzd6y6mhhmd4vzmsyyg8m223xd3bbq55z3i8f1
