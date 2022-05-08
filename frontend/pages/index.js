import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import { Avatar } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import GlobalStyles from '@mui/material/GlobalStyles';
import Container from '@mui/material/Container';
import { sx_card, sx_header } from '../stile';
import TitleDescription from '../components/titleDescription';
import ConnectMetamask from '../components/connectMetamask';
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers';
import * as data from "../brownie-config.json"
import * as erc20 from "../brownie_build/interfaces/IERC20.json"
import { useState } from 'react';
import { get_apy } from '../getAPY';



// Erc balances
async function getBalanceErc20(provider, account, erc_addr) {
  try {
    const contract = new ethers.Contract(erc_addr, erc20.abi, provider);
    return (await contract.balanceOf(account));

  } catch (error) {
    console.error(error);
  }
}

// get user balances, returns erc balances if erc addr is passed, eth balacnes else
function userBalances(erc_addr = "undefined") {
  const [balance, setBalance] = useState(0);
  const { active, account, library: provider } = useWeb3React();
  if (active) {
    if (erc_addr !== "undefined") {
      getBalanceErc20(provider, account, erc_addr).then((value) => {
        const bal = value.toBigInt()
        const ercBalance = ethers.utils.formatEther(bal)
        setBalance(ercBalance)
      });
      return balance;
    }
    provider.getBalance(account).then((balance) => {
      const balanceInEth = ethers.utils.formatEther(balance)
      console.log("balance eth", balanceInEth)
      setBalance(balanceInEth)
    })
    return balance;
  }
}


export default function Home() {
  const [apyDai, setApyDai] = useState(0);
  const [apyWeth, setApyWeth] = useState(0)
  const { active } = useWeb3React();
  if (active) {
    get_apy(data.networks.rinkeby.dai).then((value) => {
      setApyDai(value)
    })
    get_apy(data.networks.rinkeby.weth).then((value) => {
      setApyWeth(value)
    })
  }
  return (
    <React.Fragment>
      <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
      <CssBaseline />
      <AppBar position="static" color="default" elevation={0}
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}>
        <Toolbar sx={{ flexWrap: 'wrap' }}>
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            THESIS DAPP
          </Typography>
          <ConnectMetamask />
        </Toolbar>
      </AppBar>
      {/* Title */}
      <TitleDescription />
      {/* */}
      <Container maxWidth="md" component="main">
        <Grid container spacing={4} alignItems="flex-end">
          {/* */}
          <Grid item xs={4} sm={6} md={6}>
            <Card>
              <CardHeader title={"DAI"} titleTypographyProps={{ align: 'center' }}
                subheaderTypographyProps={{ align: 'center' }} sx={sx_header} />

              <CardContent>
                <Box sx={sx_card}>
                  <Typography component="h1" variant="h6">
                    <ul>
                      APY: {apyDai} %
                    </ul>
                    <ul>
                      Balance: {userBalances(data.networks.rinkeby.dai)}
                    </ul>
                    <ul>
                      Deposited: {userBalances(data.networks.rinkeby.aDAI)}
                    </ul>
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Button onClick={() => a()} fullWidth variant={"outlined"}>
                  Deposit{'  '}{ }
                </Button>
                <Button onClick={() => b()} fullWidth variant={"outlined"}>
                  withdraw{'  '}{ }
                </Button>
              </CardActions>
            </Card>
          </Grid>
          {/* */}
        </Grid>
      </Container>

      {/* Footer */}

    </React.Fragment>
  )
}

