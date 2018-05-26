
import localStore from '@/services/localStore';
var bip39 = require('bip39');
import {Bitcoin} from '@/models/Bitcoin.1.js' 
import {Ethereum} from '@/models/Ethereum.js' 

export class WalletModel {      
    
    static CoinType = {"Ether": 60, "Bitcoin": 0, "BitcoinTestnet": 1}
    
    static KEY = "wallets";
    
    constructor(mnemonic, address, privateKey, coinType) {
      this.mnemonic = mnemonic;      
      this.address = address;
      this.privateKey = privateKey;
      this.coinType = coinType;
      this.default = false;
      this.balance = 0;
      this.network = '';
      this.name = '';
      this.title = ''; 
      this.protected = false;
    }

    setDefault(isDefault){
        this.default = isDefault;
    }

    setNetwork(network){
        this.network = network;
    }
    setName(name){
        this.name = name;
    }
    setTitle(title){
        this.title = title;
    }

    // Create an autonomous wallet:
    static createMasterWallet(){

        var mnemonic = 'book trial moral hunt riot ranch yard trap tool horse good barely';
        // var bip39 = require('bip39');
        // mnemonic = bip39.generateMnemonic(); //generates string

        // 1. create default eth Mainnet wallet:
        let eth_mainnet_wallet = WalletModel.createWallet(WalletModel.CoinType.Ether, mnemonic);
        eth_mainnet_wallet.setName("ETH")
        eth_mainnet_wallet.setTitle("Ethereum")
        eth_mainnet_wallet.setDefault(true)
        eth_mainnet_wallet.setNetwork(Ethereum.Network.Mainnet)

        // 2. create default eth Rinkeby wallet:        
        let eth_rinkeby_wallet = new WalletModel(eth_mainnet_wallet.mnemonic, eth_mainnet_wallet.address, eth_mainnet_wallet.privateKey, eth_mainnet_wallet.coinType);
        eth_rinkeby_wallet.setName("ETH")
        eth_rinkeby_wallet.setNetwork(Ethereum.Network.Rinkeby)
        eth_rinkeby_wallet.setTitle("Rinkeby")

        // 3. create btc for testnet:
        var btc_testnet_wallet = WalletModel.createWallet(WalletModel.CoinType.BitcoinTestnet, mnemonic);
        btc_testnet_wallet.setName("BTC")
        btc_testnet_wallet.setTitle("Testnet")
        btc_testnet_wallet.setNetwork(Bitcoin.Network.Testnet)

        // 4. create btc for main:
        let btc_mainnet_wallet = WalletModel.createWallet(WalletModel.CoinType.Bitcoin, mnemonic);  
        btc_mainnet_wallet.setName("BTC")
        btc_mainnet_wallet.setTitle("Bitcoin")
        btc_mainnet_wallet.setNetwork(Bitcoin.Network.Mainnet)

        // ...add some more

        let masterWallet = [eth_mainnet_wallet, eth_rinkeby_wallet, btc_mainnet_wallet, btc_testnet_wallet];

        // Save to local store:
        localStore.save(WalletModel.KEY, masterWallet);

        return masterWallet;

    }
    
    // Auto create a wallet:
    static createWallet(coinType, mnemonic=''){        
        
        var hdkey = require('hdkey');
        var ethUtil = require('ethereumjs-util');

        if (mnemonic == ''){            
            mnemonic = bip39.generateMnemonic(); //generates string
        }        
        const seed = bip39.mnemonicToSeed(mnemonic); //creates seed buffer        
        const root = hdkey.fromMasterSeed(seed);
        
        // Create address for bitcoin or eth ...
        const addrNode = root.derive(("m/44'/{0}'/0'/0/0").format(coinType));          
        
        const pubKey = ethUtil.privateToPublic(addrNode._privateKey);
        const addr = ethUtil.publicToAddress(pubKey).toString('hex');
        const address = ethUtil.toChecksumAddress(addr);
        const privateKey = addrNode._privateKey.toString('hex');
        
        return new WalletModel(mnemonic, address, privateKey, coinType)
    }

    // Get list wallet from store local:
    static getMasterWallet(){
        return localStore.get(WalletModel.KEY);           
    }

    static log(data, key=WalletModel.KEY)
    {
        console.log('%c ' + '{0}: '.format(key), 'background: #222; color: #bada55', data)
    }

  }