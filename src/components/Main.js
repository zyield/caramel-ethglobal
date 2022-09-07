import { useState } from 'react'
import Profile from './Profile'
import TextArea from './TextArea'
import ContentPopup from './ContentPopup'

import { upload, getContentURL } from '../ipfs'


function Main() {
  const [contentURL, setContentURL] = useState(null)

  const onSubmit = async data => {
    let receipt = await upload(data)
    console.log(receipt)

    let url = getContentURL(receipt.cid)
    setContentURL(url)
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
        { /* <Profile /> */}
        <div className=" w-3/5">
          { contentURL 
           ? renderSuccess()
           : <TextArea onSubmit={onSubmit} />
          }
        </div>
      </div>
    </main>
  )
}

export default Main
