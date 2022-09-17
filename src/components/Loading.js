import { Puff } from 'svg-loaders-react'

function Loading({ className }) {
  let classes = className ? className : 'flex justify-center pt-40'
  return (
    <div className={classes}>
      <Puff stroke="#333" />
    </div>
  )
}

export default Loading
