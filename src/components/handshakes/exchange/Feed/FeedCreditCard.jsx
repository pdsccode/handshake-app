import React from 'react';
import { FormattedHTMLMessage, FormattedMessage, injectIntl } from 'react-intl'
import { change, Field, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import CreditCard from '@/components/handshakes/exchange/components/CreditCard';
import LevelItem from '@/components/handshakes/exchange/components/LevelItem';
import Feed from '@/components/core/presentation/Feed';
import Button from '@/components/core/controls/Button';
import ModalDialog from '@/components/core/controls/ModalDialog';
import local from '@/services/localStore';
import {
  API_URL,
  APP,
  CRYPTO_CURRENCY_DEFAULT,
  CRYPTO_CURRENCY_LIST,
  FIAT_CURRENCY,
  FIAT_CURRENCY_SYMBOL,
  URL,
} from '@/constants';
import '../styles.scss';
import { validate } from '@/components/handshakes/exchange/validation';
import throttle from 'lodash/throttle';
import createForm from '@/components/core/form/createForm';
import { fieldCleave, fieldDropdown, fieldInput, fieldRadioButton } from '@/components/core/form/customField';
import { required } from '@/components/core/form/validation';
import { createCCOrder, getCcLimits, getCryptoPrice, getUserCcLimit } from '@/reducers/exchange/action';
import CryptoPrice from '@/models/CryptoPrice';
import { MasterWallet } from '@/services/Wallets/MasterWallet';
import { bindActionCreators } from 'redux';
import { hideLoading, showAlert, showLoading } from '@/reducers/app/action';
import _sample from 'lodash/sample';
import { feedBackgroundColors } from '@/components/handshakes/exchange/config';
import { formatMoney } from '@/services/offer-util';
import { BigNumber } from 'bignumber.js';
import axios from 'axios';
import './FeedCreditCard.scss';
import { getErrorMessageFromCode } from '@/components/handshakes/exchange/utils';
import * as gtag from '@/services/ga-utils';
import taggingConfig from '@/services/tagging-config';

import iconBitcoin from '@/assets/images/icon/coin/btc.svg';
import iconEthereum from '@/assets/images/icon/coin/eth.svg';
import iconUsd from '@/assets/images/icon/coin/icons8-us_dollar.svg';
import iconLock from '@/assets/images/icon/icons8-lock_filled.svg';
const nameFormSpecificAmount = 'specificAmount';
const FormSpecificAmount = createForm({
  propsReduxForm: {
    form: nameFormSpecificAmount,
    initialValues: {
      currency: {
        id: 'eth',
        text: <span><img src={iconEthereum} width={22} /> ETH</span>,
      },
      fiatCurrency: {
        id: 'usd',
        text: <span><img src={iconUsd} width={24} /> USD</span>,
      }
    },
  },
});

class FeedCreditCard extends React.Component {

  render() {

    const listCurrency = [
      {
        id: 'eth',
        text: <span><img src={iconEthereum} width={24} /> ETH</span>,
      },
      {
        id: 'btc',
        text: <span><img src={iconBitcoin} width={24} /> BTC</span>,
      },
    ]
    const listFiatCurrency = [
      {
        id: 'usd',
        text: <span><img src={iconUsd} width={24} /> USD</span>,
      }
    ]

    const packages = [
      {
        name: 'basic',
        price: '$99',
        amount: '0.3434 ETH',
      },
      {
        name: 'pro',
        price: '$99',
        amount: '0.3434 ETH',
      },
      {
        name: 'plus',
        price: '$99',
        amount: '0.3434 ETH',
        saving: 20
      }
    ]
    return (
      <div className="credit-card">
        <div className="specific-amount">
          <FormSpecificAmount onSubmit={(values) => console.log('submit', values)}>
            <div className="text-right" style={{ margin: '-10px' }}><button className="btn btn-lg bg-transparent text-white d-inline-block">&times;</button></div>
            <div className="label-1"><FormattedMessage id="cc.label.1" /></div>
            <div className="label-2"><FormattedMessage id="cc.label.2" /></div>
            <div className="input-group mt-4">
              <Field
                name="amount"
                className="form-control form-control-lg border-0 rounded-right form-control-cc"
                type="text"
                component={fieldInput}
              />
              <Field
                name="currency"
                classNameWrapper=""
                // defaultText={<FormattedMessage id="ex.create.placeholder.stationCurrency" />}
                classNameDropdownToggle="dropdown-button"
                list={listCurrency}
                component={fieldDropdown}
                // disabled={!enableChooseFiatCurrency}
              />
            </div>
            <div className="input-group mt-2">
              <Field
                name="fiatAmount"
                className="form-control form-control-lg border-0 rounded-right form-control-cc"
                type="text"
                component={fieldInput}
              />
              <Field
                name="fiatCurrency"
                classNameWrapper=""
                // defaultText={<FormattedMessage id="ex.create.placeholder.stationCurrency" />}
                classNameDropdownToggle="dropdown-button"
                list={listFiatCurrency}
                component={fieldDropdown}
                // disabled={!enableChooseFiatCurrency}
              />
            </div>
            <div className="mt-3 mb-3">
              <button type="submit" className="btn btn-lg btn-primary btn-block btn-submit-specific">
                <img src={iconLock} width={20} className="align-top mr-2" /><span>Buy 10.02 ETH</span>
              </button>
            </div>
          </FormSpecificAmount>
        </div>

        <div className="by-package">
          <div className="my-3 p-label-choose"><FormattedMessage id="cc.label.3" /></div>
          <div className="mb-5">
            {
              packages.map((item, index) => {
                const { name, price, amount, saving } = item;
                return (
                  <div key={name}>
                    <div className="d-table w-100">
                      <div className="d-table-cell align-middle" style={{ width: '80px' }}>
                        <div className={`package p-${name}`}><FormattedMessage id={`cc.label.${name}`} /></div>
                      </div>
                      <div className="d-table-cell align-middle pl-3">
                        <div className="p-price">
                          {price}
                          {
                            saving && (
                              <span className="p-saving"><FormattedMessage id="cc.label.saving" values={{ percentage: saving }} /></span>
                            )
                          }
                        </div>
                        <div className="p-amount">{amount}</div>
                      </div>
                      <div className="d-table-cell align-middle text-right">
                        <button className="btn btn-p-buy-now"><FormattedMessage id="cc.btn.buyNow" /></button>
                      </div>
                    </div>
                    { index < packages.length - 1 && <hr /> }
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  userProfile: state.exchange.userProfile,
  cryptoPrice: state.exchange.cryptoPrice,
  userCcLimit: state.exchange.userCcLimit,
  ccLimits: state.exchange.ccLimits || [],
  authProfile: state.auth.profile,
});

const mapDispatchToProps = (dispatch) => ({
  getCryptoPrice: bindActionCreators(getCryptoPrice, dispatch),
  createCCOrder: bindActionCreators(createCCOrder, dispatch),
  getUserCcLimit: bindActionCreators(getUserCcLimit, dispatch),
  getCcLimits: bindActionCreators(getCcLimits, dispatch),
  rfChange: bindActionCreators(change, dispatch),
  showAlert: bindActionCreators(showAlert, dispatch),
  showLoading: bindActionCreators(showLoading, dispatch),
  hideLoading: bindActionCreators(hideLoading, dispatch),
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(FeedCreditCard));
