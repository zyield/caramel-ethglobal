import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationIcon, XMarkIcon } from '@heroicons/react/24/outline'

import coinbase_wallet_logo from '../images/coinbase_wallet.svg'
import metamask_wallet_logo from '../images/metamask.svg'
import walletconnect_wallet_logo from '../images/wallet_connect.svg'

export default function ConnectModal({
  open,
  setOpen,
  connect,
  connectors,
  loading
}) {
  const renderWalletLogo = name => {
    switch (name) {
      case 'MetaMask':
        return <img src={metamask_wallet_logo} className="w-7 mr-4" />
      case 'Coinbase Wallet':
        return <img src={coinbase_wallet_logo} className="mr-4" />
      case 'WalletConnect':
        return <img src={walletconnect_wallet_logo} className="w-10 mr-4" />
      default:
        return ''
    }
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={setOpen}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="bg-gray-200 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  onClick={() => setOpen(false)}
                >
                  <span className="sr-only">Close</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <Dialog.Title
                    as="h3"
                    className="text-lg leading-6 font-medium text-gray-800"
                  >
                    Select your wallet
                  </Dialog.Title>
                  <div className="mt-4">
                    {connectors.map(x => {
                      if (x.name !== 'Injected') {
                        return (
                          <button
                            type="button"
                            disabled={!x.ready}
                            key={x.name}
                            onClick={() => connect({ connector: x})}
                            className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-md text-gray-900 shadow bg-gray-50 hover:bg-gray-200 hover:border-1 border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3 mb-3 w-full justify-center"
                          >
                            {renderWalletLogo(x.name)}
                            {x.name}
                            {!x.ready && ' (unsupported)'}
                          </button>
                        )
                      }
                    })}
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
