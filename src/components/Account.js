import { React, useState, useEffect } from 'react'
import { useAccount, useEnsName, useNetwork, useDisconnect } from 'wagmi'
import { Connect } from './Connect'
import { truncateAddress } from '../utils'

import AccountModal from './AccountModal'
import Loading from './Loading'

function Account() {
  const {
    address,
    isLoading,
    isConnected
  } = useAccount({
    fetchEns: true
  })

  const { data: ensName } = useEnsName({ address })

  const { disconnect } = useDisconnect()
  const { activeChain } = useNetwork()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  if (!address) return <Connect />

  if (loading || isLoading) return null

  return (
    <div className="flex justify-end items-right mt-4 mr-4">
      <div
        className="text-white flex bg-white shadow hover:bg-gray-50 px-3 py-2 rounded-r-md rounded-l-md justify-between items-center cursor-pointer px-2"
        onClick={() => setOpen(true)}
      >
        <div className="text-gray-800 ml-2">
          {ensName ? ensName : truncateAddress(address)}
        </div>
        <div className="flex items-center ml-4">
          <div>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          </div>
          <div className="text-gray-800 ml-1 text-xs">{activeChain?.name}</div>
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

export default Account