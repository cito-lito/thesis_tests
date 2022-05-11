import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
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
import { getApy, depositToAave, withdrawFromAave } from '../lendingPoolAaveV3';
import { parseUnits } from 'ethers/lib/utils';
import { userBalances } from '../balances';



export default function Home() {

  const { active, account, library: provider } = useWeb3React();

  //APYs
  const [apyDai, setApyDai] = useState(0);
  const [apyWeth, setApyWeth] = useState(0);

  // inputs
  const [inputDeposit, setInputDeposit] = useState("");
  const [inputWithdraw, setInputWithdraw] = useState("");

  //balances
  const [daiBalance, setDaiBalance] = useState(0);
  const [aDaiBalance, setADaiBalance] = useState(0);
  const [wethBalance, setWethBalance] = useState(0);
  const [aWethBalance, setAWethBalance] = useState(0);
  const [ethBalance, setEthBalance] = useState(0);

  const updateUserData = () => {
    if (active) {
      getApy(data.networks.rinkeby.dai, provider).then((value) => {
        setApyDai(value)
      })
      getApy(data.networks.rinkeby.weth, provider).then((value) => {
        setApyWeth(value)
      })
      userBalances(data.networks.rinkeby.dai, provider, account).then((value) => {
        setDaiBalance(value)
      })
      userBalances(data.networks.rinkeby.aDAI, provider, account).then((value) => {
        setADaiBalance(value)
      })
      userBalances(data.networks.rinkeby.weth, provider, account).then((value) => {
        setWethBalance(value)
      })
      userBalances(data.networks.rinkeby.aWETH, provider, account).then((value) => {
        setAWethBalance(value)
      })

    }
  }

  updateUserData()
  const handleInputDeposit = (event) => {
    const input = event.target.value;
    console.log("entering", input)
    if (!isNaN(input)) {
      setInputDeposit(input);
    } else {
      alert("enter a valid imput")
      setInputDeposit("")
    }
    event.preventDefault();
  }
  const handleInputWithdraw = (event) => {
    const input = event.target.value;
    console.log("entering", input)
    if (!isNaN(input)) {

      setInputWithdraw(input);
    } else {
      alert("enter a valid imput")
      setInputWithdraw("")
    }
    event.preventDefault();
  }

  const handleDeposit = () => {
    depositToAave(data.networks.rinkeby.dai, ethers.utils.parseEther(inputDeposit), 0, provider, account).then(() => {
      setInputDeposit("")
      updateUserData();
    })
  }
  const handleWithdraw = () => {
    withdrawFromAave(data.networks.rinkeby.dai, ethers.utils.parseEther(inputWithdraw), account, provider).then(() => {
      setInputWithdraw("")
      updateUserData();
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
                      Balance: {daiBalance}
                    </ul>
                    <ul>
                      Deposited: {aDaiBalance}
                    </ul>
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <ul>
                  <TextField variant="outlined" label="enter amount" size="small"
                    value={inputDeposit}
                    onChange={handleInputDeposit}
                  />
                  <Button onClick={handleDeposit} fullWidth variant={"outlined"}>
                    Deposit{' '}
                  </Button>
                </ul>
                <ul>
                  <TextField variant="outlined" label="enter amount" size="small"
                    value={inputWithdraw}
                    onChange={handleInputWithdraw}
                  />
                  <Button onClick={handleWithdraw} fullWidth variant={"outlined"}>
                    withdraw{' '}
                  </Button>
                </ul>
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

