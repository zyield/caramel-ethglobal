export const gateways = {
  pinata: 'https://gateway.pinata.cloud/ipfs',
  infura: 'https://caramel.infura-ipfs.io/ipfs',
  cloudflare: 'https://cloudflare-ipfs.com/ipfs'
}

export const getContentURL = (key, mirror = 'pinata') =>
  `${gateways[mirror]}/${key}`

// Infura
export const uploadFile = async ({ content, name, type }) => {
  let username = process.env.REACT_APP_INFURA_USERNAME
  let secret = process.env.REACT_APP_INFURA_SECRET
  let url = 'https://ipfs.infura.io:5001/api/v0/add'

  let file = new File([content], name, { type })

  let formData = new FormData()
  formData.append('file', file)

  let result = await fetch(url, {
    method: 'post',
    headers: {
      Authorization: `Basic ${btoa(username + ':' + secret)}`
    },
    body: formData
  })

  return result.json()
}

export const uploadContent = async (content) => {
  let username = process.env.REACT_APP_INFURA_USERNAME
  let secret = process.env.REACT_APP_INFURA_SECRET
  let url = 'https://ipfs.infura.io:5001/api/v0/add'

  let result = await fetch(url, {
    method: 'post',
    headers: {
      Authorization: `Basic ${btoa(username + ':' + secret)}`
    },
    body: content
  })

  return result.json()
}

export const uploadMarkdown = async markdown =>
  uploadFile({ content: markdown, name: 'blog.md', type: 'text/markdown' })

export const uploadHTML = async html =>
  uploadFile({ content: html, name: 'index.html', type: 'text/html' })
