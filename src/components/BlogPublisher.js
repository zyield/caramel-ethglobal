import { useState } from 'react'
import TextArea from './TextArea'
import ContentPopup from './ContentPopup'
import Post from './Post'

import { addFile, uploadHTML, uploadMarkdown, getContentURL } from '../ipfs'

import storage from '../storage'
import { generate } from '../blog/generator'
import { convert } from '../blog/converter'

function BlogPublisher({ callback, ens_name }) {
  const [contentURL, setContentURL] = useState(null)
  const [hash, setHash] = useState()

  const onSubmit = async text => {
    // magic happens here
    console.log(text)

    let mdResponse = await uploadMarkdown(text)
    let html = await generate({
      hashes: [mdResponse.Hash],
      ens: ens_name
    })
    let response = await uploadHTML(html)

    if (callback) {
      await callback(response.Hash)
    }

    setHash(response.Hash)
    setContentURL(`https://${ens_name}.limo`)
  }

  const renderSuccess = () => (
    <div>
      <ContentPopup url={contentURL} />
      <p className="mt-4">Note that it might take a few minutes for IPFS to update (<a className="underline" target="_blank" href={`https://cloudflare-ipfs.com/ipfs/${hash}`}>IPFS direct link</a>)</p>
      <button
        className="mt-10 inline-flex justify-center items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={() => setContentURL(null)}
      >
        Reset
      </button>
    </div>
  )

  return (
    <div>
      {contentURL ? renderSuccess() : <TextArea onSubmit={onSubmit} />}
    </div>
  )
}

export default BlogPublisher
