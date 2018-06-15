
import localStore from '@/services/localStore';
import { Bitcoin } from '@/models/Bitcoin.js';
import { BitcoinTestnet } from '@/models/BitcoinTestnet.js';
import { Ethereum } from '@/models/Ethereum.js';
import { Wallet } from '@/models/Wallet.js';
import { APP } from '@/constants';
import { StringHelper } from '@/services/helper';

const bip39 = require('bip39');

export class MasterWallet {
    // list coin is supported, can add some more Ripple ...
    static ListCoin = { Ethereum, Shuriken, Bitcoin, BitcoinTestnet };

    static ListCoinReward = { Ethereum, Bitcoin };

    static KEY = 'wallets';

    // Create an autonomous wallet:

    static createMasterWallets() {
      const t0 = performance.now();

      // let mnemonic = 'canal marble trend ordinary rookie until combine hire rescue cousin issue that';
      // let mnemonic = 'book trial moral hunt riot ranch yard trap tool horse good barely';

      let mnemonic = bip39.generateMnemonic(); // generates string

      const masterWallet = [];
      for (const k1 in MasterWallet.ListCoin) {
        for (const k2 in MasterWallet.ListCoin[k1].Network) {
          // init a wallet:
          const wallet = new MasterWallet.ListCoin[k1]();
          // set mnemonic, if not set then auto gen.
          wallet.mnemonic = mnemonic;
          wallet.network = MasterWallet.ListCoin[k1].Network[k2];
          // create address, private-key ...
          wallet.createAddressPrivatekey();
          masterWallet.push(wallet);
        }
      }

      // set item 1,3 is default
      if (masterWallet.length > 0) { masterWallet[1].default = true; }
      masterWallet[3].default = true;

      // For Reward wallet:
      mnemonic = bip39.generateMnemonic();
      for (const k in MasterWallet.ListCoinReward) {
        const wallet = new MasterWallet.ListCoinReward[k]();
        wallet.mnemonic = mnemonic;
        wallet.network = MasterWallet.ListCoinReward[k].Network.Mainnet;
        wallet.createAddressPrivatekey();
        wallet.isReward = true;
        masterWallet.push(wallet);
      }

      // Save to local store:
      MasterWallet.UpdateLocalStore(masterWallet);

      const t1 = performance.now();

      MasterWallet.log(`Call to createMasterWallet took ${t1 - t0} milliseconds.`);

      return masterWallet;
    }

    // return list coin temp for create/import:
    static getListCoinTemp() {
      const tempWallet = [];
      for (const k1 in MasterWallet.ListCoin) {
        for (const k2 in MasterWallet.ListCoin[k1].Network) {
          const wallet = new MasterWallet.ListCoin[k1]();
          wallet.network = MasterWallet.ListCoin[k1].Network[k2];
          tempWallet.push(wallet);
        }
      }
      if (tempWallet.length > 0) tempWallet[0].default = true;
      return tempWallet;
    }

    // for create new wallets:
    static createNewsallets(listCoinTemp, mnemonic) {
      let isImport = false;
      if (mnemonic == '') {
        mnemonic = bip39.generateMnemonic(); // generates string
      } else if (!bip39.validateMnemonic(mnemonic)) {
        console.log('validateMnemonic mnemonic', false);
        return false;
      }
      else {
        isImport = true;
      }
      const masterWallet = MasterWallet.getMasterWallet();
      listCoinTemp.forEach((wallet) => {
        if (wallet.default) {
          wallet.default = false;
          wallet.mnemonic = mnemonic;
          wallet.protected = isImport;
          // create address, private-key ...
          wallet.createAddressPrivatekey();
          masterWallet.push(wallet);
        }
      });
      MasterWallet.UpdateLocalStore(masterWallet);
      return masterWallet;
    }

    static UpdateLocalStore(masterWallet) {
      console.log('masterWallet saved');
      localStore.save(MasterWallet.KEY, masterWallet);
    }

    static UpdateBalanceItem(item){
      let wallets = MasterWallet.getMasterWallet();
      wallets.forEach((wallet) => {
        if (wallet.address == item.address && wallet.network == item.network) {
          wallet.balance = item.balance;
        }
      });
      MasterWallet.UpdateLocalStore(wallets);
    }

    // Restore wallets:
    static RestoreMasterWallet(masterWalletDataString) {
      // todo: need verify invalid data:
      localStore.save(MasterWallet.KEY, masterWalletDataString);
      const masterWallet = JSON.parse(masterWalletDataString);
      localStore.save(MasterWallet.KEY, masterWallet);
      return masterWallet;
    }

