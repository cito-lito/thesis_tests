from brownie import config, network, accounts, Wei
from scripts import weth, utils
import pytest


# 1. Arrange, or set up, the conditions for the test
# 2. Act by calling some function or method
# 3. Assert that some end condition is true


@pytest.fixture(scope="module")
def weth_contract():
    return weth.get_weth_contract()


@pytest.fixture(scope="module")
def weth_addr():
    return config["networks"][network.show_active()]["weth"]


@pytest.fixture(scope="module")
def dev_account():
    return utils.get_account("dev")


@pytest.fixture(scope="module")
def amount():
    return Wei("0.5 ether")


def test_get_weth_contract(weth_contract):
    assert weth_contract != None


def test_deposit(dev_account, amount):
    balance = weth.balance_of(dev_account.address)
    weth.deposit(dev_account, amount)
    new_balance = balance + amount
    assert new_balance == weth.balance_of(dev_account.address)


def test_witdraw(dev_account, amount):
    balance = weth.balance_of(dev_account.address)
    weth.witdraw(dev_account, amount)
    new_balance = balance - amount
    assert new_balance == weth.balance_of(dev_account.address)
