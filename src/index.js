import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'

import { Buffer } from 'buffer'
import {
  chain,
  WagmiConfig,
  createClient,
  defaultChains,
  configureChains
} from 'wagmi'

import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

// Pick chains
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'

// polyfill Buffer for client
if (!window.Buffer) {
  window.Buffer = Buffer
}

const { chains, provider } = configureChains(
  defaultChains,
  [
    alchemyProvider({ apiKey: process.env.REACT_APP_ALCHEMY_API_KEY }),
    publicProvider()
  ]
)

const wagmiClient = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'Caramel'
      }
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true
      }
    }),
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true
      }
    })
  ],
  provider
})

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
    <WagmiConfig client={wagmiClient}>
      <App />
    </WagmiConfig>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
