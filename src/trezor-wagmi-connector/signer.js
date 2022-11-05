import { ethers } from 'ethers'
const ethUtil = require('ethereumjs-util');

export class TrezorSigner extends ethers.Signer {
  constructor(provider, transport, type, path, key) {
    super()

    this.transport = transport
    this.provider = provider
    this.path = path
    this.type = type
    this.hdk = key
  }

  async signTransaction(transaction) {
    transaction = { ...transaction,
      value: "0x0",
      nonce: ethers.BigNumber.from(`${transaction.nonce}`).toString(),
      gasLimit: transaction.gasLimit.toString(),
      gasPrice: transaction.maxFeePerGas.toString(),
      maxFeePerGas: transaction.maxFeePerGas.toString(),
      maxPriorityFeePerGas: transaction.maxPriorityFeePerGas.toString()
    }

    let { payload: sig } = await this.transport.ethereumSignTransaction({
      path: "m/44'/60'/0'",
      transaction
    })

    return ethers.utils.serializeTransaction(transaction, {
      v: ethers.BigNumber.from(sig.v).toNumber(),
      r: (sig.r),
      s: (sig.s),
    });
  }

  async getAddress() {
    const address = ethUtil
      .publicToAddress(this.hdk.publicKey, true)
      .toString('hex');
    return ethUtil.toChecksumAddress(`0x${address}`);
  }
}
