Custom NFT Mint contract

1. Basic erc721 functionality +
2. mint function +
3. some identifier +
4. mint price  +
5. forward funds to revenue share  +
6. 10% discount if holds more than 10k tokens +


Revenue share contract
  1. receive bnb function 
  2. Buyback function
  3. Transfer to owners wallet function 
  2. When contract balance reached a certain amount - automaticall calls buyback + transfer to the owner


Nft give access to the data

10k if > 1

Nft not tradable or 100% royalties 


Expected tests JDB Mint:
1. Should revert if the passed bnb is lower than mintPrice
2. The discount should be applieble if JDB balance is >10k 
3. Should forward funds to the revenue share 
4. Shouldn't be able transfer minted tokens


Expected tests Revenue Share:
1. Should emit LogReceiveBNB event when receive bnb
2. When bnb balance is > sendBNBAtAmount, should send 40% to the dev wallet, 60% to buyback + send swapped JDB to marketing wallet
3. 