
import { ethers } from "ethers"
import { useWeb3React } from '@web3-react/core'
import * as data from "./brownie-config.json"
import IPoolAddressProvider from "./brownie_build/interfaces/IPoolAddressesProvider.json"
import IPool from "./brownie_build/interfaces/IPool.json"

const SECONDS_PER_YEAR = 31536000
const RAY = 10 ** 27

export async function get_apy(asset_addr) {
    console.log("init get pool")
    const { library: provider } = useWeb3React();
    console.log("provider: ", provider)
    const addr = data.networks.rinkeby.pool_addr_provider
    const abi = IPoolAddressProvider.abi
    try {
        const pool_addr_prov = new ethers.Contract(addr, abi, provider);
        console.log("popool_addr_provol: ", pool_addr_prov)
        const pool_addr = await pool_addr_prov.getPool()
        console.log("pool_addr", pool_addr)

        const pool = new ethers.Contract(pool_addr, IPool.abi, provider);
        console.log("returning pool: ", pool)
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


