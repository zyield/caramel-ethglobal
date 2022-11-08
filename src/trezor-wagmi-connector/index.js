import { providers } from 'ethers';
import HDKey from 'hdkey';
import { getAddress, hexValue } from 'ethers/lib/utils';
import TrezorConnect from '@trezor/connect-web';
import { normalizeChainId, ProviderRpcError } from '@wagmi/core';

import { TrezorSigner } from './signer'

import {
  Connector,
  Chain
} from 'wagmi';

const ethUtil = require('ethereumjs-util');

const TREZOR_CONNECT_MANIFEST = {
  email: 'contact@zyield.fi',
  appUrl: 'https://6dfd-38-88-108-58.ngrok.io',
};

export class TrezorWalletConnector extends Connector {
  id = "trezor"
  name = "Trezor"
  ready = true
  hdk = new HDKey()

  isUnlocked() {
    return Boolean(this.hdk && this.hdk.publicKey);
  }

  async getProvider() {
    if (!this.providerInstance) {
      await TrezorConnect.init({
        lazyLoad: true,
        popup: true,
        webusb: true,
        manifest: TREZOR_CONNECT_MANIFEST
      })
      this.providerInstance = TrezorConnect
    }
    return this.providerInstance
  }

  async connect({ chainId } = {}) {
    console.log("connecting")
    try {
      const provider = await this.getProvider();

      this.emit('message', { type: 'connecting' });

      const response = await provider.getPublicKey({
        path: "m/44'/60'/0'/0/0",
        coin: 'ETH'
      })

      if (response.success) {
        this.hdk.publicKey = Buffer.from(response.payload.publicKey, 'hex');
        this.hdk.chainCode = Buffer.from(response.payload.chainCode, 'hex');
        const account = await this.getAccount();

        window.hdk = this.hdk

        let goerliChainConfig = {
          id: 5,
          unsuported: false,
          name: "Goerli",
          testnet: true,
          network: "goerli",
          ens: { address: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"}
        }

        let mainnetChainConfig = {
          id: 1,
          name: "Ethereum",
          network: "homestead",
          unsuported: false,
          ens: { address: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"}
        }

        return { account: account, chain: goerliChainConfig , provider: provider };
      } else {
        console.log("error getting public key")
      }
    } catch (e) {
      console.log("error", e)
    }
  }

  async getAccount() {
    const address = ethUtil
      .publicToAddress(this.hdk.publicKey, true)
      .toString('hex');
    return ethUtil.toChecksumAddress(`0x${address}`);
  }

  async getSigner() {
    const infuraProvider = new providers.getDefaultProvider()
    const transport = await this.getProvider();

    const path =  "m/44'/60'/0'/0/0"
    const signer = new TrezorSigner(infuraProvider, transport, "default", path, this.hdk)

    return signer
  }

  async disconnect() {
    const provider = await this.getProvider();
    provider.dispose();
  }

}
