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
import iconSafeGuard from '@/assets/images/icon/safe-guard.svg';

import Asset from './Asset';
import { formatMoneyByLocale } from '@/services/offer-util';
import { getCreditATM } from '@/reducers/exchange/action';

class ManageAssets extends React.Component {
  componentDidMount() {
    this.getCreditATM();
  }

  getCreditATM = () => {
    this.props.getCreditATM({ PATH_URL: API_URL.EXCHANGE.CREDIT_ATM });
  }

  depositCoinATM = () => {
    this.props.history.push(URL.ESCROW_DEPOSIT);
  }

  render () {
    const { depositInfo } = this.props;
    let assets = [];

    if (depositInfo) {
      assets = Object.values(depositInfo);
    }

    return (
      <div className="manage-assets">
        <div className="bg-white p-3">
          {
            assets.map(asset => {
              const { currency: id } = asset;
              return (
                <Asset key={id} {...asset} />
              )
            })
          }
        </div>

        <div className="p-3">
          <div className="media">
            <img src={iconSafeGuard} className="mr-2" />
            <div className="media-body font-weight-normal">
              You can always deposit coin to our escrow. <span style={{ color: '#526AFB' }}>100% safe</span>
            </div>
          </div>
          <div>
            <div className="d-inline-block w-50 pr-1">
              <button className="btn primary-button btn-block" onClick={this.depositCoinATM}>
                <FormattedMessage id="dashboard.btn.depositEscrow" />
              </button>
            </div>
            <div className="d-inline-block w-50 pl-1">
              <button className="btn secondary-button btn-block">
                <FormattedMessage id="dashboard.btn.withdrawEscrow" />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapState = state => ({
  me: state.me,
  depositInfo: state.exchange.depositInfo,
})

const mapDispatch = dispatch => ({
  rfChange: bindActionCreators(change, dispatch),
  getCreditATM: bindActionCreators(getCreditATM, dispatch),
})

export default injectIntl(connect(mapState, mapDispatch)(ManageAssets))
