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
import cx from 'classnames';

import iconBitcoin from '@/assets/images/icon/coin/btc.svg';
import iconEthereum from '@/assets/images/icon/coin/eth.svg';
import iconBitcoinCash from '@/assets/images/icon/coin/bch.svg';
import iconLock from '@/assets/images/icon/icons8-lock_filled.svg';

class Asset extends React.Component {

  render () {
    const { id, coin, isActive } = this.props;

    return (
      <div className="position-relative">
        <div style={{ opacity: isActive ? 1 : 0.3 }}>
          <div>
            <img src={iconBitcoin} width={19} />
            <span className="ml-1 text-normal">Bitcoin</span>
          </div>
          <div className="mt-4 pl-4 pr-5">
            <div className="d-table w-100">
              <div className="d-table-cell text-normal">Buy</div>
              <div className="d-table-cell text-right">
                <span className="green-color">148,232,231</span>
                <span className="black-color">/BTC</span>
              </div>
            </div>

            <div className="d-table w-100">
              <div className="d-table-cell text-normal">Sell</div>
              <div className="d-table-cell text-right">
                <span className="red-color">14,232,231</span>
                <span className="black-color">/BTC</span>
              </div>
            </div>
          </div>
        </div>


        <button
          className={cx('btn btn-sm btn-activate', isActive ? 'outline-button' : 'primary-button')}
        >
          {
            isActive ? <FormattedMessage id="dashboard.btn.deactivate" /> : <FormattedMessage id="dashboard.btn.reactivate" />
          }
        </button>
        <hr />
      </div>
    )
  }
}

const mapState = state => ({
  // me: state.me
})

const mapDispatch = dispatch => ({
  rfChange: bindActionCreators(change, dispatch)
})

export default injectIntl(connect(mapState, mapDispatch)(Asset))
