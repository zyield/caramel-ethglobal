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

  return (
    <main className="flex justify-center">
      <div className="flex flex-1 flex-col justify-center items-center">
        { /* <Profile /> */}
        <div className="mt-20 w-3/5">
          { contentURL 
           ? <ContentPopup url={contentURL} />
           : <TextArea onSubmit={onSubmit} />
          }
        </div>
      </div>
    </main>
  )
}

export default Main
