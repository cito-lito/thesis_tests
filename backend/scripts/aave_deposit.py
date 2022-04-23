from brownie import network, Wei, config
from scripts import erc20, pool, utils, weth


def deposit(account, token, amount):
    """deposit supported tokens into the lending pool
    Args:
        account: account
        token (string): token name, will be use to get the token addr from the config file
        amount: amount in wei
    """
    if token in utils.SUPPORTED_TOKENS:
        token_addr = config["networks"][network.show_active()][token]
        balance = erc20.balance_of(account.address, token_addr)
        lending_pool = pool.get_pool()

        allowed_amount = erc20.check_allowance(
            account.address, token_addr, lending_pool.address
        )

        if balance >= amount:
            approve(allowed_amount, account, amount, token_addr, lending_pool.address)
            erc20.approve_erc20(account, 0, token_addr, lending_pool.address)
            pool.supply(token_addr, amount, account)
        else:
            print(f"error: {token} balance")

    # deposit eth->weth->deposit
    elif token in ["eth", "weth"]:
        ether_deposit(account, amount)

    else:
        # unsupported token
        pass


def ether_deposit(account, amount):
    """deposit ether: ether to weth and deposit weth
    Args:
        account: account
        amount: amount in wei
    """
    weth_token = config["networks"][network.show_active()]["weth"]
    weth_balance = weth.balance_of(account.address)
    eth_balance = account.balance()
    lending_pool = pool.get_pool()

    allowed_amount = erc20.check_allowance(
        account.address, weth_token, lending_pool.address
    )

    if weth_balance >= amount:
        approve(allowed_amount, account, amount, weth_token, lending_pool.address)
        pool.supply(weth_token, amount, account)
    elif eth_balance >= (amount - weth_balance):
        # get weth from eth and deposit:
        weth_needed = amount - weth_balance
        weth.deposit(account, weth_needed)
        approve(allowed_amount, account, amount, weth_token, lending_pool.address)
        pool.supply(weth_token, amount, account)
    else:
        ## errors, amount...
        print("error: eth, weth balance")
        pass


def approve(allowed, account, amount, token_addr, spender_addr):
    """
    avoid vector attack; approve only the req amount
    """
    if allowed > 0:
        erc20.approve_erc20(account, 0, token_addr, spender_addr)
    erc20.approve_erc20(account, amount, token_addr, spender_addr)


def main():
    account = utils.get_account("dev")
    # deposit(account, token, Wei("0.05 ether"))
    ether_deposit(account, Wei("0.1 ether"))


if __name__ == "__main__":
    main()
