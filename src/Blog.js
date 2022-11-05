import { useState, useEffect, useRef } from 'react'
import BlogPublisher from './components/BlogPublisher'
import Post from './components/Post'
import RemoveButton from './components/RemoveButton'
import DeletePostModal from './components/modals/DeletePost'
import ContentPopup from './components/ContentPopup'

import ArweaveWalletModal from './components/ArweaveWalletModal'

import { generate } from './blog/generator'
import { convert } from './blog/converter'
import { gateways, uploadHTML } from './ipfs'

import { useAccount, useSigner, useProvider } from 'wagmi'

import { decryptWallet, getAddress, markAsDeleted } from './utils/arweave'

import { useArweaveWalletStore } from './providers/ArweaveWalletContext'

import { generateArweaveWallet } from './utils/arweave'

const Blog = ({ callback, ensName, existingPosts, setExistingPosts, setEncryptedWalletData, encryptedWalletData, rootCID }) => {
  const [contentURL, setContentURL] = useState(null)
  const [posts, setPosts] = useState([])
  const [ipfsHash, setIpfsHash] = useState()
  const [selectedForRemoval, setSelectedForRemoval] = useState(null)
  const { address } = useAccount()
  const { data: signer } = useSigner()
  const [arweaveKey, setArweaveKey] = useState()
  const [arweaveWalletFirstTime, setArweaveWalletFirstTime] = useState()
  const arweaveStore = useArweaveWalletStore()
  const [openArweaveModal, setOpenArweaveModal] = useState(false)
  const [arweaveWalletAddress, setArweaveWalletAddress] = useState()

  const initializeArweaveWallet = async () => {
    let { wallet, encryptedWalletData } = await generateArweaveWallet(signer, address)
    let arweaveAddress = await getAddress(wallet)
    setArweaveWalletAddress(arweaveAddress)
    setEncryptedWalletData(encryptedWalletData)
    sessionStorage.setItem("arweaveKey", JSON.stringify(wallet))
    arweaveStore.setKey(wallet)
    arweaveStore.setWalletAddress(arweaveAddress)
    setArweaveWalletFirstTime(true)
    setArweaveKey(wallet)
    setOpenArweaveModal(true)
  }

  useEffect(() => {
    async function execute(address, encryptedData) {
      let key, stringKey
      let sessionKey = sessionStorage.getItem("arweaveKey")
      let provider = await arweaveStore.getProvider()

      if (sessionKey) {
        key = JSON.parse(sessionKey)
      } else {
        key = await decryptWallet(provider, address, encryptedData)
        stringKey = JSON.stringify(key)
        sessionStorage.setItem("arweaveKey", stringKey)
      }

      setArweaveKey(key)
      let arweaveAddress = await getAddress(key)
      arweaveStore.setKey(stringKey)
      arweaveStore.setWalletAddress(arweaveAddress)
      setArweaveWalletAddress(arweaveAddress)
    }

    if (address && encryptedWalletData && !arweaveKey) {
      execute(address, encryptedWalletData)
    }
  }, [])

  useEffect(() => {

    async function fetch_and_store(wallet) {
      let arweaveAddress = await getAddress(wallet)
      setArweaveWalletAddress(arweaveAddress)
      sessionStorage.setItem("arweaveKey", JSON.stringify(wallet))
      arweaveStore.setKey(wallet)
      arweaveStore.setWalletAddress(arweaveAddress)
      setArweaveKey(wallet)
    }

    let key = sessionStorage.getItem("arweaveKey")

    if (key) {
      fetch_and_store(JSON.parse(key))
    }

  }, [])

  let deleteModalOpen = Boolean(selectedForRemoval)

  const RemovePost = async () => {
    let id = selectedForRemoval
    let response = await markAsDeleted(arweaveKey, id)

    let newPosts = [...existingPosts]

    let index = newPosts.findIndex(p => p == id)
    if (index > -1) newPosts.splice(index, 1)

    setExistingPosts(newPosts)
  }

  useEffect(() => {
    if (!existingPosts.length) return

    Promise.all(
      existingPosts.map(id =>
        fetch(`https://bnjr5drbo27dam2cmqdbijmmof7mnxlydfjoywtwbdofa3uzol7q.arweave.net/${id}`).then(res => res.text())
      )
    )
      .then(posts => posts.map(markdown => convert(markdown)))
      .then(setPosts)
  }, [existingPosts])

  const renderPosts = () => {
    if (!posts.length) return null

    return (
      <section style={{ maxWidth: 750, margin: '0 auto' }}>
        {posts.map((post, i) => (
          <div className="relative" key={i}>
            <RemoveButton
              onClick={() => setSelectedForRemoval(existingPosts[i])}
              className="absolute right-0 top-2"
            />
            <Post html={post} />
          </div>
        ))}
      </section>
    )
  }

  // TODO: extract in component, duplicated from Publisher
  const renderSuccess = () => (
    <div
      className="text-center text-zinc-100 mt-10"
      style={{ maxWidth: 450, margin: '0 auto' }}
    >
      <ContentPopup url={contentURL} />
      <p className="mt-4">
        Note that it might take a few minutes for IPFS to update (
        <a
          className="underline"
          target="_blank"
          href={`${gateways.infura}/${ipfsHash}`}
        >
          IPFS direct link
        </a>
        )
      </p>
      <button
        className="mt-10 inline-flex justify-center items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-zinc-100 bg-zinc-800 hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500"
        onClick={() => window.location.reload()}
      >
        Ok, refresh page
      </button>
    </div>
  )

  if (!encryptedWalletData && !arweaveKey ) {
    return (
      <div className="text-white">
        <h1>It looks like you don't have an Arweave Wallet</h1>
        <button
        type="button"
        onClick={() => initializeArweaveWallet()}
        className="block items-center rounded-md border border-transparent bg-teal-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 mt-4"
      >
        Generate Arweave Wallet
      </button>

      <p className="bg-zinc-800 p-2 mt-4 text-center">
        You will be prompted to export your MetaMask public key. We will use this key to encrypt your newly generated Arweve Wallet
      </p>
      </div>
    )
  }

  return (
    <>
      {contentURL && renderSuccess()}
      <BlogPublisher
        callback={callback}
        ensName={ensName}
        existingPosts={existingPosts}
        encryptedWalletData={encryptedWalletData}
        setEncryptedWalletData={setEncryptedWalletData}
        arweaveKey={arweaveKey}
        arweaveWalletAddress={arweaveWalletAddress}
        rootCID={rootCID}
      />
      {renderPosts()}
      <DeletePostModal
        onClickConfirm={RemovePost}
        open={deleteModalOpen}
        setOpen={() => setSelectedForRemoval(null)}
      />
      <ArweaveWalletModal open={openArweaveModal} setOpen={setOpenArweaveModal} address={arweaveWalletAddress} />
    </>
  )
}

export default Blog
