import { useEffect, useState } from 'react'
import { useAccount, useContractWrite, usePrepareContractWrite, useProvider, useEnsName, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletIcon } from '@heroicons/react/24/outline'
import namehash from "@ensdomains/eth-ens-namehash"

import { CID } from 'multiformats/cid'

import EnsDomain from "./EnsDomain"
import Main from "./Main"
import Loading from "./Loading"

import PublicResolverABI from "../abis/PublicResolver.json"

function Profile() {
  const { address, isLoading, isConnected } = useAccount({fetchEns: true})
  const { data: ensName } = useEnsName({ address })

  const [ensChecked, setEnsChecked] = useState(false)

  const toHex = d => d.reduce((hex, byte) => hex + byte.toString(16).padStart(2, '0'), '')

  console.log("abi", PublicResolverABI)
    
  const { data, error, write } = useContractWrite(
    {
      mode: "recklesslyUnprepared",
      addressOrName: "0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41",
      contractInterface: PublicResolverABI,
      functionName: 'setContenthash',
      overrides: {
        gasLimit: 80000
      }
    }
  )

  const updateContentHash = async (cid) => {
    let parsedCid = CID.parse(cid)
    let hash = toHex(parsedCid.multihash.digest)

    let contentHash = "" // TODO fix this
    let nameHash = namehash.hash(ensName)

    await write?.({ recklesslySetUnpreparedArgs: [nameHash, contentHash]})
  }

  if (isLoading) return <Loading />

  if (!address) {
    return (
      <div
        className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
        <WalletIcon className="mx-auto h-12 w-12 text-gray-400" />
        <span className="mt-2 block text-sm font-medium text-gray-900">Connect your wallet to continue</span>
      </div>
    )
  }

  if (isConnected)
    return (
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-xl mb-4">Which domain would you like to use ?</h2>
        <EnsDomain domain={ensName} checked={ensChecked} setChecked={setEnsChecked} />
        {ensChecked ? (
          <div className="mt-8">
            <Main callback={updateContentHash} />
          </div>
        ) : (
          null
        )}
      </div>
    )
}

export default Profile
