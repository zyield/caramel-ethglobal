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

export const extractEncryptedWalletCID = html => {
  let pattern = /\<span\sid\=\"encryptedWalletCID\"\>(.*)\<\/span\>/gi

  try {
    let match = pattern.exec(html)
    return match[1]
  } catch (error){
    console.error("cid extraction failed")
  }
}

export const extractArweaveWalletAddress = html => {
  let pattern = /owners\"\:\s\[\"(.*)\"\]/gi

  try {
    let match = pattern.exec(html)
    return match[1]
  } catch (error) {
    console.error("wallet address extraction failed")
  }
}
