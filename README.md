JDB MINT

1. Basic erc721 functionality 
2. mint function 
3. nftTypeIdentifier - (1, 2, 3) 
4. mint price - editable
5. forward funds to revenue share 
6. 10% discount if a user holds more than 10k JDB tokens - editable

setup: 
all parameters are set from the constructor.
constructor args:
1. name 
2. ticker
3. baseURI 
4. JDB Token
5. _tokensAmountForDiscount - how many tokens should user hold in order to get the discount
6. revenueShareContract
7. _mintPriceInWeiBNB - mint price in bnb 

mint: 
everybody can call the mint function. It's required to pass bnb amount equal to mint price. if a user holds more than 10k JDB Tokens they can pass 10% less bnb



Revenue share contract:

The contract receives bnb from the mint contract, splits the funds and performs buyback and transfer to dev wallet

setup:
all the params are set from the constructor
argumets:
1. router address
2. _sendBNBAtAmount - when the amount is reached swaps bnb and sent bnb to the dev wallet
3. _devShare - persentage that goes to the dev wallet, from total of 10000. so 4000 means 40%
4. _devWallet - dev wallet
5. _JDBToken - JDB Token


