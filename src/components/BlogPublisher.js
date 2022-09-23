import { useState, useEffect } from 'react'
import TextArea from './TextArea'
import ContentPopup from './ContentPopup'

import {
  gateways,
  addFile,
  uploadHTML,
  uploadMarkdown,
  getContentURL
} from '../ipfs'

import storage from '../storage'
import { generate } from '../blog/generator'
import { convert } from '../blog/converter'

const ActionHeading = ({ ensName, onNewPost }) => (
  <div className="md:flex md:items-center md:justify-between">
    <div className="min-w-0 flex-1">
      <h2 className="text-2xl font-bold leading-7 text-zinc-800 dark:text-zinc-100 sm:truncate sm:text-3xl sm:tracking-tight">
        {ensName}
      </h2>
    </div>
    <div className="mt-4 flex md:mt-0 md:ml-4">
      <button
        type="button"
        onClick={onNewPost}
        className="bg-zinc-800 font-semibold text-zinc-100 hover:bg-zinc-700 active:bg-zinc-800 active:text-zinc-100/70 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:active:bg-zinc-700 dark:active:text-zinc-100/70 rounded-md py-2 px-3 text-sm outline-offset-2 transition active:transition-none"
      >
        New Post
      </button>
    </div>
  </div>
)

function BlogPublisher({ callback, ensName, existingPosts = [] }) {
  const [contentURL, setContentURL] = useState(null)
  const [hash, setHash] = useState()
  const [isEditing, setIsEditing] = useState(false)

  const onSubmit = async text => {
    // magic happens here
    let mdResponse = await uploadMarkdown(text)
    let html = await generate({
      hashes: [mdResponse.Hash, ...existingPosts],
      ens: ensName
    })
    let response = await uploadHTML(html)

    if (callback) {
      await callback(response.Hash)
    }

    setHash(response.Hash)
    setContentURL(`https://${ensName}.limo`)
  }

  const renderSuccess = () => (
    <div className="text-center text-zinc-100" style={{ maxWidth: 450, margin: '0 auto' }}>
      <ContentPopup url={contentURL} />
      <p className="mt-4">
        Note that it might take a few minutes for IPFS to update (
        <a
          className="underline"
          target="_blank"
          href={`${gateways.infura}/${hash}`}
        >
          IPFS direct link
        </a>
        )
      </p>
      <button
        className="mt-10 inline-flex justify-center items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-zinc-100 bg-zinc-800 hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500"
        onClick={() => setContentURL(null)}
      >
        Reset
      </button>
    </div>
  )

  if (contentURL) {
    return renderSuccess()
  }

  return (
    <div style={{ maxWidth: 750, margin: '0 auto' }}>
      {isEditing ? (
        <TextArea onCancel={() => setIsEditing(false)} onSubmit={onSubmit} contentURL={contentURL} />
      ) : (
        <ActionHeading ensName={ensName} onNewPost={() => setIsEditing(true)} />
      )}
    </div>
  )
}

export default BlogPublisher
