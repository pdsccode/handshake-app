import chipSVG from '@/assets/images/categories/chip.svg';
import exchangeSVG from '@/assets/images/categories/exchange.svg';
// import exchangeLocalSVG from '@/assets/images/categories/exchange-local.svg';
// import handPlantingSVG from '@/assets/images/categories/hand-planting.svg';
// import shoppingCartSVG from '@/assets/images/categories/shopping-cart.svg';

import { DISCOVER } from '@/constants';

const TABS = [{
  id: DISCOVER.TABS.PREDICTION.ID,
  name: 'Prediction',
  image: chipSVG,
  priority: 0,
},
// {
//   id: HANDSHAKE_ID.SEED,
//   name: 'Seed',
//   image: handPlantingSVG,
//   priority: 1,
// },
{
  id: DISCOVER.TABS.EXCHANGE.ID,
  name: 'Cash',
  image: exchangeSVG,
  priority: 2,
},
// {
//   id: HANDSHAKE_ID.EXCHANGE_LOCAL,
//   name: 'Swap',
//   image: exchangeLocalSVG,
//   priority: 3,
// },
// {
//   id: 99, // temp
//   name: 'Bazaar',
//   image: shoppingCartSVG,
//   priority: 3
// },
];

export default TABS;
