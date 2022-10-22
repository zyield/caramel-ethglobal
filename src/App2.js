import logo from './logo.svg';
import './App.css';

import TrezorConnect from '@trezor/connect-web';
import Arweave from 'arweave';

import eccrypto from 'eccrypto'
import EthCrypto from 'eth-crypto'

import { ethers } from 'ethers'

var ethUtil = require('ethereumjs-util');
var sigUtil = require('@metamask/eth-sig-util')

const arweave = Arweave.init({});

TrezorConnect.init({
    lazyLoad: true, // this param will prevent iframe injection until TrezorConnect.method will be called
    popup: false,
    webusb: true,
    manifest: {
        email: 'tzumby@gmail.com',
        appUrl: 'https://c106-38-88-108-58.ngrok.io',
    },
});

TrezorConnect.renderWebUSBButton('.trezor-button')

function chunkSubstr(str, size) {
  const numChunks = Math.ceil(str.length / size)
  const chunks = new Array(numChunks)

  for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
    chunks[i] = str.substr(o, size)
  }

  return chunks
}

const chunk = (arr, size) => {
   return arr.reduce((acc, val, ind) => {
      const subIndex = ind % size;
      if(!Array.isArray(acc[subIndex])){
         acc[subIndex] = [val];
      } else {
         acc[subIndex].push(val);
      };
      return acc;
   }, []);
};

function App() {
  const generateArweaveWallet = () => {
    arweave.wallets.generate().then((key) => {
      let walletData = { wallet_data: key }
      let walletDataString = JSON.stringify(walletData)
      let walletParts = chunkSubstr(walletDataString, 1024)

      let payload = walletParts.map((part, index) => {
        let bufferPart = Buffer.from(part)
        let hexVal = ethUtil.bufferToHex(bufferPart).slice(2)

        localStorage.setItem(`part ${index}`, hexVal)

        return { 
          path: "m/49'/0'/0'",
          key: `Part ${index+1}/4`,
          value: hexVal,
          encrypt: true,
          askOnEncrypt: true,
          askOnDecrypt: true
        }
      })

      encrypt(payload)
    });
  }

  const encrypt = (payload) => {
    TrezorConnect.cipherKeyValue({ bundle: payload})
    .then((res) => {
      localStorage.setItem("encrypted", JSON.stringify(res))
      console.log(res)
    })
  }

  const fromHexString = (hexString) =>
  Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));

  function toHex(str) {
    var result = '';
    for (var i=0; i<str.length; i++) {
      result += str.charCodeAt(i).toString(16);
    }
    return result;
  }

  const decrypt = () => {
    let wallet  = JSON.parse(localStorage.getItem("encrypted"))
    let payload = wallet.payload.map((el, index) => {

      return {
        path: "m/49'/0'/0'",
        key: `Part ${index + 1}/4`,
        value: el.value,
        encrypt: false,
        askOnEncrypt: true,
        askOnDecrypt: true,
      }
    })

    TrezorConnect.cipherKeyValue({bundle: payload}).then((res) => {
      let hexWallet = ""
      res.payload.map((el) => {
        hexWallet = hexWallet + el.value
      })

      let buffer = fromHexString(hexWallet)
      let decoded = new TextDecoder().decode(buffer);
      let arweaveWallet = JSON.parse(decoded)

      localStorage.setItem("arweaveWallet", decoded)
    })

  }

  //var privateKeyA = eccrypto.generatePrivate();
  //var publicKeyA = eccrypto.getPublic(privateKeyA);

  //console.log("public key", publicKeyA)

  //var privateKeyB = eccrypto.generatePrivate();
  //var publicKeyB = eccrypto.getPublic(privateKeyB);

  //var importedKey = Buffer.from("nZMNaE2YHE7XaUV3ioYTxBJK9b9ssTyPEcTBB9O2fVo=")

  //const encryptedMessage = ethUtil.bufferToHex(
  //  Buffer.from(
  //    JSON.stringify(
  //      sigUtil.encrypt({
  //        publicKey: importedKey,
  //        data: 'hello world!',
  //        version: 'x25519-xsalsa20-poly1305',
  //      })
  //    ),
  //    'utf8'
  //  )
  //);


  //console.log("message", encryptedMessage)

  return (
    <div className="App">
      <header className="App-header">
        <a onClick={() => decrypt()} href="#">Decrypt</a>
        <a onClick={() => generateArweaveWallet()} href="#">Generate arweave wallet</a>
      </header>
    </div>
  );
}

export default App;
