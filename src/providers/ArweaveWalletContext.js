import React, { createContext, useContext } from "react";
import { useLocalStore } from "mobx-react-lite";

export const ArweaveWalletContext = createContext();

export const ArweaveWalletProvider = ({ children }) => {
  const store = useLocalStore(() => ({
    key: "",
    walletAddress: "",
    connector: "",
    provider: null,
    setProvider(provider) {
      store.provider = provider
    },
    setConnector(connector) {
      store.connector = connector.name
    },
    setKey(key) {
      store.key = key
    },
    setWalletAddress(address) {
      store.walletAddress = address;
    },
    getProvider() {
      return store.provider
    },
    getWalletAddress() {
      return store.walletAddress
    },
    getKey() {
      return store.key
    },
    getConnector() {
      return store.connector
    }
  }));
  return <ArweaveWalletContext.Provider value={store}>{children}</ArweaveWalletContext.Provider>;
};

export const useArweaveWalletStore = () => {
  const store = useContext(ArweaveWalletContext)

  if (!store) {
    throw new Error('useArweaveWalletStore must be used within a ArweaveWalletProvider')
  }

  return store
}
