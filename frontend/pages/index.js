import Head from 'next/head'
import { useWeb3React } from '@web3-react/core'

import { ethers } from 'ethers';
import * as data from "../brownie-config.json"
import * as erc20 from "../brownie_build/interfaces/IERC20.json"
import {useState } from 'react';
import BaseTemplate from '../components/baseTemplate';


async function getBalanceErc20(provider, account, erc_addr) {
  try {
    const contract = new ethers.Contract(erc_addr, erc20.abi, provider);
    return (await contract.balanceOf(account));
    
  } catch (error) {
    console.error(error);
  }
}

function getBalance(){
  const [balance, setBalance] = useState(0);
  const { active, account, library: provider } = useWeb3React();
  if (active) {
    getBalanceErc20(provider, account, data.networks.rinkeby.dai).then(value => {
      setBalance(value.toBigInt())
    });
    console.log("balance is ", (balance))
    console.log("asgasdf", ethers.utils.formatEther(balance))
  }
  if (active) {
    provider.getBalance(account).then((balance) => {
      // convert a currency unit from wei to ether
      const balanceInEth = ethers.utils.formatEther(balance)
      console.log("balance eth", balanceInEth)
    })
  }

}

export default function Home() {
  getBalance();
  return (
    <div>
      <BaseTemplate/>
    </div>
  )
}