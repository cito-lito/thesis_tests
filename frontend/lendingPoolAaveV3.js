
import { ethers } from "ethers"
import * as data from "./brownie-config.json"
import IPoolAddressProvider from "./brownie_build/interfaces/IPoolAddressesProvider.json"
import IPool from "./brownie_build/interfaces/IPool.json"

const SECONDS_PER_YEAR = 31536000
const RAY = 10 ** 27

/**
 * Get read only pool contract
 * @returns read only contract
 */
async function getPoolContract(provider){
    const addr = data.networks.rinkeby.pool_addr_provider
    const abi = IPoolAddressProvider.abi
    console.log("get pool contract read")
    try {
        const pool_addr_prov = new ethers.Contract(addr, abi, provider);
        const pool_addr = await pool_addr_prov.getPool()
        console.log("pool addr", pool_addr)
        const pool = new ethers.Contract(pool_addr, IPool.abi, provider);
        console.log("pool contract", pool)
        return pool;
    } catch (error) {
        console.error(error)
    }
}

/**
 * Get contract
 * @returns read, write contract
 */
async function getPoolContractWrite(provider) {
    const addr = data.networks.rinkeby.pool_addr_provider
    const abi = IPoolAddressProvider.abi
    console.log("get pool contract write")
    console.log("provider is ", provider)
    try {
        const pool_addr_prov = new ethers.Contract(addr, abi, provider);
        const pool_addr = await pool_addr_prov.getPool()
        console.log("pool addr", pool_addr)
        const pool = new ethers.Contract(pool_addr, IPool.abi, provider.getSigner());
        console.log("pool contract", pool)
        return pool;
    } catch (error) {
        console.error(error)
    }
}

/**
 * Get erc20 contract
 * @returns read, write contract
 */
async function getERC20ContractWrite(erc_addr, provider){
    try {
        const contract = new ethers.Contract(erc_addr, IERC20.abi, provider.getSigner());
        return contract;
    } catch (error) {
        console.error(error)
    }
}


export async function getApy(asset_addr, provider) {

    try {
        const pool = await getPoolContract(provider)
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
export async function depositToAave(assetAddr, amount, referralCode = 0, provider){
    console.log("depositing: ", amount)
    try {
        const pool = await getPoolContractWrite(provider);
        console.log("pool addr is", pool.address)
        //approve amount to deposit in the aave vault
        const erc20Contract = await getERC20ContractWrite(assetAddr, provider)
        console.log("ercContract", erc20Contract)
        const tx_approve = await erc20Contract.approve(pool.address, amount)
        console.log("approve tx", tx_approve)
        //deposit amount into the aave vault
        const tx_deposit = await pool.supply(assetAddr, amount, provider.address, referralCode)
        console.log("tx deposit", tx_deposit)
    } catch (error) {
        console.log(error)
    }
}

