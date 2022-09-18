import { useState, useEffect } from 'react'
import BlogPublisher from './components/BlogPublisher'
import Post from './components/Post'

import { generate } from './blog/generator'
import { convert } from './blog/converter'
import { gateways } from './ipfs'

const Blog = ({ callback, ensName, existingPosts }) => {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    if (!existingPosts.length) return

    Promise.all(
      existingPosts.map(hash =>
        fetch(`${gateways.infura}/${hash}`).then(res => res.text())
      )
    )
      .then(posts => posts.map(markdown => convert(markdown)))
      .then(setPosts)
  }, [existingPosts])

  const renderPosts = () => {
    if (!posts.length) return null

    return (
      <section style={{ maxWidth: 750, margin: '0 auto' }}>
        <h2 className="text-left"></h2>
        {posts.map(post => (
          <Post html={post} />
        ))}
      </section>
    )
  }

  return (
    <>
      <BlogPublisher
        callback={callback}
        ensName={ensName}
        existingPosts={existingPosts}
      />
      {renderPosts()}
    </>
  )
}

export default Blog
