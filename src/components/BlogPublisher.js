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
    <div>
      <ContentPopup url={contentURL} />
      <p className="mt-4">
        Note that it might take a few minutes for IPFS to update (
        <a
          className="underline"
          target="_blank"
          href={`https://cloudflare-ipfs.com/ipfs/${hash}`}
        >
          IPFS direct link
        </a>
        )
      </p>
      <button
        className="mt-10 inline-flex justify-center items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={() => setContentURL(null)}
      >
        Reset
      </button>
    </div>
  )

  if (contentURL) {
    return (
      <div style={{ maxWidth: 450, margin: '0 auto' }}>{renderSuccess()}</div>
    )
  }

  return (
    <div style={{ maxWidth: 750, margin: '0 auto' }}>
      {isEditing ? (
        <TextArea onCancel={() => setIsEditing(false)} onSubmit={onSubmit} />
      ) : (
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          New Post
        </button>
      )}
    </div>
  )
}

export default BlogPublisher
