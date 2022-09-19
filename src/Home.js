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
            custom_style="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          />
        </div>
      </div>
    )
  }

  if (ensChecked || manualEnsValid) {
    return (
      <Blog
        callback={updateContentHash}
        ensName={ensName || manualEnsName}
        existingPosts={savedPostsHashes}
      />
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
                className="text-2xl py-3 pl-6 pr-8 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="johndoe.eth"
              />
            </div>
            <div className="align-baseline">
              <button
                onClick={handleEnsLookup}
                type="button"
                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 align-baseline ml-4"
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
      <div className="text-center">
        <h2 className="text-xl mb-4">Which domain would you like to use ?</h2>
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
