import { useState, useEffect } from 'react'
import TextArea from './TextArea'
import ContentPopup from './ContentPopup'
import Post from './Post'

import { addFile, uploadHTML, uploadMarkdown, getContentURL } from '../ipfs'

import storage from '../storage'
import { generate } from '../blog/generator'
import { convert } from '../blog/converter'

function BlogPublisher({ callback, ensName, existingPosts = [] }) {
  const [contentURL, setContentURL] = useState(null)
  const [hash, setHash] = useState()
  const [posts, setPosts] = useState([])

  useEffect(() => {
    if (!existingPosts.length) return

    Promise.all(
      existingPosts.map(hash =>
        fetch('https://gateway.pinata.cloud/ipfs/' + hash).then(res =>
          res.text()
        )
      )
    )
      .then(posts => posts.map(markdown => convert(markdown)))
      .then(setPosts)
  }, [existingPosts])

  const onSubmit = async text => {
    // magic happens here
    console.log(text)

    let mdResponse = await uploadMarkdown(text)
    let html = await generate({
      hashes: [mdResponse.Hash],
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

  const renderPosts = () => {
    if (!posts.length) return null

    return (
      <section>
        <h2 className="text-left">Previously published:</h2>
        {posts.map(post => (
          <article
            className="pb-5 border-b my-5 text-left"
            dangerouslySetInnerHTML={{ __html: post }}
          ></article>
        ))}
      </section>
    )
  }

  if (contentURL) {
    ;<div style={{ maxWidth: 450, margin: '0 auto' }}>{renderSuccess()}</div>
  }

  return (
    <div style={{ maxWidth: 750, margin: '0 auto' }}>
      <TextArea onSubmit={onSubmit} />
      {renderPosts()}
    </div>
  )
}

export default BlogPublisher
