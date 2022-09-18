const Post = ({ html }) => (
  <article
    className="markdown-preview pb-5 border-b my-5 text-left"
    dangerouslySetInnerHTML={{ __html: html }}
  ></article>
)

export default Post
