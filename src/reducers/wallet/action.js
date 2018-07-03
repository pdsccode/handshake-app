import { MasterWallet } from '@/services/Wallets/MasterWallet';

export const createMasterWallets = () => new Promise((resolve) => {
  Promise.all([MasterWallet.createMasterWallets()]);
  resolve();
});

export default { createMasterWallets };
