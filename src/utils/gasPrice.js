import { BigNumber } from 'bignumber.js';
import axios from 'axios';
import Web3 from 'web3';


export const getGasPrice = () => {

  console.log('Update Gas Price');
  axios
    .get(`https://ethgasstation.info/json/ethgasAPI.json`)
    .then((res) => {

      const gasBN = new BigNumber(res.data.average);
      const gasPriceBN = gasBN.div(10);
      window.gasPrice = gasPriceBN.toNumber().toString();
      console.log('Update Gas:', window.gasPrice);

    })
    .catch(function (error) {
      // handle error
      console.log(error);
      axios
      .get(`https://api.etherscan.io/api?module=proxy&action=eth_gasPrice&apikey=${
        process.env.apikeyEtherscan
      }`)
      .then((res) => {
        const gasPrice = Number(res.data.result+1).toString();
        window.gasPrice = Web3.utils.fromWei(gasPrice, 'gwei');
        console.log('Update Gas:', window.gasPrice);

      });
    });
};
