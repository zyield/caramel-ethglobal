import './App.css'

import { WagmiConfig, createClient } from 'wagmi'
import { getDefaultProvider } from 'ethers'

import Hero from './components/Hero'
import Main from './components/Main'

const client = createClient({
  autoConnect: true,
  provider: getDefaultProvider()
})

function App() {
  return (
    <WagmiConfig client={client}>
      <Hero />
      <Main />
    </WagmiConfig>
  )
}

export default App
