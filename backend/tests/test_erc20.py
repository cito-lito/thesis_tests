from brownie import config, network, accounts, Wei
from scripts import erc20, utils
import pytest

# 1. Arrange, or set up, the conditions for the test
# 2. Act by calling some function or method
# 3. Assert that some end condition is true


@pytest.fixture(scope="module")
def token_contract():
    token_addr = config["networks"][network.show_active()]["dai"]
    return erc20.get_erc20_contract(token_addr)


@pytest.fixture(scope="module")
def dev_account():
    return utils.get_account("dev")


@pytest.fixture(scope="module")
def token_addr():
    return config["networks"][network.show_active()]["dai"]


@pytest.fixture(scope="module")
def amount():
    return Wei("0.5 ether")


def test_get_erc20_contract(token_contract):
    # Arrange
    # Act
    contract = token_contract
    # Assert
    assert contract != None


def test_approve_erc20(dev_account, token_addr, amount):
    # Arrange
    account = dev_account
    # Act
    status = erc20.approve_erc20(account, amount, token_addr, accounts[0])
    # Assert
    assert True == status


def test_check_allowance(dev_account, token_addr, amount):
    # Arrange
    account = dev_account
    # Act
    erc20.approve_erc20(account, 0, token_addr, accounts[0])
    erc20.approve_erc20(account, amount, token_addr, accounts[0])
    a = erc20.check_allowance(account.address, token_addr, accounts[0])
    # Assert
    assert a == amount


def test_balance_of(dev_account, token_addr):
    # Arrange
    account = dev_account
    # Act
    a = erc20.balance_of(account.address, token_addr)
    b = erc20.balance_of(account.address, token_addr)
    # Assert
    assert a == b
