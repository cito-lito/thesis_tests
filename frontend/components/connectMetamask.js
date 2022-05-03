import { useWeb3React } from '@web3-react/core'
import { injected } from '../connectors';

//
import { Button, Box } from '@mui/material';

export default function ConnectMetamask() {
    const { active, account, chainId, activate, deactivate } = useWeb3React();

    return (
        <div >

            {active ? (
                <div> {account}
                    <Button onClick={deactivate}>disconnect</Button>
                </div>) :
                (<Button onClick={() => { activate(injected) }}>Connect Metamask</Button>)
            }

        </div>
    )

}

