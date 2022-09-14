import { useState } from 'react'
import TextArea from './TextArea'
import ContentPopup from './ContentPopup'
import Post from './Post'

import { addFile, uploadHTML, uploadMarkdown, getContentURL } from '../ipfs'

import storage from '../storage'
import { generate } from '../blog/generator'
import { convert } from '../blog/converter'

function BlogPublisher({ callback }) {
  const [contentURL, setContentURL] = useState(null)

  const onSubmit = async text => {
    // magic happens here
    console.log(text)

    let mdResponse = await uploadMarkdown(text)
    let html = await generate([mdResponse.Hash])
    let response = await uploadHTML(html)

    if (callback) {
      await callback(response.Hash)
    }

    setContentURL(`https://cloudflare-ipfs.com/ipfs/${response.Hash}`)
  }

  const renderSuccess = () => (
    <div>
      <ContentPopup url={contentURL} />
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
