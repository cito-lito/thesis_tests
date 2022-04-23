from brownie import accounts, config, network, Wei
from scripts import aave_deposit, erc20, pool, utils, weth
import pytest

# 1. Arrange, or set up, the conditions for the test
# 2. Act by calling some function or method
# 3. Assert that some end condition is true


@pytest.fixture(scope="module")
def dev_account():
    return utils.get_account("dev")




def test_ether_deposit_1(dev_account):
    # Arrange: weth balance >= amount
    token = "eth"
    amount = Wei("0.1 ether")
    weth_balance = weth.balance_of(dev_account.address)
    
    # Act:
    aave_deposit.deposit(dev_account, token, amount)
    
    # Assert     
    a =  weth.balance_of(dev_account.address)
    assert (weth_balance - amount) == a
    

def test_ether_deposit_2(dev_account):
    # Arrange: eth balance >= amount, (no enough weth)
    token = "eth"
    amount = Wei("1.1 ether")
    
    # Act:
    aave_deposit.deposit(dev_account, token, amount)
    
    # Assert     
    assert (weth.balance_of(dev_account.address)) == 0
    