import Head from 'next/head'

import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import ConnectMetamask from '../components/connectMetamask'

export default function Home() {
  return (
    <div>
     <ConnectMetamask/>
    </div>
  )
}
