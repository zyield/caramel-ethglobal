export const extractHashes = html => {
  let pattern = /hashes \= \[[a-zA-Z0-9"\s,]*\]/im

  try {
    let [match] = html.match(pattern)
    return JSON.parse(match.substr(9))
  } catch (error) {
    console.error('html hash extraction failed')
    return []
  }
}
