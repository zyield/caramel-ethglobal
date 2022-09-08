import './App.css'

import { WagmiConfig, createClient } from 'wagmi'
import { getDefaultProvider } from 'ethers'

import Hero from './components/Hero'

const client = createClient({
  autoConnect: true,
  provider: getDefaultProvider()
})

function Ens() {
  return (
    <WagmiConfig client={client}>
      <Hero />
    </WagmiConfig>
  )
}

export default Ens
