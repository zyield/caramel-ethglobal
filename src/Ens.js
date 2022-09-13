import './App.css'

import { WagmiConfig, createClient } from 'wagmi'
import { getDefaultProvider } from 'ethers'

import Hero from './components/Hero'
import Profile from './components/Profile'
import Account from './components/Account'

function Ens() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <Account />
      <div className="mx-auto max-w-3xl">
        <Hero />
        <Profile />
      </div>
    </div>
  )
}

export default Ens
