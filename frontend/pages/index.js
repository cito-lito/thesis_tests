import Head from 'next/head'

import { useWeb3React } from '@web3-react/core'


import { InjectedConnector } from '@web3-react/injected-connector'


// connector
const injected = new InjectedConnector(
  { supportedChainIds: [1, 3, 4, 5, 42] } //suported networks 
)


export default function Home() {
  const { active, account, chainId, activate, deactivate } = useWeb3React();
  console.log(account)
  console.log(chainId)
  console.log(active)

  return (
    <div>
      {active ? (
        <div>Connected:{account}
          <button onClick={deactivate}>Disconnect</button>
        </div>) :
        (<button onClick={() => { activate(injected) }}>Connect Metamask</button>)
      }
    </div>
  )
}
