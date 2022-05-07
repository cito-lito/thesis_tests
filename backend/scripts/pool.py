from brownie import Wei, interface, network, config
from scripts import utils, weth, erc20


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


def get_reserved_data(asset_addr):
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
    ) = get_reserved_data(asset_addr)
    print(currentLiquidityRate)   
    SECONDS_PER_YEAR = 31536000
    RAY = 10**27
    depositAPR = currentLiquidityRate/RAY
    depositAPY = ((1 + (depositAPR / SECONDS_PER_YEAR)) ** SECONDS_PER_YEAR) - 1
    return depositAPY
    

def main():
    # account = utils.get_account("dev")

    token_addr = config["networks"][network.show_active()]["dai"]

if __name__ == "__main__":
    main()
