
import axios from 'axios'
import satoshi from 'satoshi-bitcoin';
import { rule } from 'postcss';
export class Bitcoin {      
    
    static Network = {"Mainnet": 'https://insight.bitpay.com/api', "Testnet": "https://test-insight.bitpay.com/api"}    

    constructor(ethereumNetwork) {   
      this.ethereumNetwork = ethereumNetwork;               
    }
      
    async getBalance(address) {      
      var url = this.ethereumNetwork + '/addr/' + address + '/balance';        
      console.log(url);
      var response = await axios.get(url);      
      // console.log(response.data);
      if (response.status == 200){
        return await satoshi.toBitcoin(response.data);
      }
      return false;      
    }
}