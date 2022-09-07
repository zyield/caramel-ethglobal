import { pin } from '@snapshot-labs/pineapple'

const mirrors = {
  pinata: 'https://gateway.pinata.cloud/ipfs'
}

export const upload = data => pin(data)

export const getContentURL = (key, mirror = 'pinata') =>
  `${mirrors[mirror]}/${key}`
