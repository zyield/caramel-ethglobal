import { useEffect, useState } from 'react'

import {
  useAccount,
  useContractWrite,
  useContractRead,
  usePrepareContractWrite,
  useProvider,
  useNetwork,
  useEnsName,
  useEnsAddress,
  useConnect,
  useDisconnect
} from 'wagmi'

import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletIcon } from '@heroicons/react/24/outline'
import namehash from '@ensdomains/eth-ens-namehash'

import multiH from 'multihashes'
import multiC from 'multicodec'
import CID from 'cids'

import { addresses } from './utils'

import Blog from './Blog'
import Hero from './components/Hero'
import EnsDomain from './components/EnsDomain'
import Loading from './components/Loading'
import TransactionModal from './components/TransactionModal'
import Connect from './components/Connect'

import PublicResolverABI from './abis/PublicResolver.json'

import { gateways } from './ipfs'
import { extractHashes } from './blog/parser'
import mainLogoWhite from './images/logo_white.svg'

// stolen from
// https://github.com/ensdomains/content-hash/blob/master/src/profiles.js
const hexStringToBuffer = hex => {
  let prefix = hex.slice(0, 2)
  let value = hex.slice(2)
  let res = ''
  if (prefix === '0x') res = value
  else res = hex
  return multiH.fromHexString(res)
}

const decodeContentHash = contentHash => {
  let buffer = hexStringToBuffer(contentHash)
  let codec = multiC.getCodec(buffer)
  let value = multiC.rmPrefix(buffer)
  let cid = new CID(value).toV1()
  let format = cid.codec === 'libp2p-key' ? 'base36' : 'base32'

  return cid.toString(format)
}

function Home() {
  const { chain } = useNetwork()

  const { address, isLoading, isConnected } = useAccount({ fetchEns: true })
  const { data: ensName } = useEnsName({ address })

  const [ensChecked, setEnsChecked] = useState(false)
  const [lookupClicked, setLookupClicked] = useState(false)
  const [manualEnsName, setManualEnsName] = useState('')
  const [manualEnsValid, setManualEnsValid] = useState()
  const [savedPostsHashes, setPostHashes] = useState([])

  const toHex = d =>
    d.reduce((hex, byte) => hex + byte.toString(16).padStart(2, '0'), '')

  const { data: ensAddress, isLoading: isLoadingEnsAddress } = useEnsAddress({
    name: manualEnsName
  })

  const { data, error, write } = useContractWrite({
    mode: 'recklesslyUnprepared',
    addressOrName: addresses[chain?.network]?.ens_public_resolver,
    contractInterface: PublicResolverABI,
    functionName: 'setContenthash',
    overrides: {
      gasLimit: 200000
    }
  })

  const handleEnsLookup = () => {
    setLookupClicked(true)
    if (manualEnsName && !isLoadingEnsAddress) {
      setManualEnsValid(ensAddress?.toLowerCase() === address?.toLowerCase())
    }
  }

  const updateContentHash = async value => {
    const multihash = multiH.fromB58String(value)
    let contentHash =
      '0x' + multiC.addPrefix('ipfs-ns', multihash).toString('hex')
    let nameHash = namehash.hash(ensName)
    await write?.({ recklesslySetUnpreparedArgs: [nameHash, contentHash] })
  }

  const { data: contentHash } = useContractRead({
    addressOrName: addresses[chain?.network]?.ens_public_resolver,
    contractInterface: PublicResolverABI,
    functionName: 'contenthash',
    args: [namehash.hash(ensName || manualEnsName)]
  })

  useEffect(() => {
    if (!contentHash || contentHash == '0x') return // no hash or no posts yet

    let decoded = decodeContentHash(contentHash)
    fetch(`${gateways.infura}/${decoded}`)
      .then(res => res.text())
      .then(extractHashes)
      .then(setPostHashes)
  }, [contentHash])

  if (isLoading) return <Loading />

  if (!address) {
    return (
      <div>
        <Hero />
        <div className="flex justify-center">
          <Connect
            button_text="Get Started"
            custom_style="bg-zinc-800 font-semibold text-zinc-100 hover:bg-zinc-700 active:bg-zinc-800 active:text-zinc-100/70 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:active:bg-zinc-700 dark:active:text-zinc-100/70 rounded-md py-2 px-3 text-lg outline-offset-2 transition active:transition-none"
          />
        </div>
      </div>
    )
  }

  if (ensChecked || manualEnsValid) {
    return (
      <div>
        <Blog
          callback={updateContentHash}
          ensName={ensName || manualEnsName}
          existingPosts={savedPostsHashes}
        />
        {data && data?.hash && <TransactionModal hash={data?.hash} />}
      </div>
    )
  }

  if (!ensName)
    return (
      <div className="text-center">
        <h2 className="text-xl mb-4">
          We couldn't detect an ENS domain for your address
        </h2>
        <p className="mb-8">
          If you have an ENS domain but didn't setup your name server, enter
          your domain below
        </p>
        {manualEnsValid ? (
          <div className="flex justify-center">
            <EnsDomain
              domain={manualEnsName}
              checked={true}
              setChecked={setEnsChecked}
            />
          </div>
        ) : (
          <div className="flex justify-center items-center">
            <div>
              <input
                onChange={e => setManualEnsName(e.target.value)}
                value={manualEnsName}
                type="text"
                name="ens"
                id="ens"
                className="text-2xl py-3 pl-6 pr-8 w-full rounded-md shadow-sm focus:border-zinc-700 focus:ring-zinc-700"
                placeholder="johndoe.eth"
              />
            </div>
            <div className="align-baseline">
              <button
                onClick={handleEnsLookup}
                type="button"
                className="bg-zinc-800 font-semibold text-zinc-100 hover:bg-zinc-700 active:bg-zinc-800 active:text-zinc-100/70 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:active:bg-zinc-700 dark:active:text-zinc-100/70 rounded-md py-2 px-3 text-sm outline-offset-2 transition active:transition-none"
              >
                Look-up
              </button>
            </div>
          </div>
        )}
        {ensChecked || manualEnsValid ? (
          <div className="mt-8">
            <Blog
              callback={updateContentHash}
              ensName={ensName || manualEnsName}
              existingPosts={savedPostsHashes}
            />
          </div>
        ) : manualEnsName && lookupClicked ? (
          <div className="mt-8">It doesn't look like you own that ENS name</div>
        ) : (
          ''
        )}

        {data && data?.hash && <TransactionModal hash={data?.hash} />}
      </div>
    )

  if (isConnected)
    return (
      <div className="dark:text-zinc-400 text-center">
        <h2 className="flex justify-center">
          <img width="250" src={mainLogoWhite} alt="Caramel" />
        </h2>
        <h3 className="mt-10 text-xl mb-4">
          Which domain would you like to use ?
        </h3>
        <div className="flex justify-center">
          <EnsDomain
            domain={ensName}
            checked={ensChecked}
            setChecked={setEnsChecked}
          />
        </div>
        {ensChecked ? (
          <div className="mt-8">
            <Blog
              callback={updateContentHash}
              ensName={ensName || manualEnsName}
              existingPosts={savedPostsHashes}
            />
          </div>
        ) : null}

        {data && data?.hash && <TransactionModal hash={data?.hash} />}
      </div>
    )
}

export default Home
