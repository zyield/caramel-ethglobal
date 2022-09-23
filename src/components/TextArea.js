import { useState } from 'react'
import { Tab } from '@headlessui/react'
import {
  AtSymbolIcon,
  CodeBracketIcon,
  LinkIcon
} from '@heroicons/react/20/solid'

import { convert } from '../blog/converter'

import markdown_logo from '../images/markdown.svg'

import MarkdownSyntaxModal from './MarkdownSyntaxModal'
import SetupEPNSChannelModal from './SetupEPNSChannelModal'

import SendEPNSNotificationsToggle from './SendEPNSNotificationsToggle'
import { addresses } from '../utils'

import { ethers } from 'ethers'
import { useContractRead, useNetwork, useAccount } from 'wagmi'

import EPNSCoreProxy from '../abis/EPNSCoreProxy.json'
import ERC20 from '../abis/ERC20.json'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function TextArea({ onSubmit, onCancel, contentURL }) {
  const [text, setText] = useState('')
  const [title, setTitle] = useState('')
  const [open, setOpen] = useState(false)
  const [openEPNSSetup, setOpenEPNSSetup] = useState(false)
  const [userHasChannel, setUserHasChannel] = useState()
  const [daiBalance, setDaiBalance] = useState()
  const [loading, setLoading] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)

  const { chain } = useNetwork()
  const { address, isLoading, isConnected } = useAccount()

  const { data: channelsData, isError: isErrorChannels, isLoading: isLoadingChannels } = useContractRead({
    addressOrName: addresses[chain?.network]?.epns_core,
    contractInterface: EPNSCoreProxy,
    functionName: 'channels',
    args: [address],
    onSuccess(data) {
      if (data && data.channelState === 1) {
        setUserHasChannel(true)
      }
    }
  })

  const { data: daiBalanceData, error: getBalanceError, status: getStatus } = useContractRead({
    addressOrName: addresses[chain?.network]?.dai,
    contractInterface: ERC20,
    functionName: 'balanceOf',
    args: [address],
    onSuccess(data) {
      let balance = ethers.utils.formatUnits(data, 18)
      setDaiBalance(balance)
    }
  })


  const handleSumit = async e => {
    e.preventDefault()
    setLoading(true)

    let payload = text
    if (title) {
      payload = `# ${title}\n${text}`
    }

    if (notificationsEnabled) {
      await broadcastNotification(title)
    }

    await onSubmit(payload)

    setLoading(false)
  }

  const broadcastNotification = (text) => {
    let url = "https://epns-service.herokuapp.com/broadcast"
    let payload = {
      title: text,
      body: 'Please visit my blog to read my new article',
      cta: contentURL
    }

    return fetch(url, {
      body: JSON.stringify(payload),
      method: 'POST',
      headers: {
        'token': 'Ner_awt-CJ@TWUTi!nF2'
      }
    })
      .then(res => res.json())
      .then(({ status }) => console.log(status))

  }

  return (
    <form className="w-full" onSubmit={handleSumit}>
      <div className="relative flex flex-col text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        <input
          type="text"
          name="title"
          onChange={e => setTitle(e.target.value)}
          id="title"
          className="min-w-0 flex-auto appearance-none rounded-md border border-zinc-900/10 bg-white px-3 py-[calc(theme(spacing.2)-1px)] shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10 dark:border-zinc-700 dark:bg-zinc-700/[0.15] dark:text-zinc-200 dark:placeholder:text-zinc-500 dark:focus:border-teal-400 dark:focus:ring-teal-400/10 sm:text-sm"
          placeholder="Title"
        />
      </div>
      <Tab.Group>
        {({ selectedIndex }) => (
          <>
            <Tab.List className="flex items-center mt-5">
              <Tab
                className={({ selected }) =>
                  classNames(
                    selected
                      ? 'bg-zinc-800 font-semibold text-zinc-100 hover:bg-zinc-700 active:bg-zinc-800 active:text-zinc-100/70 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:active:bg-zinc-700 dark:active:text-zinc-100/70'
                      : 'bg-zinc-50 font-medium text-zinc-900 hover:bg-zinc-100 active:bg-zinc-100 active:text-zinc-900/60 dark:bg-zinc-800/50 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:active:bg-zinc-800/50 dark:active:text-zinc-50/70',
                    'rounded-md border border-transparent px-3 py-1.5 text-sm font-medium'
                  )
                }
              >
                Write
              </Tab>
              <Tab
                className={({ selected }) =>
                  classNames(
                    selected
                      ? 'bg-zinc-800 font-semibold text-zinc-100 hover:bg-zinc-700 active:bg-zinc-800 active:text-zinc-100/70 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:active:bg-zinc-700 dark:active:text-zinc-100/70'
                      : 'bg-zinc-50 font-medium text-zinc-900 hover:bg-zinc-100 active:bg-zinc-100 active:text-zinc-900/60 dark:bg-zinc-800/50 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:active:bg-zinc-800/50 dark:active:text-zinc-50/70',
                    'ml-2 rounded-md border border-transparent px-3 py-1.5 text-sm font-medium'
                  )
                }
              >
                Preview
              </Tab>
              <a
                onClick={() => setOpen(true) }
                className='text-zinc-100 cursor-pointer hover:bg-zinc-600 ml-2 rounded-md border border-transparent px-3 py-1.5 text-sm font-medium justify-end text-right align-right'
              >
                <img src={markdown_logo} />
              </a>
            </Tab.List>
            <Tab.Panels className="mt-2">
              {({ selectedIndex }) => (
                <>
                  <Tab.Panel className="-m-0.5 rounded-lg p-0.5">
                    <label htmlFor="comment" className="sr-only">
                      Comment
                    </label>
                    <div>
                      <textarea
                        rows={5}
                        onChange={e => setText(e.target.value)}
                        name="comment"
                        id="comment"
                        className="w-full min-w-0 flex-auto appearance-none rounded-md border border-zinc-900/10 bg-white px-3 py-[calc(theme(spacing.2)-1px)] shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10 dark:border-zinc-700 dark:bg-zinc-700/[0.15] dark:text-zinc-200 dark:placeholder:text-zinc-500 dark:focus:border-teal-400 dark:focus:ring-teal-400/10 sm:text-sm"
                        placeholder="Add your text..."
                        value={text}
                      />
                    </div>
                  </Tab.Panel>
                  <Tab.Panel className="-m-0.5 rounded-lg p-0.5">
                    <div className="border-b dark:border-zinc-700/40">
                      <div className="mx-px mt-px px-3 pt-2 pb-12 text-sm leading-5 text-gray-800">
                        <div
                          className="markdown-preview dark:text-zinc-400 text-left"
                          dangerouslySetInnerHTML={{
                            __html:
                              selectedIndex == 1 ? convert(text) : 'Preview'
                          }}
                        ></div>
                      </div>
                    </div>
                  </Tab.Panel>
                </>
              )}
            </Tab.Panels>
          </>
        )}
      </Tab.Group>
      <div className="flex justify-between">
        <div className="mt-2">
          {
            userHasChannel ?
            <SendEPNSNotificationsToggle enabled={notificationsEnabled} setEnabled={setNotificationsEnabled} /> :
            <button
              type="button"
              onClick={() => setOpenEPNSSetup(true) }
              className="inline-flex items-center gap-2 justify-center rounded-md py-2 px-3 text-sm outline-offset-2 transition active:transition-none bg-zinc-50 font-medium text-zinc-900 hover:bg-zinc-100 active:bg-zinc-100 active:text-zinc-900/60 dark:bg-zinc-800/50 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:active:bg-zinc-800/50 dark:active:text-zinc-50/70"
            >
              Setup EPNS Channel
            </button>
          }
        </div>
        <div className="mt-2">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-2 justify-center rounded-md py-2 px-3 text-sm outline-offset-2 transition active:transition-none bg-zinc-50 font-medium text-zinc-900 hover:bg-zinc-100 active:bg-zinc-100 active:text-zinc-900/60 dark:bg-zinc-800/50 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:active:bg-zinc-800/50 dark:active:text-zinc-50/70"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="ml-5 bg-zinc-800 font-semibold text-zinc-100 hover:bg-zinc-700 active:bg-zinc-800 active:text-zinc-100/70 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:active:bg-zinc-700 dark:active:text-zinc-100/70 inline-flex items-center gap-2 justify-center rounded-md py-2 px-3 text-sm outline-offset-2 transition active:transition-none"
          >
            Publish
          </button>
        </div>
      </div>
      <MarkdownSyntaxModal open={open} setOpen={setOpen} />
      <SetupEPNSChannelModal open={openEPNSSetup} setOpen={setOpenEPNSSetup} daiBalance={daiBalance} />
    </form>
  )
}
