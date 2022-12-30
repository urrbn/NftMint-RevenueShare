require("dotenv").config();

require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-coverage");


module.exports = {
  networks: {
    hardhat:{
      forking: {
        url: "https://bsc-dataseed1.binance.org/",
        allowUnlimitedContractSize: true,
        chainId:56
      }
      
    },
    binance: {
       url: "https://bsc-dataseed1.binance.org/",
       accounts:[''],
       allowUnlimitedContractSize: true
    }
    
  },  
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: '',
    
  },
  
    solidity: {
      compilers: [
        {
          version: "0.8.0",
          settings: {
            optimizer: {
              enabled: true,
              runs: 200
            }
          }
        },
        {
          version: "0.8.7",
          settings: {
            optimizer: {
              enabled: true,
              runs: 200
            }
          }
        },
        {
          version: "0.8.11",
          settings: {
            optimizer: {
              enabled: true,
              runs: 200
            }
          }
        },
        {
            version: "0.8.9",
            settings: {
              optimizer: {
                enabled: true,
                runs: 200
              }
            }
          },

        {
          version: "0.5.16",
          settings: {
            optimizer: {
              enabled: true,
              runs: 200
            }
          }
        },

      ],
    
  },
 
};
