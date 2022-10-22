import { useState, useEffect } from 'react'
import BlogPublisher from './components/BlogPublisher'
import Post from './components/Post'
import RemoveButton from './components/RemoveButton'
import DeletePostModal from './components/modals/DeletePost'
import ContentPopup from './components/ContentPopup'

import { generate } from './blog/generator'
import { convert } from './blog/converter'
import { gateways, uploadHTML } from './ipfs'

import { useAccount, useSigner } from 'wagmi'

import { decryptWallet, markAsDeleted } from './utils/arweave'

const Blog = ({ callback, ensName, existingPosts, setExistingPosts, encryptedWalletData }) => {
  const [contentURL, setContentURL] = useState(null)
  const [posts, setPosts] = useState([])
  const [ipfsHash, setIpfsHash] = useState()
  const [selectedForRemoval, setSelectedForRemoval] = useState(null)
  const { address } = useAccount()
  const { data: signer } = useSigner()
  const [arweaveKey, setArweaveKey] = useState()

  useEffect(() => {
    async function execute(signer, encryptedData) {
      let key = await decryptWallet(signer, encryptedData)
      setArweaveKey(key)
    }

    if (signer && encryptedWalletData) {
      execute(signer, encryptedWalletData)
    }
  }, [encryptedWalletData, signer])

  let deleteModalOpen = Boolean(selectedForRemoval)

  const RemovePost = async () => {
    let id = selectedForRemoval
    console.log("id", id)
    let response = await markAsDeleted(arweaveKey, id)

    let newPosts = [...existingPosts]

    let index = newPosts.findIndex(p => p == id)
    if (index > -1) newPosts.splice(index, 1)

    setExistingPosts(newPosts)

    //let html = await generate({
    //  hashes: newPosts,
    //  ens: ensName
    //})

    //let response = await uploadHTML(html)

    //if (callback) {
    //  await callback(response.Hash)
    //}

    //setIpfsHash(response.Hash)
    //setContentURL(`https://${ensName}.limo`)
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
          <div className="relative" key={existingPosts[i]}>
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

  return (
    <>
      {contentURL && renderSuccess()}
      <BlogPublisher
        callback={callback}
        ensName={ensName}
        existingPosts={existingPosts}
      />
      {renderPosts()}
      <DeletePostModal
        onClickConfirm={RemovePost}
        open={deleteModalOpen}
        setOpen={() => setSelectedForRemoval(null)}
      />
    </>
  )
}

export default Blog
