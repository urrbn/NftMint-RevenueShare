const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
  this.RevenueShare = await ethers.getContractFactory("JDBRevenueShare")
  this.Mint1 = await ethers.getContractFactory("JDBMint1DayAccess")
  this.Mint2 = await ethers.getContractFactory("JDBMint3DaysAccess")
  this.Mint3 = await ethers.getContractFactory("JDBMint7DaysAccess")
  

  

  const dev = '0x325a7544BB0c46DB9de43fB754BAbbc7f9a9338f';
  const marketing = '0x7bfaD1a6358872de51298f4752bAea427d12dCc9';
  const token = '0x7874CAFf04AFB8B6f5cbBE3ebec3f83Fcd882272';

  this.revenueShare = await this.RevenueShare.deploy('0x10ED43C718714eb63d5aA57B78B54704E256024E', ethers.utils.parseEther('5'), 4000, dev, marketing, token)
  await this.revenueShare.deployed()

  this.mint1 = await this.Mint1.deploy("JDB1DayAccess","JDB", " ", token, 10000000000000, this.revenueShare.address, ethers.utils.parseEther('0.05'))
  await this.mint1.deployed() 

  this.mint2 = await this.Mint2.deploy("JDB3DaysAccess","JDB", " ", token, 10000000000000, this.revenueShare.address, ethers.utils.parseEther('0.1'))
  await this.mint2.deployed() 

  this.mint3 = await this.Mint3.deploy("JDB7DaysAccess","JDB", " ", token, 10000000000000, this.revenueShare.address, ethers.utils.parseEther('0.16'))
  await this.mint3.deployed()

  
 

  console.log("revenueShare deployed to:", this.revenueShare.address);
  console.log("mint1 deployed to:", this.mint1.address);
  console.log("mint2 deployed to:", this.mint2.address);
  console.log("mint3 deployed to:", this.mint3.address);
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});