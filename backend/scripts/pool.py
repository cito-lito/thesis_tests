from brownie import Wei, interface, network, config
from scripts import utils, weth, erc20
from web3 import Web3


def supply(asset_addr, amount, on_behalf_of, referral_code=0):
    """Supplies an amount of underlying asset into the reserve, receiving in return overlying aTokens.
        E.g. User supplies 100 DAI and gets in return 100 aDAI
    Args:
        asset_addr: address of the token
        amount : amount
        on_behalf_of : user, asset owner
        referral_code (int, optional):  Defaults to 0.
    """

    pool = get_pool()
    tx = pool.supply(
        asset_addr, amount, on_behalf_of.address, referral_code, {"from": on_behalf_of}
    )
    tx.wait(1)


def withdraw(asset_addr, amount, to):
    """Withdraws an amount of underlying asset from the reserve, burning the equivalent aTokens owned
    Args:
        asset_addr: addr of the underlaying asset
        amount: amount
        to: the receiver of the asset, the msg sender
    Returns:
        tx: the withdraw tx
    """
    pool = get_pool()
    tx = pool.withdraw(asset_addr, amount, to.address, {"from": to})
    tx.wait(1)
    return tx


def get_user_acc_data(addr):
    """get account data
    Args:
        addr (_type_): account address
    Returns:
        tuple:
    total_collateral_ETH,
    total_debt_ETH,
    available_borrow_ETH,
    liquidation_threshold,
    ltv,
    health_factor"""
    pool = get_pool()
    return pool.getUserAccountData(addr)


def get_reserve_data(asset_addr):
    """Returns the state and configuration of the reserve
    Args:
        asset_addr: asset The address of the underlying asset of the reserve
    """
    pool = get_pool()
    return pool.getReserveData(asset_addr)


def get_pool():
    pool_addr_prov = interface.IPoolAddressesProvider(
        config["networks"][network.show_active()]["pool_addr_provider"]
    )
    pool_addr = pool_addr_prov.getPool()
    return interface.IPool(pool_addr)


def get_apy(asset_addr):
    (
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
    ) = get_reserve_data(asset_addr)
    print(currentLiquidityRate)
    SECONDS_PER_YEAR = 31536000
    RAY = 10 ** 27
    depositAPR = currentLiquidityRate / RAY
    depositAPY = ((1 + (depositAPR / SECONDS_PER_YEAR)) ** SECONDS_PER_YEAR) - 1
    return depositAPY


def deposit_eth(pool, account, amount):

    wethGA = interface.IWETHGateway(
        config["networks"][network.show_active()]["wethGateway"]
    )
    print(wethGA)
    tx = wethGA.depositETH(pool, account, 0, {"from": account, "value": amount})
    tx.wait(1)


TO_MARKET_VALUE = 10 ** 8


def borrow_dai(account, amount):

    (
        totalCollateralBase,
        totalDebtBase,
        availableBorrowsBase,
        currentLiquidationThreshold,
        ltv,
        healthFactor,
    ) = get_user_acc_data(account.address)
    # borrowable_eth = Web3.toWei(availableBorrowsBase, "ether")
    print("can be borrow in eth", availableBorrowsBase)

    #### with V3 dont needed anymore
    # dai_price_eth = get_dai_eth_price(
    #     config["networks"][network.show_active()]["dai_eth_data_feed"]
    # )

    # set max to 90%--> avoid liquidation risk
    max_borroable = availableBorrowsBase * 0.9
    # same as :  max_borroable / dai_price_eth
    # max_borroable_dai = (1 / dai_price_eth) * max_borroable
    borrowable = max_borroable / TO_MARKET_VALUE
    
    print("dai to be borrow", borrowable)
    
    if ( amount > borrowable ):
        print("enter a valid amount")
        return
    
    pool = get_pool()
    addr = config["networks"][network.show_active()]["dai"]
    borrow_tx = pool.borrow(
        addr,
        Web3.toWei(borrowable, "ether"),
        1,
        0,
        account.address,
        {"from": account},
    )
    borrow_tx.wait(1)

#   /**
#    * @notice Repays a borrowed `amount` on a specific reserve, burning the equivalent debt tokens owned
#    * - E.g. User repays 100 USDC, burning 100 variable/stable debt tokens of the `onBehalfOf` address
#    * @param asset The address of the borrowed underlying asset previously borrowed
#    * @param amount The amount to repay
#    * - Send the value type(uint256).max in order to repay the whole debt for `asset` on the specific `debtMode`
#    * @param interestRateMode The interest rate mode at of the debt the user wants to repay: 1 for Stable, 2 for Variable
#    * @param onBehalfOf The address of the user who will get his debt reduced/removed. Should be the address of the
#    * user calling the function if he wants to reduce/remove his own debt, or the address of any other
#    * other borrower whose debt should be removed
#    * @return The final amount repaid
#    **/
#   function repay(
#     address asset,
#     uint256 amount,
#     uint256 interestRateMode,
#     address onBehalfOf
#   ) external returns (uint256);
        
        
    def repay_dai(amount, account):
        """
        Repays a borrowed `amount` on a specific reserve, burning the equivalent debt tokens owned
        """
        addr = config["networks"][network.show_active()]["dai"]
        pool = get_pool()
        ## aprove
        erc20.approve_erc20(account, amount, addr, pool.addres)
        tx = pool.repay(addr, amount, 1, account.address, {"from": account})
        tx.wait(1)
        print("repayed dai:", amount)
        
        
    
    
    
def get_dai_eth_price(price_feed_addr):
    dai_eth_price = interface.AggregatorV3Interface(price_feed_addr)

    latest_price = dai_eth_price.latestRoundData()[1]
    print("dai_eth price", latest_price)
    price_in_eth = Web3.fromWei(latest_price, "ether")
    print(f"The DAI/ETH price is {price_in_eth}")
    return price_in_eth


def main():
    account = utils.get_account("dev")
    dai_addr = config["networks"][network.show_active()]["dai"]
    # (
    #     totalCollateralBase,
    #     totalDebtBase,
    #     availableBorrowsBase,
    #     currentLiquidationThreshold,
    #     ltv,
    #     healthFactor,
    # )
    # data = get_user_acc_data(account.address)
    # for i in data:
    #     print(i)

    # reserve_data = get_reserve_data(dai_addr)
    # for i in reserve_data:
    #     print(i)
    
    # print("start")
    # a = interface.IUiPoolDataProviderV3("0x550f9764d56291B5B793b6dD1623af3346128BD2")
    # print(a)
    # pool_addr_prov = interface.IPoolAddressesProvider(
    #     config["networks"][network.show_active()]["pool_addr_provider"]
    # )

    # print("provider", pool_addr_prov)
    # b = a.getUserReservesData(pool_addr_prov, account.address)
    # print(b)
    # c = a.getReservesData(pool_addr_prov)
    # print(c)

    # borrow_dai(account)
    
    (
        totalCollateralBase,
        totalDebtBase,
        availableBorrowsBase,
        currentLiquidationThreshold,
        ltv,
        healthFactor,
    ) = get_user_acc_data(account.address)
    print("total DAI debt:", totalDebtBase/TO_MARKET_VALUE)


if __name__ == "__main__":
    main()
