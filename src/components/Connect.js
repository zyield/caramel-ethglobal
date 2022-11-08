import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/outline'

import { useConnect } from 'wagmi'
import ConnectModal from './ConnectModal'
import ConnectNotification from './ConnectNotification'

import { useArweaveWalletStore } from '../providers/ArweaveWalletContext'

function Connect({ callback, button_text, custom_style }) {
  const [open, setOpen] = useState(false)
  const arweaveStore = useArweaveWalletStore()

  const { connect, connectors, error, isConnecting, pendingConnector } =
    useConnect({
      onSuccess(data) {
        let { connector } = data
        arweaveStore.setConnector(connector)
        arweaveStore.setProvider(connector.providerInstance)
      }
    })

  button_text = button_text || 'Connect Wallet'

  custom_style =
    custom_style ||
    'inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'

  return (
    <div className="flex justify-end items-right mt-4 mr-4">
      <button onClick={() => setOpen(true)} className={custom_style}>
        {button_text}
      </button>

      {error && (
        <ConnectNotification text={error?.message || 'Failed to connect'} />
      )}
      <ConnectModal
        open={open}
        setOpen={setOpen}
        connectors={connectors}
        loading={isConnecting}
        connect={connect}
      />
    </div>
  )
}

export default Connect
