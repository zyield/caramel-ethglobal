export const extractHashes = html => {
  let pattern = /\[[a-zA-Z0-9"\s,]*\]/mi

  try {
    let [match] = html.match(pattern)
    return JSON.parse(match)
  } catch(error) {
    console.error('html hash extraction failed')
    return []
  }
}
