import React from 'react';
import { connect } from 'react-redux';
import { Field } from 'redux-form';
import createForm from '@/components/core/form/createForm';
import { fieldDropdown, fieldRadioButton } from '@/components/core/form/customField';
import { injectIntl } from 'react-intl';
import './NavBar.scss';
import {
  CRYPTO_CURRENCY,
  CRYPTO_CURRENCY_COLORS,
  CRYPTO_CURRENCY_NAME,
  EXCHANGE_ACTION,
  EXCHANGE_ACTION_COLORS,
  EXCHANGE_ACTION_NAME,
} from '@/constants';

const listAction = Object.values(EXCHANGE_ACTION).map((item) => {
  return { value: item, text: EXCHANGE_ACTION_NAME[item], bgColorActive: EXCHANGE_ACTION_COLORS[item].color };
});

const listCoin = Object.values(CRYPTO_CURRENCY).map((item) => {
  return { id: item, text: <span><img src={CRYPTO_CURRENCY_COLORS[item].icon} width={25} /> {CRYPTO_CURRENCY_NAME[item]}</span> };
});

import iconMyATM from './icons8-location_off.svg';

import iconBitcoin from '@/assets/images/icon/coin/btc.svg';
import iconEthereum from '@/assets/images/icon/coin/eth.svg';
import iconBitcoinCash from '@/assets/images/icon/coin/bch.svg';

const iconMap = {
  ETH: iconEthereum,
  BTC: iconBitcoin,
  BCH: iconBitcoinCash,
}
class NavBar extends React.Component {
  render() {
    const { messages } = this.props.intl;
    const coins = [
      {
        name: 'ETH',
        price: '200'
      },
      {
        name: 'BTC',
        price: '7,000'
      },
    ]
    return (
      <div className="cash-nav-bar">
        {/*<button type="button" className="btn bg-transparent mr-2" onClick={() => console.log('clickmenu')}>☰</button>*/}
        <button className="ml-2">
          <img src={iconMyATM} width={24} />
          <span className="mx-2">My ATM</span>
        </button>
        <div className="d-inline-block">
          {
            coins.map(coin => {
              const { name, price } = coin;
              return (
                <span key={name} className="d-inline-block mr-3">
                  <img src={iconMap[name]} width={24} />
                  {' '}
                  <span><strong>{price}</strong> USD</span>
                </span>
              )
            })
          }
          <span>

          </span>
        </div>
      </div>
    );
  }
}

const mapState = state => ({
});

const mapDispatch = dispatch => ({
  // rfChange: bindActionCreators(change, dispatch),
});

export default injectIntl(connect(mapState, mapDispatch)(NavBar));
