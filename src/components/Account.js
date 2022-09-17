import { React, useState, useEffect } from 'react'
import { useAccount, useNetwork, useEnsName, useDisconnect } from 'wagmi'
import Connect from './Connect'
import { truncateAddress } from '../utils'

import AccountModal from './AccountModal'
import Loading from './Loading'

function Account({ display_connect_button }) {
  const { address, isLoading, isConnected } = useAccount({
    fetchEns: true
  })

  const { chain } = useNetwork()

  const { data: ensName } = useEnsName({ address })

  const { disconnect } = useDisconnect()
  const { activeChain } = useNetwork()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  if (address) {
    return (
      <div className="flex justify-end items-right mt-4 mr-4">
        <div
          className="text-white flex bg-white shadow hover:bg-gray-50 px-3 py-2 rounded-r-md rounded-l-md justify-between items-center cursor-pointer px-2"
          onClick={() => setOpen(true)}
        >
          <div className="text-gray-800 ml-2">
            {ensName ? ensName : truncateAddress(address)}
          </div>
          <div className="flex items-center ml-2">
            <div>
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            </div>
            <div className="text-gray-800 ml-2 text-xs">
              {chain?.name === 'Chain 1' ? 'Mainnet' : chain?.name}
            </div>
          </div>
        </div>
        <AccountModal
          disconnect={disconnect}
          open={open}
          setOpen={setOpen}
          address={address}
        />
      </div>
    )
  }

  if (!display_connect_button) return ''

  if (!address) return <Connect />

  if (loading || isLoading) return null
}

export default Account
