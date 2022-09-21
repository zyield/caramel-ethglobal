import { ethers } from 'ethers'

import {
  encodeContenthash,
  decodeContenthash,
  isValidContenthash
} from './content_hash'

import { addresses } from './network'

const truncateAddress = address => {
  let beginning = address.slice(0, 5)
  let end = address.slice(address.length - 5, address.length)

  return `${beginning}...${end}`
}

export {
  truncateAddress,
  // contents utils
  encodeContenthash,
  decodeContenthash,
  isValidContenthash,
  addresses
}
