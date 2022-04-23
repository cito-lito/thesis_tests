from brownie import interface, config, network, Wei, accounts
from scripts import utils, erc20

def get_erc20_contract(token_addr):
    return interface.IERC20(token_addr)

def approve_erc20(account, amount, token_addr, spender_addr):
    token = get_erc20_contract(token_addr)
    tx = token.approve(spender_addr, amount, {"from": account})
    #wait 1 confirmation
    tx.wait(1)
    #print(tx.events)
    return tx.status

def balance_of(acc_addr, token_addr):
    token = get_erc20_contract(token_addr)
    return token.balanceOf(acc_addr)
        
def check_allowance(owner_addr, token_addr, spender_addr):
    token = get_erc20_contract(token_addr)
    return token.allowance(owner_addr, spender_addr)




def main():
    token_addr = config['networks'][network.show_active()]['dai']
    account = utils.get_account('dev')
    aWeth_balance = erc20.balance_of(account.address, '0x608D11E704baFb68CfEB154bF7Fd641120e33aD4')
    print(aWeth_balance)
    aDai = '0x49866611AA7Dc30130Ac6A0DF29217D16FD87bc0'
    aDai_balance= erc20.balance_of(account.address,aDai )
    print(f"aDai: {aDai_balance}")
   # tx = approve_erc20(account, 0, token_addr, accounts[0])
   # allowed = check_allowance(account.address, token_addr, accounts[0])
   # print(f"allowed: {allowed}")
   # tx = approve_erc20(account, Wei('0.5 ether'), token_addr, accounts[0])
   # allowed = check_allowance(account.address, token_addr, accounts[0])
   # print(f"allowed: {allowed}")
    
if __name__ == "__main__":
    main()