    // Get list wallet from store local:
    static getMasterWallet() {
      const wallets = localStore.get(MasterWallet.KEY);

      if (wallets == false) return false;

      const listWallet = [];
      wallets.forEach((walletJson) => {
        
        let wallet =  MasterWallet.convertObject(walletJson)
        if (wallet != false) listWallet.push(wallet);

      });

      return listWallet;
    }

    // Get list wallet from store local:
    static getWalletDefault(coinName = '') {
      const wallets = localStore.get(MasterWallet.KEY);

      if (wallets == false) return false;

      const BreakException = {};
      try {
        if (coinName != '') {
          let wallet = false;
          wallets.forEach((walletJson) => {
            if (walletJson.default && coinName == walletJson.name) {
              wallet = MasterWallet.convertObject(walletJson);
            }
          });
          return wallet;
        }

        const lstDefault = {};

        wallets.forEach((walletJson) => {
          if (!lstDefault.hasOwnProperty(walletJson.name)) { lstDefault[walletJson.name] = null; }
          if (walletJson.default) {
            lstDefault[walletJson.name] = MasterWallet.convertObject(walletJson);
          }
        });
        return lstDefault;
      } catch (e) {
        if (e !== BreakException) throw e;
      }
      return false;
    }

  // Get list reward wallet from store local:
    static getRewardWalletDefault(coinName = '') {
      const wallets = localStore.get(MasterWallet.KEY);

      if (wallets == false) return false;

      const BreakException = {};
      try {
        if (coinName != '') {
          let wallet = false;
          wallets.forEach((walletJson) => {
            if (walletJson.isReward && coinName == walletJson.name) {
              wallet = MasterWallet.convertObject(walletJson);
            }
          });
          return wallet;
        }

        const lstDefault = {};

        wallets.forEach((walletJson) => {
          if (!lstDefault.hasOwnProperty(walletJson.name)) { lstDefault[walletJson.name] = null; }
          if (walletJson.isReward) {
            lstDefault[walletJson.name] = MasterWallet.convertObject(walletJson);
          }
        });
        return lstDefault;
      } catch (e) {
        if (e !== BreakException) throw e;
      }
      return false;
    }

    static convertObject(walletJson) {
      try {
        const wallet = new MasterWallet.ListCoin[walletJson.className]();
        wallet.mnemonic = walletJson.mnemonic;
        wallet.address = walletJson.address;
        wallet.privateKey = walletJson.privateKey;
        wallet.coinType = walletJson.coinType;
        wallet.default = walletJson.default;
        wallet.balance = walletJson.balance;
        wallet.network = walletJson.network;
        wallet.name = walletJson.name;
        wallet.title = walletJson.title;
        wallet.protected = walletJson.protected;
        wallet.isReward = walletJson.isReward;
        wallet.chainId = walletJson.chainId;
        return wallet;
      } catch (e) {
        return false;
      }
    }

    static IsJsonString(str) {
      try {
        return JSON.parse(str);
      } catch (e) {
        return false;
      }
    }
    static restoreWallets(dataString) {
      try {
        const jsonData = MasterWallet.IsJsonString(dataString);
        console.log('jsonData', jsonData);
        if (jsonData !== false) {
          if (Array.isArray(jsonData)) {
            console.log('isArray');
            const listWallet = [];
            jsonData.forEach((walletJson) => {
              const wallet = MasterWallet.convertObject(walletJson);
              console.log('wallet=>', wallet);
              if (wallet === false) {
                throw BreakException;
              }
              listWallet.push(wallet);
            });
            MasterWallet.UpdateLocalStore(listWallet);
            return listWallet;
          }
        }
      } catch (e) {
        console.log('Wallet is invaild', e);
      }
      return false;
    }

    static getRewardWalletJson() {      
      let walletReward = MasterWallet.getMasterWallet();
      const reward_wallet_string = {};
      walletReward.forEach((reward_wallet) => {
        if (reward_wallet.isReward)
          reward_wallet_string[reward_wallet.name] = { address: reward_wallet.address, name: reward_wallet.name, network: reward_wallet.network, chainId: reward_wallet.chainId};
      });      
      return JSON.stringify(reward_wallet_string);
    }

    static log(data, key = MasterWallet.KEY) {
      console.log(`%c ${StringHelper.format('{0}: ', key)}`, 'background: #222; color: #bada55', data);
    }
}

export default { MasterWallet };
