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
import Withdraw from '@/pages/Escrow/Withdraw';
import Modal from '@/components/core/controls/Modal/Modal';

class ManageAssets extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalWithdrawContent: '',
    };
  }

  componentDidMount() {
    this.getCreditATM();
  }

  getCreditATM = () => {
    this.props.getCreditATM({ PATH_URL: API_URL.EXCHANGE.CREDIT_ATM });
  }

  depositCoinATM = () => {
    this.props.history.push(URL.ESCROW_DEPOSIT);
  }

  withdrawCash = () => {
    const { messages } = this.props.intl;

    this.setState({
      modalWithdrawContent:
        (
          <Withdraw setLoading={this.props.setLoading} history={this.props.history}/>
        ),
    }, () => {
      this.modalWithdrawRef.open();
    });
  }

  closeWithdraw = () => {
    this.setState({ modalWithdrawContent: '' });
  }

  render () {
    const { messages } = this.props.intl;
    const { depositInfo } = this.props;
    const { modalWithdrawContent } = this.state;
    let assets = [];

    if (depositInfo) {
      const { updatedAt, ...rest } = depositInfo;
      assets = Object.values(rest);
    }

    return (
      <div className="manage-assets">
        <div className="bg-white p-3">
          {
            assets.map(asset => {
              const { currency: id } = asset;
              return (
                <Asset key={id} {...asset} history={this.props.history} setLoading={this.props.setLoading}/>
              )
            })
          }
        </div>

        <div className="mt-3">
          <div className="media">
            <img src={iconSafeGuard} className="mr-2" />
            <div className="media-body font-weight-normal">
              <FormattedMessage id="dashboard.label.deposit.description1" />
              <span style={{ color: '#526AFB' }}><FormattedMessage id="dashboard.label.deposit.description2" /></span>
            </div>
          </div>
          <div className="mt-3">
            <div className="d-inline-block w-50 pr-1">
              <button className="btn primary-button btn-block" onClick={this.depositCoinATM}>
                <FormattedMessage id="dashboard.btn.depositEscrow" />
              </button>
            </div>
            <div className="d-inline-block w-50 pl-1">
              <button className="btn secondary-button btn-block" onClick={this.withdrawCash}>
                <FormattedMessage id="dashboard.btn.withdrawEscrow" />
              </button>
            </div>
          </div>
        </div>
        <Modal title={messages.me.credit.withdraw.title} onRef={modal => this.modalWithdrawRef = modal} onClose={this.closeWithdraw}>
          {modalWithdrawContent}
        </Modal>
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
