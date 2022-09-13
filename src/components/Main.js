import { useState } from 'react'
import Profile from './Profile'
import TextArea from './TextArea'
import ContentPopup from './ContentPopup'
import Post from './Post'

import { addFile, uploadHTML, uploadMarkdown, getContentURL } from '../ipfs'

import storage from '../storage'
import { generate } from '../blog/generator'
import { convert } from '../blog/converter'

function Main({ callback }) {
  const [contentURL, setContentURL] = useState(null)

  const onSubmit = async text => {
    // magic happens here
    console.log(text)

    let mdResponse = await uploadMarkdown(text)

    console.log(mdResponse.Hash)

    if (callback) {
      await callback(mdResponse.Hash)
    }

    let html = await generate([mdResponse.Hash])
    console.log(html)

    let response = await uploadHTML(html)
    console.log(response)

    setContentURL(`https://cloudflare-ipfs.com/ipfs/${response.Hash}`)
  }

  const renderSuccess = () => (
    <div className="flex flex-col justify-center items-center">
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
    <main className="flex justify-center">
      <div className="flex flex-1 flex-col justify-center items-center">
        <div>
          {contentURL ? renderSuccess() : <TextArea onSubmit={onSubmit} />}
        </div>
      </div>
    </main>
  )
}

export default Main
