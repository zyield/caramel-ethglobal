import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {
  XMarkIcon,
  ClipboardIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'
import { truncateAddress } from '../utils'
import MinimalNotification from './MinimalNotification'
import Identicon from './Identicon'

import { useBalance } from 'wagmi'

function AccountModal({ open, setOpen, disconnect, address }) {
  const [avatar, setAvatar] = useState()
  const [loading, setLoading] = useState(false)
  const [notificationText, setNotificationText] = useState()
  const [show, setShow] = useState(false)

  const { data, isError, isLoading } = useBalance({
    addressOrName: address
  })

  const handleDisconnect = () => {
    disconnect()
    setOpen(false)
  }

  const handleCopyToClipboard = address => {
    navigator.clipboard.writeText(address)
    setNotificationText('Copied to clipboard')
    setShow(true)
    setTimeout(() => setShow(false), 3000)
  }

  useEffect(() => {
    async function fetch_avatar() {
      setLoading(true)
      let avatar = null
      setAvatar(avatar)
      setLoading(false)
    }

    fetch_avatar()
  }, [address])

  if (loading || isLoading) return null

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
              <div className="flex justify-center sm:mt-0 sm:ml-4">
                <Identicon address={address} />
              </div>
              <div className="w-full block text-center mt-4 font-bold text-gray-600">
                {truncateAddress(address)}
              </div>
              <div className="w-full block text-center text-sm text-gray-600">
                {data?.formatted} {data?.symbol}
              </div>
              <div className="flex justify-center mt-8">
                <button
                  type="button"
                  onClick={() => handleCopyToClipboard(address)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-base font-medium rounded-md text-gray-500 bg-white border border-gray-400 hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 mr-4"
                >
                  <ClipboardIcon
                    className="-ml-1 mr-3 h-5 w-5"
                    aria-hidden="true"
                  />
                  Copy address
                </button>
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-base font-medium rounded-md text-gray-500 bg-white border border-gray-400 hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  <ArrowRightOnRectangleIcon
                    className="-ml-1 mr-3 h-5 w-5"
                    aria-hidden="true"
                  />
                  Disconnect
                </button>
              </div>
              <MinimalNotification
                text={notificationText}
                show={show}
                setShow={setShow}
              />
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default AccountModal
