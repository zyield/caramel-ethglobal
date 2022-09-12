import { ethers } from 'ethers'

export const truncateAddress = address => {
  let beginning = address.slice(0, 5)
  let end = address.slice(address.length - 5, address.length)

  return `${beginning}...${end}`
}
