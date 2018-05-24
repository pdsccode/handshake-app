
import localStore from '@/services/localStore';
var bip39 = require('bip39');
export class WalletModel {      
    
    static CoinType = {"Ether": 60, "Bitcoin": 0, "BitcoinTestnet": 1}
    static KEY = "wallets";
    
    constructor(mnemonic, address, privateKey, coinType) {
      this.mnemonic = mnemonic;      
      this.address = address;
      this.privateKey = privateKey;
      this.coinType = coinType;
    }

    // Create an autonomous wallet:
    static createMasterWallet(){

        var mnemonic = 'book trial moral hunt riot ranch yard trap tool horse good barely';
        // var bip39 = require('bip39');
        // mnemonic = bip39.generateMnemonic(); //generates string

        // 1. create default eth wallet:
        var eth_wallet = WalletModel.createWallet(WalletModel.CoinType.Ether, mnemonic);

        // 2. create btc for testnet:
        var btc_testnet_wallet = WalletModel.createWallet(WalletModel.CoinType.BitcoinTestnet, mnemonic);

        // 3. create btc for main:
        var btc_mainnet_wallet = WalletModel.createWallet(WalletModel.CoinType.Bitcoin, mnemonic);  
        
        // ...add some more

        var masterWallet = [eth_wallet, btc_mainnet_wallet, btc_testnet_wallet];

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