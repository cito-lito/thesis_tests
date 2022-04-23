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
        asset_addr,
        amount,
        on_behalf_of.address,
        referral_code,
        {"from": on_behalf_of}
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


def get_pool():
    pool_addr_prov = interface.IPoolAddressesProvider(
        config["networks"][network.show_active()]["pool_addr_provider"]
    )
    pool_addr = pool_addr_prov.getPool()
    return interface.IPool(pool_addr)


def main():
    account = utils.get_account("dev")
    lp = get_pool()
    token_addr = config["networks"][network.show_active()]["weth"]
    amount = Wei("0.1 ether")
    x = weth.balance_of(account.address)
    
    print(f"weth_balance: {x} lpAddres: {lp.address} amount: {amount}")
    erc20.approve_erc20(account, amount, token_addr, lp.address)
    a = erc20.check_allowance(account.address, token_addr, lp.address)
    print(a)
    supply(token_addr, amount, account)
    pass


if __name__ == "__main__":
    main()
