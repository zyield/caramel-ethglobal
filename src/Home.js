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
  useDisconnect,
  useWaitForTransaction,
  useSigner
} from 'wagmi'

import { WalletIcon } from '@heroicons/react/24/outline'
import namehash from '@ensdomains/eth-ens-namehash'

import multiH from 'multihashes'
import multiC from 'multicodec'
import CID from 'cids'

import { addresses } from './utils'
import { fetchTransactions, fetchTombstones } from './utils/arweave'

import Blog from './Blog'
import Hero from './components/Hero'
import EnsDomain from './components/EnsDomain'
import Loading from './components/Loading'
import TransactionModal from './components/TransactionModal'
import Connect from './components/Connect'

import PublicResolverABI from './abis/PublicResolver.json'

import { gateways } from './ipfs'
import { extractHashes, extractEncryptedWalletCID, extractArweaveWalletAddress } from './blog/parser'
import mainLogoWhite from './images/logo_white.svg'

import { useArweaveWalletStore } from './providers/ArweaveWalletContext'

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

const toHexString = arr => Array.from(arr, i => i.toString(16).padStart(2, "0")).join("")

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
  const { provider } = useProvider()
  const { address, isLoading, isConnected } = useAccount({ fetchEns: true })
  const { data: ensName } = useEnsName({ address })
  const { data: signer } = useSigner()
  const [ensChecked, setEnsChecked] = useState(false)
  const [lookupClicked, setLookupClicked] = useState(false)
  const [manualEnsName, setManualEnsName] = useState('')
  const [manualEnsValid, setManualEnsValid] = useState()
  const [arweaveIds, setArweaveIds] = useState([])
  const [arweaveWalletCID, setArweaveWalletCID] = useState()
  const [arweaveWalletAddress, setArweaveWalletAddress] = useState()
  const [encryptedWalletData, setEncryptedWalletData] = useState()
  const [rootCID, setRootCID] = useState()
  const arweaveStore = useArweaveWalletStore()
  const [arweaveWalletNotSet, setArweaveWalletNotSet] = useState()

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

  const { status } = useWaitForTransaction({
    hash: data?.hash
  })

  const handleEnsLookup = () => {
    setLookupClicked(true)
    if (manualEnsName && !isLoadingEnsAddress) {
      //setManualEnsValid(ensAddress?.toLowerCase() === address?.toLowerCase())
      setManualEnsValid(true)
    }
  }

  const updateContentHash = async value => {
    const multihash = multiH.fromB58String(value)
    let ipfsns = multiC.addPrefix('ipfs-ns', multihash)
    let contentHash =
      '0x' + toHexString(ipfsns)
    let nameHash = namehash.hash(ensName || manualEnsName)
    await write?.({ recklesslySetUnpreparedArgs: [nameHash, contentHash] })
  }

  const { data: contentHash } = useContractRead({
    addressOrName: addresses[chain?.network]?.ens_public_resolver,
    contractInterface: PublicResolverABI,
    functionName: 'contenthash',
    args: [namehash.hash(ensName || manualEnsName)]
  })

  useEffect(() => {
    if (!contentHash || contentHash == '0x' || contentHash == '0x0000000000000000000000000000000000000000') {
      setArweaveWalletNotSet(true)
      return
    }

    let decoded = decodeContentHash(contentHash)
    setRootCID(decoded)

    fetch(`${gateways.infura}/${decoded}`)
      .then(res => res.text())
      .then((html) => {
        let address = extractArweaveWalletAddress(html)
        let walletCID = extractEncryptedWalletCID(html)
        return { address, walletCID }
      })
      .then(({ address, walletCID}) => {
        setArweaveWalletAddress(address)
        setArweaveWalletCID(walletCID)

        fetchTombstones(address).then((tombstones) => {
          return fetchTransactions(address, tombstones)
        })
        .then(setArweaveIds)
      })

  }, [contentHash])

  useEffect(() => {
    function fetchWalletData(cid) {
      fetch(`${gateways.infura}/${cid}`)
      .then(res => res.text())
      .then(setEncryptedWalletData)
    }

    if (arweaveWalletCID) {
      fetchWalletData(arweaveWalletCID)
    }
  }, [arweaveWalletCID])

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
          existingPosts={arweaveIds}
          setEncryptedWalletData={setEncryptedWalletData}
          setExistingPosts={setArweaveIds}
          encryptedWalletData={encryptedWalletData}
          rootCID={rootCID}
        />
        {data && data?.hash && <TransactionModal hash={data?.hash} />}
      </div>
    )
  }

  if (!ensName)
    return (
      <div className="text-zinc-100 text-center">
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
                className="text-2xl flex-auto appearance-none rounded-md border px-3 py-[calc(theme(spacing.2)-1px)] shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10 dark:border-zinc-700 dark:bg-zinc-700/[0.15] dark:text-zinc-200 dark:placeholder:text-zinc-500 dark:focus:border-teal-400 dark:focus:ring-teal-400/10 sm:text-sm"
                placeholder="johndoe.eth"
              />
            </div>
            <div className="align-baseline">
              <button
                onClick={handleEnsLookup}
                type="button"
                className="ml-5 bg-zinc-800 font-semibold text-zinc-100 hover:bg-zinc-700 active:bg-zinc-800 active:text-zinc-100/70 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:active:bg-zinc-700 dark:active:text-zinc-100/70 rounded-md py-2 px-3 text-sm outline-offset-2 transition active:transition-none"
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
              existingPosts={arweaveIds}
              setEncryptedWalletData={setEncryptedWalletData}
              setExistingPosts={setArweaveIds}
              rootCID={rootCID}
              encryptedWalletData={encryptedWalletData}
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
              existingPosts={arweaveIds}
              setExistingPosts={setArweaveIds}
              setEncryptedWalletData={setEncryptedWalletData}
              rootCID={rootCID}
              encryptedWalletData={encryptedWalletData}
            />
          </div>
        ) : null}

        {data && data?.hash && <TransactionModal hash={data?.hash} />}
      </div>
    )
}

export default Home
