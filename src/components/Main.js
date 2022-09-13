import { useState } from 'react'
import Profile from './Profile'
import TextArea from './TextArea'
import ContentPopup from './ContentPopup'
import Post from './Post'

import { addFile, uploadHTML, uploadMarkdown, getContentURL } from '../ipfs'
import storage from '../storage'
import { generate } from '../blog/generator'
import { convert } from '../blog/converter'

const savePost = text => {
  let posts = storage.retrieve('posts')

  if (!posts) {
    storage.save('posts', JSON.stringify([{ text, timestamp: Date.now() }]))
    return
  }

  try {
    posts = JSON.parse(posts)
  } catch {
    console.log('here')
    posts = []
  } finally {
    storage.save(
      'posts',
      JSON.stringify([...posts, { text, timestamp: Date.now() }])
    )
  }
}

const getPosts = () => {
  let posts = storage.retrieve('posts') || []
  try {
    posts = JSON.parse(posts)
  } catch {
    posts = []
  }
  return posts.sort((a, b) => b.timestamp - a.timestamp)
}

function Main() {
  const [contentURL, setContentURL] = useState(null)
  const [posts, setPosts] = useState(getPosts())

  const onSubmit = async text => {
    // magic happens here
    console.log(text)

    let mdResponse = await uploadMarkdown(text)
    console.log(mdResponse.Hash)

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
        {/* <Profile /> */}
        <div>
          {contentURL ? renderSuccess() : <TextArea onSubmit={onSubmit} />}
        </div>

        {posts.map(post => (
          <Post text={post.text} timestamp={post.timestamp} />
        ))}
      </div>
    </main>
  )
}

export default Main
