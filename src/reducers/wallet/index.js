import local from '@/services/localStore';
import { APP } from '@/constants';
import { parseWallet, parseTool, migrate } from '@/reducers/wallet/action';

migrate();

const localWallets = local.get(APP.WALLET);
let parsedWallets = [];
if (localWallets) {
  parsedWallets = localWallets.map(wallet => parseWallet(wallet));
}

function walletReducter(state = {
  list: parsedWallets,
  ...parseTool(parsedWallets),
}) {
  return state;
}

export default walletReducter;


/*
wallet: {
  data: {},
  blockchain: {}
}
*/

/*
{
  list: [], // list wallet
  default: {
    eth: { // wallet
      ...
    },
    btc: { // wallet
      ...
    }
  }
}
*/
