import { useWeb3React } from '@web3-react/core'
import { injected } from '../connectors';

//stiling
import { Button } from '@mui/material';

export default function ConnectMetamask() {
    const { active, library, connector, account, chainId, activate, deactivate } = useWeb3React();
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
                    <Button onClick={deactivate}>Disconnect</Button>
                </div>) :
                (<Button onClick={() => { activate(injected) }}>Connect Metamask</Button>)
            }


        </div>
    )

}

