import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// action, mock
import { fireBaseBettingChange, fireBaseExchangeDataChange, loadMyHandshakeList } from '@/reducers/me/action';
import {
  API_URL,
  APP,
  CRYPTO_CURRENCY,
  CRYPTO_CURRENCY_NAME,
  EXCHANGE_FEED_TYPE,
  HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS,
  HANDSHAKE_ID,
  HANDSHAKE_ID_DEFAULT,
  URL,
} from '@/constants';
import { fieldDropdown, fieldRadioButton } from '@/components/core/form/customField';
import { FormattedMessage, injectIntl } from 'react-intl';
// components
import { getDashboardInfo, getListOfferPrice, getOfferStores, reviewOffer } from '@/reducers/exchange/action';
// style
import { setOfflineStatus } from '@/reducers/auth/action';
import createForm from '@/components/core/form/createForm';
import { change, Field, formValueSelector } from 'redux-form';

import iconBitcoin from '@/assets/images/icon/coin/btc.svg';
import iconEthereum from '@/assets/images/icon/coin/eth.svg';
import iconBitcoinCash from '@/assets/images/icon/coin/bch.svg';
import iconLock from '@/assets/images/icon/icons8-lock_filled.svg';
import Modal from '@/components/core/controls/Modal/Modal';
import * as gtag from '@/services/ga-utils';
import taggingConfig from '@/services/tagging-config';
import FeedCreditCard from '@/components/handshakes/exchange/Feed/FeedCreditCard';
import { MasterWallet } from '@/services/Wallets/MasterWallet';

const nameFormOverview = 'formOverview';
const FormOverview = createForm({
  propsReduxForm: {
    form: nameFormOverview,
    initialValues: {
      currency: {
        id: CRYPTO_CURRENCY.ETH,
        text: <span><img src={iconEthereum} width={22} /> {CRYPTO_CURRENCY_NAME[CRYPTO_CURRENCY.ETH]}</span>,
      },
    },
  },
});
const selectorFormOverview = formValueSelector(nameFormOverview);

export const CRYPTO_ICONS = {
  [CRYPTO_CURRENCY.ETH]: iconEthereum,
  [CRYPTO_CURRENCY.BTC]: iconBitcoin,
  BCH: iconBitcoinCash,
};

const CRYPTO_CURRENCY_CREDIT_CARD = {
  ...CRYPTO_CURRENCY, BCH: 'BCH',
};

const listCurrency = Object.values(CRYPTO_CURRENCY_CREDIT_CARD).map((item) => {
  return { id: item, text: <span><img src={CRYPTO_ICONS[item]} width={24} /> {CRYPTO_CURRENCY_NAME[item]}</span> };
});

class Overview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalFillContent: '',
    };
  }

  componentDidMount() {
  }

  buyCoinsUsingCreditCard = () => {
    const { messages } = this.props.intl;
    const { currency } = this.props;
    const wallet = MasterWallet.getWalletDefault(currency);

    console.log('buyCoinsUsingCreditCard', currency);

    this.setState({
      modalFillContent:
        (
          <FeedCreditCard
            buttonTitle={messages.create.cash.credit.title}
            currencyForced={wallet ? wallet.name : ''}
            callbackSuccess={this.afterWalletFill}
            addressForced={wallet ? wallet.address : ''}
          />
        ),
    }, () => {
      this.modalFillRef.open();
    });
  }

  showPopupBuyByCreditCard = () => {
    this.buyCoinsUsingCreditCard();

    gtag.event({
      category: taggingConfig.creditCard.category,
      action: taggingConfig.creditCard.action.showPopupDashboard,
    });
  }

  afterWalletFill = () => {
    this.modalFillRef.close();
  }

  closeFillCoin = () => {
    this.setState({ modalFillContent: '' });
  }

  handleSubmit = (values) => {
    console.log('handleSubmit', values);
  }

  render() {
    const { messages } = this.props.intl;
    const { modalFillContent } = this.state;

    return (
      <div>
        <FormOverview onSubmit={this.handleSubmit}>
          <div className="bg-white" style={{ padding: '15px' }}>
            <div className="d-table w-100">
              <div className="d-table-cell font-weight-bold">Stats</div>
              <div className="d-table-cell text-right">
                <Field
                  name="currency"
                  component={fieldDropdown}
                  // defaultText={
                  //   <FormattedMessage id="landing_page.recruiting.referFriend.label.jobPosition" />
                  // }
                  classNameDropdownToggle="dropdown-sort bg-white"
                  classNameWrapper="d-inline-block"
                  list={listCurrency}
                />
              </div>
            </div>

            <div className="mt-4">
              <div className="d-table w-100">
                <div className="d-table-cell text-normal">
                  BTC bought
                </div>
                <div className="d-table-cell text-right green-color">
                  +124.1234
                </div>
              </div>

              <div className="d-table w-100 mt-2">
                <div className="d-table-cell text-normal">
                  BTC sold
                </div>
                <div className="d-table-cell text-right red-color">
                  50.3232
                </div>
              </div>

              <div className="d-table w-100 mt-2">
                <div className="d-table-cell text-normal">
                  Amount left
                </div>
                <div className="d-table-cell text-right black-color">
                  75.74334
                </div>
              </div>

              <hr />

              <div className="d-table w-100 mt-2">
                <div className="d-table-cell text-normal">
                  Revenue
                </div>
                <div className="d-table-cell text-right black-color">
                  $1,000,000
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-4">
            <div className="d-inline-block" style={{ width: '90%' }}>
              <button type="button" className="btn btn-block primary-button" onClick={this.showPopupBuyByCreditCard}>
                <img src={iconLock} width={14} className="align-top mr-2" />
                <FormattedMessage id="dashboard.btn.topUpByCC" />
              </button>
            </div>
            <div className="text-normal my-2">or</div>
            <div className="d-inline-block" style={{ width: '90%' }}>
              <button type="button" className="btn btn-block secondary-button" onClick={this.showPopupBuyByCreditCard}>
                <FormattedMessage id="dashboard.btn.scanQRCode" />
              </button>
            </div>
          </div>

        </FormOverview>
        <Modal title={messages.create.cash.credit.title} onRef={modal => this.modalFillRef = modal} onClose={this.closeFillCoin}>
          {modalFillContent}
        </Modal>
      </div>
    );
  }
}

const mapState = state => ({
  me: state.me,
  currency: selectorFormOverview(state, 'currency')?.id,
});

const mapDispatch = dispatch => ({
  rfChange: bindActionCreators(change, dispatch),
});

export default injectIntl(connect(mapState, mapDispatch)(Overview));
