import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

import AlertError from './AlertError'
import AlertSuccess from './AlertSuccess'
import Stepper from './Stepper'

import ERC20 from '../abis/ERC20.json'
import EPNSCoreProxy from '../abis/EPNSCoreProxy.json'

import { addresses } from '../utils'
import { ethers } from 'ethers'

import TransactionModal from './TransactionModal'

import {
  useContractWrite
} from 'wagmi'

const baseSteps = [
  { name: 'Pick a name', href: '#', status: 'current' },
  { name: 'Approve DAI', href: '#', status: 'upcoming' },
  { name: 'Create Channel', href: '#', status: 'upcoming' }
]

const allComplete = steps => steps.every(({ status }) => status == 'complete')

const deepishCopy = array => {
  return array.map(object => {
    return { ...object }
  })
}



export default function SetupEPNSChannelModal({
  open,
  setOpen,
  address,
  daiBalance,
  chain
}) {
  const [steps, setSteps] = useState(deepishCopy(baseSteps))
  const [done, setDone] = useState(false)
  const [channelName, setChannelName] = useState('')

  let currentStep = steps.find(({ status }) => status == 'current')

  let epnsCoreAddress = addresses[chain?.network]?.epns_core

  const { data: approveDaiData, error: approveDaiError, write: approveDaiWrite } = useContractWrite({
    mode: 'recklesslyUnprepared',
    addressOrName: addresses[chain?.network]?.dai,
    contractInterface: ERC20,
    functionName: 'approve',
    args: [epnsCoreAddress, ethers.utils.parseUnits("50", 18)]
  })

  const { data: createChannelData, error: createChannelError, write: createChannelWrite } = useContractWrite({
    mode: 'recklesslyUnprepared',
    addressOrName: addresses[chain?.network]?.epns_core,
    contractInterface: EPNSCoreProxy,
    functionName: 'createChannelWithFees',
    args: [2, ethers.utils.toUtf8Bytes(channelName), ethers.utils.parseUnits("50", 18)],
    overrides: {
      gasLimit: 1000000
    }
  })

  // shouldn't need this really
  const resetState = () => {
    setSteps(deepishCopy(baseSteps))
    setDone(false)
    setChannelName('')
  }

  const moveOn = () => {
    let updatedSteps = [...steps].map((step, i) => {
      // already complete
      if (step.status == 'complete') return step

      // update current to complete
      if (step.name == currentStep?.name) {
        step.status = 'complete'
        return step
      }

      // move the next to current
      if (steps[i - 1]?.status == 'complete') {
        step.status = 'current'
        return step
      }

      return step
    })

    if (allComplete(updatedSteps)) setDone(true)

    setSteps(updatedSteps)
  }

  const pickName = () => moveOn()

  console.log("approveDaiError", approveDaiError)
  console.log("addresses[chain?.network]?.dai", addresses[chain?.network]?.dai)
  console.log("ensCoreAddress", epnsCoreAddress)

  const approveDai = async () => {
    // approve DAI tx

    await approveDaiWrite?.({ recklesslySetUnpreparedArgs: [epnsCoreAddress, ethers.utils.parseUnits("50", 18)] })

    console.log('approving dai step action ')
    moveOn()
  }

  const createChannel = async () => {
    // createChannelTX

    await createChannelWrite?.({ recklesslySetUnpreparedArgs: [2, ethers.utils.toUtf8Bytes(channelName), ethers.utils.parseUnits("50", 18)]})

    console.log('creating channel step action')
    moveOn()
  }

  const renderNameStep = () => (
    <div className="mt-8 w-1/2">
      <label htmlFor="name" className="block text-lg font-medium text-gray-700">
        Pick a channel name
      </label>
      <div className="mt-1">
        <input
          type="text"
          name="name"
          onChange={e => setChannelName(e.target.value)}
          id="name"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="myname.eth"
        />
      </div>

      <button
        type="button"
        onClick={pickName}
        className="inline-flex items-center rounded border border-transparent bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mt-4"
      >
        Continue
      </button>
    </div>
  )

  const renderApproveStep = () => (
    <div className="mt-8 w-1/2">
      <h3 className="block text-lg font-medium text-gray-700">Approve DAI</h3>
      {daiBalance < 50.0 && (
        <AlertError
          title="Your DAI balance is insufficient"
          body="You need at least 50 DAI in your wallet to create a channel."
        />
      )}
      <p className="mt-4">Balance: {daiBalance}</p>
      <button
        type="button"
        onClick={approveDai}
        className="inline-flex items-center rounded border border-transparent bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mt-4"
      >
        Approve transaction
      </button>
    </div>
  )

  const renderCreateChannelStep = () => (
    <div className="mt-8 w-1/2">
      <h3 className="block text-lg font-medium text-gray-700">
        Create Channel
      </h3>
      <p className="mt-4 text-base">
        You will be prompted to sign a transaction creating your new channel
        with the name <b>{channelName}</b>
      </p>
      <button
        type="button"
        onClick={createChannel}
        className="inline-flex items-center rounded border border-transparent bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mt-4"
      >
        Create Channel
      </button>
    </div>
  )

  const renderStep = () => {
    switch (currentStep?.name) {
      case 'Pick a name':
        return renderNameStep()
      case 'Approve DAI':
        return renderApproveStep()
      case 'Create Channel':
        return renderCreateChannelStep()
      default:
        return null
    }
  }

  const renderSuccess = () => (
    <div className="mt-8">
      <AlertSuccess text="Channel created!" />
      <button
        type="button"
        onClick={resetState}
        className="inline-flex items-center rounded border border-transparent bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mt-4"
      >
        Reset
      </button>
    </div>
  )

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-lg">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-xl font-medium text-gray-900">
                          Create an EPNS channel
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={() => setOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      {/* Replace with your content */}
                      <div className="absolute inset-0 px-4 sm:px-6">
                        <Stepper steps={steps} />
                        <div className="flex text-center justify-center flex-col items-center">
                          {done ? renderSuccess() : renderStep()}
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
          {
            approveDaiData && approveDaiData?.hash &&
            <TransactionModal hash={approveDaiData?.hash} />
          }
          {
            createChannelData && createChannelData?.hash &&
            <TransactionModal hash={createChannelData?.hash} />
          }
        </div>
      </Dialog>
    </Transition.Root>
  )
}
