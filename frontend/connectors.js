import { InjectedConnector } from '@web3-react/injected-connector'
/*
Chains:
Rinkeby : 4
KOvan : 42
*/

export const injected = new InjectedConnector({
  supportedChainIds: [4, 42]
})