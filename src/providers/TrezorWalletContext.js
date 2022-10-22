import React, { createContext } from "react";
import { useLocalStore } from "mobx-react-lite";

import TrezorConnect from '@trezor/connect-web';

TrezorConnect.init({
  lazyLoad: true,
  popup: true,
  webusb: true,
  manifest: {
    email: 'tzumby@gmail.com',
    appUrl: 'https://6609-38-88-108-58.ngrok.io',
  },
})

export const TrezorWalletProvider = ({ children }) => {
  const store = useLocalStore(() => ({
    connect: TrezorConnect,
    walletAddress: "",
    setWalletAddress(address) {
      store.walletAddress = address;
    },
    getWalletAddress() {
      return store.walletAddress
    }
  }));
  return <trezorWalletContext.Provider value={store}>{children}</trezorWalletContext.Provider>;
};
export const trezorWalletContext = createContext();
