import * as React from 'react'
import { useNetwork } from 'wagmi'

import NetworkSwitchModal from './NetworkSwitchModal'

export const NetworkSwitcher = () => {
  const [{ data: networkData, error: switchNetworkError }, switchNetwork] =
    useNetwork()

  return (
    <div>
      {switchNetworkError && switchNetworkError?.message}

    {
      networkData.chain?.unsupported && 
        <NetworkSwitchModal 
          networkData={networkData} 
          switchNetwork={switchNetwork}
        />
    }
    </div>
  )
}
