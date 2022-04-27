import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { injected } from '../connectors';

export default function ConnectMetamask() {
    const { active, account, chainId, activate, deactivate } = useWeb3React();
    console.log(account)
    console.log(chainId)
    console.log(active)
    // later add change to correct network button or alert to change it manually
    //injected.supportedChainIds.includes(chainId) ?
    // console.log("correct network") :
    // console.log("wrong network")
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

