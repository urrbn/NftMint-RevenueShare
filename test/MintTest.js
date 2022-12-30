const hre = require("hardhat");
const chai = require("chai");
const { solidity } = require("ethereum-waffle");
const { utils, BigNumber } = require("ethers");
chai.use(solidity);
const { expect } = chai;
const { ethers } = require("hardhat");

describe("Test", function () {

  before(async function () {
    
    this.RevenueShare = await ethers.getContractFactory("JDBRevenueShare")
    this.Mint = await ethers.getContractFactory("JDBMint7DaysAccess")
    this.JDBToken = await ethers.getContractFactory("JDB")
    this.signers = await ethers.getSigners()
    this.owner = this.signers[0]
    this.alice = this.signers[2]
    this.bob = this.signers[1]
    this.charlie = this.signers[6]
    this.devWallet = this.signers[7]
    this.marketingWallet = this.signers[8]
    
    this.router = await new ethers.Contract('0x10ED43C718714eb63d5aA57B78B54704E256024E', ['function addLiquidityETH(address token, uint amountTokenDesired, uint amountTokenMin, uint amountETHMin, address to, uint deadline) external payable returns (uint amountToken, uint amountETH, uint liquidity)', 'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)', 'function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)', 'function swapExactTokensForETHSupportingFeeOnTransferTokens( uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external'], this.provider)     

    this.JDB = await this.JDBToken.deploy()
    await this.JDB.deployed()

    this.revenueShare = await this.RevenueShare.deploy(this.router.address, ethers.utils.parseEther('5'), 4000, this.devWallet.address, this.marketingWallet.address, this.JDB.address)
    await this.revenueShare.deployed()

    this.mint = await this.Mint.deploy("1","1", "1/", this.JDB.address, 10000000000000, this.revenueShare.address, ethers.utils.parseEther('1'))
    await this.mint.deployed()   

    
    const RouterWSigner = await this.router.connect(this.owner)   

    await this.JDB.excludeFromFees(this.revenueShare.address, true);
    
    await this.JDB.approve('0x10ED43C718714eb63d5aA57B78B54704E256024E', 90000000000000);
    await RouterWSigner.addLiquidityETH(
      this.JDB.address,
      9000000000000,
      9000000000000,
      ethers.utils.parseEther("200"),
      this.owner.address ,
      Math.floor(Date.now() / 1000) + 60 * 10,
      {value : ethers.utils.parseEther("200")}
    );   
  

     
  })

  it("Should revert if the passed bnb is lower than mintPrice and JDB balance < 10k", async function () {

    await expect(this.mint.connect(this.alice).mint({value: ethers.utils.parseEther('0.9')})).to.be.revertedWith("Not enough bnb sent");
  })

  it("The discount should be applieble if JDB balance is >10k", async function () {

    await expect(this.mint.mint({value: ethers.utils.parseEther('0.9')})).to.be.not.reverted;
  })

  it("Shouldn't be able transfer minted tokens", async function () {

    await expect(this.mint.transferFrom(this.owner.address, this.alice.address, 1)).to.be.revertedWith('Non transferrable');
  })


  it("Should forward funds to the revenue share ", async function () {
    this.provider = await ethers.provider

    const mintBNBValue = ethers.utils.parseEther('0.9');

    const minterBalanceB4Mint = await this.provider.getBalance(this.mint.address);
   
    const revenueShareBalanceB4Mint = await this.provider.getBalance(this.revenueShare.address);
    

    await this.mint.mint({value: mintBNBValue});

    const minterBalanceAfter = await this.provider.getBalance(this.mint.address);
 
    const revenueShareBalanceAfterMint = await this.provider.getBalance(this.revenueShare.address);
   
    await expect(BigInt(revenueShareBalanceAfterMint)).to.be.equal(BigInt(mintBNBValue)+BigInt(revenueShareBalanceB4Mint));
    await expect(BigInt(minterBalanceB4Mint)).to.be.equal(BigInt(minterBalanceAfter));
  })

  it("Revenue share should emit LogReceiveBNB event after mint ", async function () {
    
    await expect(this.mint.connect(this.alice).mint({value: ethers.utils.parseEther('1')}))
    .to.emit(this.revenueShare, "LogReceiveBNB");
  
   
  })

  it("Should transfer 40% of bnb to the dev wallet and 60% in JDB to marketing", async function () {
    this.provider = await ethers.provider
    const devWalletBalanceB4 = await this.provider.getBalance(this.devWallet.address);

    const JDBMarketingBalanceB4 = await this.JDB.balanceOf(this.marketingWallet.address);
    
    await this.mint.connect(this.alice).mint({value: ethers.utils.parseEther('1')});
    await this.mint.connect(this.alice).mint({value: ethers.utils.parseEther('1')});
    await this.mint.connect(this.alice).mint({value: ethers.utils.parseEther('1')});
    
    
    const devWalletBalanceAfter = await this.provider.getBalance(this.devWallet.address);
    const devShare = await this.revenueShare._calculateDevShareFromAmount(ethers.utils.parseEther('5.8'));
    const JDBMarketingBalanceAfter = await this.JDB.balanceOf(this.marketingWallet.address);
    
    await expect(BigInt(devWalletBalanceAfter)).to.be.equal(BigInt(devWalletBalanceB4)+BigInt(devShare));
    await expect(Math.floor(JDBMarketingBalanceAfter)).to.be.greaterThan(Math.floor(JDBMarketingBalanceB4))

  })

  it("Should burn minted tokens correctly", async function () {
    
    const totalSupplyB4 = await this.mint.totalSupply();

    await this.mint.connect(this.alice).burn(1);

    const totalSupplyAfter = await this.mint.totalSupply();
 
    await expect(this.mint.ownerOf(1)).to.be.revertedWith('ERC721: owner query for nonexistent token');
    
    await expect(totalSupplyAfter).to.be.equal(Math.floor(totalSupplyB4) - Math.floor(1));
    

  })

  it("Should return the correct token uri", async function () {
  
    const uri = await this.mint.tokenURI(2);


    await expect(uri).to.be.equal("1/2.json");
    
  })

 // it("WL", async function () {
 //   await this.mint.setAddressesWL([this.alice.address, this.owner.address]);
 //   
 //   await this.mint.connect(this.alice).mint();
 //   await this.mint.mint();
 //   
 //   await this.mint.withdraw
 // })



  




})  