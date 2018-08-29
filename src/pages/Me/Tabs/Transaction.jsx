import React from 'react'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
// action, mock
import { fireBaseBettingChange, fireBaseExchangeDataChange, loadMyHandshakeList } from '@/reducers/me/action'
import {
  API_URL,
  APP,
  EXCHANGE_FEED_TYPE,
  HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS,
  HANDSHAKE_ID,
  HANDSHAKE_ID_DEFAULT,
  URL
} from '@/constants'
import { fieldDropdown, fieldRadioButton } from '@/components/core/form/customField';
import { FormattedMessage, injectIntl } from 'react-intl'
// components
import { getDashboardInfo, getListOfferPrice, getOfferStores, reviewOffer } from '@/reducers/exchange/action'
// style
import { setOfflineStatus } from '@/reducers/auth/action'
import createForm from "@/components/core/form/createForm";
import { change, Field } from 'redux-form';

import iconBitcoin from '@/assets/images/icon/coin/btc.svg';
import iconEthereum from '@/assets/images/icon/coin/eth.svg';
import iconBitcoinCash from '@/assets/images/icon/coin/bch.svg';
import iconLock from '@/assets/images/icon/icons8-lock_filled.svg';

import TransactionItem from './TransactionItem'

const nameFormTransaction = "formTransaction";
const FormTransaction = createForm({
  propsReduxForm: {
    form: nameFormTransaction
  }
});

class Transaction extends React.Component {

  render () {

    const transactions = [
      {
        id: 1,
        date: '23 August, 2017',
      },
      {
        id: 2,
        date: '24 August, 2017',
      }
    ]
    return (
      <div className="mt-4">
        {
          transactions.map(transaction => {
            const { id } = transaction;
            return (
              <TransactionItem key={id} {...transaction} />
            )
          })
        }
      </div>
    )
  }
}

const mapState = state => ({
  me: state.me
})

const mapDispatch = dispatch => ({
  rfChange: bindActionCreators(change, dispatch)
})

export default injectIntl(connect(mapState, mapDispatch)(Transaction))
