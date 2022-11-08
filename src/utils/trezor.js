const fromHexString = (hexString) =>
Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));

const toHex = (str) => {
  var result = '';
  for (var i=0; i<str.length; i++) {
    result += str.charCodeAt(i).toString(16);
  }
  return result;
}

export async function encrypt(connect, payload) {
  let { payload: encryptedPayload } = await connect.cipherKeyValue({ bundle: payload})
  return JSON.stringify(encryptedPayload)
}

export async function decrypt(connect, data) {
  let parts  = JSON.parse(data)
  let payload = parts.map((el, index) => {
    return {
      path: "m/49'/0'/0'",
      key: `Part ${index + 1}/4`,
      value: el.value,
      encrypt: false,
      askOnEncrypt: true,
      askOnDecrypt: true,
    }
  })

  let response = await connect.cipherKeyValue({bundle: payload})

  if (response?.payload) {
    let hexWallet = ""

    response.payload.map((el) => {
      hexWallet = hexWallet + el.value
    })

    let buffer = fromHexString(hexWallet)
    let decoded = new TextDecoder().decode(buffer);
    let {wallet_data: key} = JSON.parse(decoded)
    return key
  }
}
