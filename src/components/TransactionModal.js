import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useWaitForTransaction, useNetwork } from 'wagmi'
import Loading from './Loading'

function TransactionModal({hash}) {
  const [open, setOpen] = useState(true)
  const { chain, chains } = useNetwork()

  const { data, isError, isLoading } = useWaitForTransaction({
    hash: hash
  })

  const handleOnClose = () => {
    setOpen(false)
    //window.location.reload(false)
  }

  const transactionLink = (hash) => {
    if (chain.id == 5) {
      return `https://goerli.etherscan.io/tx/${hash}`
    } else if ( chain.id == 1) {
      return `https://etherscan.io/tx/${hash}`
    }
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={setOpen}>
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

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
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
            <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
              <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="bg-gray-100 rounded-md text-black hover:text-black-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  onClick={handleOnClose}
                >
                  <span className="sr-only">Close</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div>
                {isLoading &&
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full">
                    <Loading className="bg-black-100 text-green-600" />
                  </div>
                }
                {!isLoading &&
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                    <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                  </div>
                }

                <div className="mt-3 text-center sm:mt-5">
                  <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-800">
                  {isLoading ? "Transaction submitted" : (isError ? "There was an error" : "Transaction mined")}
                  </Dialog.Title>
                  <div className="mt-2 mb-4">
                    <p className="text-sm text-gray-700">
                      You can close this window, the transaction will be processed in the background.
                    </p>
                  </div>
                  {hash &&
                    <div className="px-4 py-3 sm:px-6 flex justify-center">
                      <a
                        target="_blank"
                        href={transactionLink(hash)}
                        className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        View Transaction
                      </a>
                    </div>
                  }
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default TransactionModal
