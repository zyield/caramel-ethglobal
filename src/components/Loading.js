import { Puff } from 'svg-loaders-react';

function Loading({className}) {
  let classes = className ? className : "flex justify-center pt-40"
  return (
    <div className={classes}>
      <Puff />
    </div>
  )
}

export default Loading
