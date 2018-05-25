
const Web3 = require('web3');

export class Ethereum {      
    
    static Network = {"Mainnet": 'https://mainnet.infura.io/', "Rinkeby": "https://rinkeby.infura.io/"}    
    
    constructor(ethereumNetwork) {   
        this.ethereumNetwork = ethereumNetwork;         
        this.web3 = new Web3(new Web3.providers.HttpProvider(this.ethereumNetwork));
        
    }
    async getBalance(address) {    
        const balance = await this.web3.eth.getBalance(address);        
        return Web3.utils.fromWei(balance.toString());
      };
}