
import { ethers } from "ethers"
import { useWeb3React } from '@web3-react/core'
import * as data from "./brownie-config.json"
import IPoolAddressProvider from "./brownie_build/interfaces/IPoolAddressesProvider.json"
import IPool from "./brownie_build/interfaces/IPool.json"

const SECONDS_PER_YEAR = 31536000
const RAY = 10 ** 27

/**
 * Get read only contract
 * @returns read only contract
 */
async function getPoolContract() {
    const { library: provider } = useWeb3React();
    const addr = data.networks.rinkeby.pool_addr_provider
    const abi = IPoolAddressProvider.abi
    try {
        const pool_addr_prov = new ethers.Contract(addr, abi, provider);
        const pool_addr = await pool_addr_prov.getPool()
        const pool = new ethers.Contract(pool_addr, IPool.abi, provider);
        return pool;
    } catch (error) {
        console.error(error)
    }
}

export async function getApy(asset_addr) {

    try {
        const pool = await getPoolContract()
        const [
            configuration,
            liquidityIndex,
            currentLiquidityRate,
            variableBorrowIndex,
            currentVariableBorrowRate,
            currentStableBorrowRate,
            lastUpdateTimestamp,
            id,
            aTokenAddress,
            stableDebtTokenAddress,
            variableDebtTokenAddress,
            interestRateStrategyAddress,
            accruedToTreasury,
            unbacked,
            isolationModeTotalDebt,

        ] = await pool.getReserveData(asset_addr)

        const supplyRate = currentLiquidityRate.toBigInt()
        const supplyRateNumber = Number(supplyRate)
        const depositAPR = supplyRateNumber / RAY
        const depositAPY = ((1 + (depositAPR / SECONDS_PER_YEAR)) ** SECONDS_PER_YEAR) - 1
        console.log("APY", depositAPY)
        return depositAPY;
    } catch (error) {
        console.error(error);
    }
}

/**
 * Supplies an amount of underlying asset into the reserve, receiving in return overlying aTokens.
    E.g. User supplies 100 DAI and gets in return 100 aDAI
 * @param assetAddr 
 * @param amount 
 * @param referralCode: optional default to 0 
 */
export async function aaveDeposit(assetAddr, amount, referralCode = 0) {
    const { account, library: provider } = useWeb3React();
    const signer = provider.getSigner()
    console.log("signer is", signer)
    try {
        const pool = new ethers.Contract(addr, abi, signer)
        console.log("pool", pool)
        const tx = pool.supply(assetAddr, amount, account, referralCode, signer)
        console.log("tx", tx)
    } catch (error) {
        console.error(error)
    }
}