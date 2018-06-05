import chipSVG from '@/assets/images/categories/chip.svg';
import exchangeSVG from '@/assets/images/categories/exchange.svg';
// import handPlantingSVG from '@/assets/images/categories/hand-planting.svg';
// import shoppingCartSVG from '@/assets/images/categories/shopping-cart.svg';

import { HANDSHAKE_ID, HANDSHAKE_NAME } from '@/constants';

const CATEGORIES = [{
  id: HANDSHAKE_ID.BETTING,
  name: HANDSHAKE_NAME[HANDSHAKE_ID.BETTING],
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
  id: HANDSHAKE_ID.EXCHANGE,
  name: HANDSHAKE_NAME[HANDSHAKE_ID.EXCHANGE],
  image: exchangeSVG,
  priority: 2,
},
// {
//   id: 99, // temp
//   name: 'Bazaar',
//   image: shoppingCartSVG,
//   priority: 3
// },
];

export default CATEGORIES;
