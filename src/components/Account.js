import { React, useState, useEffect } from 'react'
import { useAccount, useNetwork, useEnsName, useDisconnect } from 'wagmi'
import Connect from './Connect'
import { truncateAddress } from '../utils'

import AccountModal from './AccountModal'
import ArweaveAccountModal from './ArweaveAccountModal'
import Loading from './Loading'

import { useArweaveWalletStore } from '../providers/ArweaveWalletContext'
import { getBalance } from '../utils/arweave'
import { observer } from 'mobx-react-lite'

function Account({ display_connect_button }) {
  const { address, isLoading, isConnected } = useAccount({
    fetchEns: true
  })

  const { chain } = useNetwork()
  const { data: ensName } = useEnsName({ address })
  const { disconnect } = useDisconnect()
  const { activeChain } = useNetwork()
  const [open, setOpen] = useState(false)
  const [openArweave, setOpenArweave] = useState(false)
  const [loading, setLoading] = useState(false)
  const [arweaveAddress, setArweaveAddress] = useState()
  const [arweaveBalance, setArweaveBalance] = useState()

  const arweaveStore = useArweaveWalletStore()

  useEffect(() => {
    async function fetchArweaveAccount(store) {
      let address = await store.getWalletAddress()
      setArweaveAddress(address)
      if (address) {
        let balance = getBalance(address)
        setArweaveBalance(balance)
      }
    }

    fetchArweaveAccount(arweaveStore)
  }, [])

  if (address) {
    return (
      <div className="flex justify-center items-right mt-4 mr-4">
        <div
          className="flex dark:bg-zinc-800 dark:text-zinc-400 text-center shadow hover:bg-zinc-600 px-3 py-2 rounded-r-md rounded-l-md justify-between items-center cursor-pointer px-2"
          onClick={() => setOpen(true)}
        >
          <div className="text-zinc-400 ml-2">
            {ensName ? ensName : truncateAddress(address)}
          </div>
          <div className="flex items-center ml-2">
            <div>
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            </div>
            <div className="text-zinc-400 ml-2 text-xs">
              {chain?.name === 'Chain 1' ? 'Mainnet' : chain?.name}
            </div>
          </div>
        </div>
        {arweaveStore.getWalletAddress() && <div className="flex dark:bg-zinc-800 dark:text-zinc-400 text-center shadow hover:bg-zinc-600 px-3 py-2 rounded-r-md rounded-l-md justify-between items-center px-2 ml-4 cursor-pointer" onClick={() => setOpenArweave(true)}>
            <div className="text-zinc-400 ml-2">
              {arweaveStore.getWalletAddress()}
            </div>

            <div className="flex items-center ml-2">
              <div>
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              </div>
              <div className="text-zinc-400 ml-2 text-xs">
                Arweave
              </div>
            </div>

          </div>
        }
        <AccountModal
          disconnect={disconnect}
          open={open}
          setOpen={setOpen}
          address={address}
        />

        <ArweaveAccountModal
          open={openArweave}
          setOpen={setOpenArweave}
          address={arweaveAddress}
          balance={arweaveBalance}
        />
      </div>
    )
  }

  if (!display_connect_button) return ''

  if (!address) return <Connect />

  if (loading || isLoading) return null
}

export default observer(Account)
