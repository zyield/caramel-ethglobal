import { useCallback } from 'react'
import { SlateReactPresentation } from 'slate-react-presentation'
import { Leaf, Element } from './Editor'


const Post = ({ content }) => {
  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])

  return (
    <article className="markdown-preview prose dark:prose-invert pb-5 border-b dark:border-zinc-700/40 my-5 text-left">
      <SlateReactPresentation
        value={content}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
      />
    </article>
  )
}

export default Post
