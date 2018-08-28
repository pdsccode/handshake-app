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
import iconSpinner from '@/assets/images/icon/icons8-spinner.gif';

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
            const { id, date } = transaction;
            return (
              <div key={id} className="transaction">
                <div className="text-normal" style={{ padding: '0 15px' }}>{date}</div>
                <div className="transaction-detail">
                  <div className="d-table w-100">
                    <div className="d-table-cell font-weight-bold">
                      <img src={iconBitcoin} width={19} />
                      <span className="type-order ml-2">PURCHASE ORDER</span>
                    </div>
                    <div className="d-table-cell text-right">
                      <img src={iconSpinner} width="14px" />
                      <span className="status ml-2">Processing...</span>
                    </div>
                  </div>

                  <div className="text-normal mt-2">
                    Be patient - it can take a couple of minutes for your coin to be sent to escrow
                  </div>

                  <hr />


                  <div className="d-table w-100">
                    <div className="d-table-cell text-normal">
                      Desired amount
                    </div>
                    <div className="d-table-cell text-right">
                      <span className="font-weight-bold">5.00</span>
                      &nbsp;
                      <span className="text-normal">BTC</span>
                    </div>
                  </div>

                  <div className="d-table w-100">
                    <div className="d-table-cell text-normal">
                      Price
                    </div>
                    <div className="d-table-cell text-right">
                      <span className="font-weight-bold">50000</span>
                      &nbsp;
                      <span className="text-normal">USD</span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="d-inline-block w-50 pr-1">
                      <button className="btn primary-button btn-block">Main action</button>
                    </div>
                    <div className="d-inline-block w-50 pl-1">
                      <button className="btn danger-button btn-block">Cancel</button>
                    </div>
                  </div>

                </div>
              </div>
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
