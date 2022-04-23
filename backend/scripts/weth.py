
from brownie import accounts, interface, config, network, Wei
from scripts import utils

def get_weth_contract():
    return (interface.IWeth(config["networks"][network.show_active()]["weth"]))

def deposit(account, amount):
    """deposit eth and geth weth
    Args:
        account: account   
        amount: amount
    Returns:
        _type_:  deposit tx
    """
    weth = get_weth_contract()
    tx = weth.deposit({"from":account, "value":amount})   
    print("depositing weth...")
    tx.wait(1)
    return tx 
    
def witdraw(account, amount):
    weth = get_weth_contract()
    tx = weth.withdraw(amount, {"from":account})    
    tx.wait(1)
    return tx 

def balance_of(addr):
    weth = get_weth_contract()
    return weth.balanceOf(addr)

    
def main():
    account = utils.get_account('dev')
    
if __name__ == "__main__":
    main()