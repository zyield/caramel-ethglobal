const Post = ({ html }) => (
  <article
    className="markdown-preview prose dark:prose-invert pb-5 border-b dark:border-zinc-700/40 my-5 text-left"
    dangerouslySetInnerHTML={{ __html: html }}
  ></article>
)

export default Post
