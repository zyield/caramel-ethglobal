import { encrypt, decrypt } from './trezor'
import Arweave from 'arweave';

var ethUtil = require('ethereumjs-util')
var sigUtil = require('@metamask/eth-sig-util')

const arweave = Arweave.init({
  host:'arweave.net',
  port: 443,
  protocol: 'https'
});

var ethUtil = require('ethereumjs-util');
var sigUtil = require("@metamask/eth-sig-util")

const chunkSubstr = (str, size) => {
  const numChunks = Math.ceil(str.length / size)
  const chunks = new Array(numChunks)

  for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
    chunks[i] = str.substr(o, size)
  }

  return chunks
}

export async function getBalance(address) {
  let winston = await arweave.wallets.getBalance(address)
  let ar = arweave.ar.winstonToAr(winston);
  return ar
}

export async function generateArweaveWallet(connect, address)  {
  let arweaveKey = await arweave.wallets.generate()
  let walletData = { wallet_data: arweaveKey }
  let walletDataString = JSON.stringify(walletData)

  try {
    let key = await window.ethereum
      .request({
        method: 'eth_getEncryptionPublicKey',
        params: [address], // you must have access to the specified account
      })

    let keyBytes = Buffer.from(key)
    let encryptedWalletString = ethUtil.bufferToHex(
      Buffer.from(
        JSON.stringify(
          sigUtil.encrypt({
            publicKey: keyBytes,
            data: walletDataString,
            version:'x25519-xsalsa20-poly1305'
          })
        )
      )
    )

    return { wallet: arweaveKey, encryptedWalletData: encryptedWalletString }

  } catch (e) {

    alert("We are currently not supporting hardware wallets connected via Metamask")

    //let walletParts = chunkSubstr(walletDataString, 1024)

    //let payload = walletParts.map((part, index) => {
    //  let bufferPart = Buffer.from(part)
    //  let hexVal = ethUtil.bufferToHex(bufferPart).slice(2)

    //  localStorage.setItem(`part ${index}`, hexVal)

    //  return {
    //    path: "m/49'/0'/0'",
    //    key: `Part ${index+1}/4`,
    //    value: hexVal,
    //    encrypt: true,
    //    askOnEncrypt: true,
    //    askOnDecrypt: true
    //  }
    //})

    //let encryptedWalletString = await encrypt(connect, payload)

    //return { wallet: arweaveKey, encryptedWalletData: encryptedWalletString }
  }

}

export async function encryptWallet(address, wallet) {
  let walletData = { wallet_data: wallet }
  let walletDataString = JSON.stringify(walletData)

  let key = await window.ethereum
    .request({
      method: 'eth_getEncryptionPublicKey',
      params: [address], // you must have access to the specified account
    })

  let keyBytes = Buffer.from(key)
  let encryptedWalletString = ethUtil.bufferToHex(
    Buffer.from(
      JSON.stringify(
        sigUtil.encrypt({
          publicKey: keyBytes,
          data: walletDataString,
          version:'x25519-xsalsa20-poly1305'
        })
      )
    )
  )

  return encryptedWalletString
}

export async function decryptWallet(connect, address, data) {

  try {
    let key = await window.ethereum
      .request({
        method: 'eth_decrypt',
        params: [data, address],
      })

    return JSON.parse(key).wallet_data

  } catch (error) {
    let decrypted = await decrypt(connect, data)
    return decrypted
  }
}

export async function getAddress(key) {
  let address = await arweave.wallets.jwkToAddress(key)
  return address
}

export async function upload(key, content) {

  let transaction = await arweave.createTransaction({
    data: content
  }, key)

  transaction.addTag('Content-Type', 'text/plain')
  transaction.addTag('App-Name', 'Caramel')

  await arweave.transactions.sign(transaction, key)

  let uploader = await arweave.transactions.getUploader(transaction)

  while (!uploader.isComplete) {
    await uploader.uploadChunk()
    //console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`)
  }
}

export async function markAsDeleted(key, id) {
  let transaction = await arweave.createTransaction({
    data: id
  }, key)

  transaction.addTag('Tombstone', "true")
  transaction.addTag('Id', id)
  transaction.addTag('App-Name', 'Caramel')

  await arweave.transactions.sign(transaction, key)
  const response = await arweave.transactions.post(transaction);
  return response
}

export const fetchTombstones = (address) => {
    const query = `
      query getTransactions (
          $owners: [String!]
          $tags: [TagFilter!]
      ) {
          transactions (
              owners: $owners
              tags: $tags
          ) {
              edges {
                  node {
                      id
                      tags {
                          name
                          value
                      }
                      data {
                          size
                          type
                      }
                  }
              }
          }
      }
    `

    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        query: query,
        variables: {
    	    "owners": [`${address}`],
    	    "tags": [{"name": "Tombstone", "values": ["true"]}]
        }
      })
    };

    return fetch('https://arweave.net/graphql', options)
      .then(response => response.json())
      .then(({ data: { transactions: { edges } } }) => {
        return edges.map((transaction) => transaction.node.tags.find(tag => tag.name == "Id"))
      })
      .then((tags) => tags.map((tag) => tag.value))
}

export const fetchTransactions = (address, tombstones) => {
    const query = `
      query getTransactions (
          $owners: [String!]
          $tags: [TagFilter!]
      ) {
          transactions (
              owners: $owners
              tags: $tags
          ) {
              edges {
                  node {
                      id
                      tags {
                          name
                          value
                      }
                      data {
                          size
                          type
                      }
                  }
              }
          }
      }
    `

    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        query: query,
        variables: {
    	    "owners": [`${address}`],
    	    "tags": [{"name": "App-Name", "values": ["Caramel"]}, {"name": "Content-Type", "values": ["text/plain"]} ]
        }
      })
    };

    return fetch('https://arweave.net/graphql', options)
      .then(response => response.json())
      .then(({ data: { transactions: { edges } } }) => {
        let ids = edges.map((transaction) => {
          if (!tombstones.includes(transaction.node.id)) {
            return transaction.node.id
          }
        })

        return ids.filter(item => item !== undefined)
      })
}
