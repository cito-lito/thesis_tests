import Head from 'next/head'
import { useWeb3React } from '@web3-react/core'

import { ethers } from 'ethers';
import * as data from "../brownie-config.json"
import * as erc20 from "../brownie_build/interfaces/IERC20.json"
import { useState } from 'react';
import UserAssets from '../components/userAssets';


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

  return (
    <div>
      <UserAssets />
   
    </div>
  )
}

