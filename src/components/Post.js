const Post = ({ text, timestamp }) => (
  <div key={timestamp}>
    <p className="text-sm text-gray-500">
      <time dateTime={timestamp}>{Date(timestamp)}</time>
    </p>
    <p className="mt-3 text-base text-gray-500">{text}</p>
    <div className="mt-3"></div>
  </div>
)

export default Post
