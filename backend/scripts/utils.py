from brownie import accounts, network, config


## supported tokens in aave:
SUPPORTED_TOKENS = ['dai', 'usdc' ]


def get_account(added_account=None):
    """load personal account if passed, else use ganache account
    Args:
        added_account: added account. Defaults to None.
    Returns:
        _type_: account
    """
    if added_account:
        return accounts.load(added_account)
    return accounts[0]



    
    
    