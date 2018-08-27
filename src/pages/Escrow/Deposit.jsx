import React from 'react';
import {FormattedMessage, injectIntl} from 'react-intl';
import {connect} from 'react-redux';
import {URL} from '@/constants';
import createForm from '@/components/core/form/createForm';
import {Field} from 'redux-form';
import './Deposit.scss';
import {fieldInput} from '@/components/core/form/customField';

import iconBitcoin from '@/assets/images/icon/coin/btc.svg';
import iconEthereum from '@/assets/images/icon/coin/eth.svg';
import iconBitcoinCash from '@/assets/images/icon/coin/bch.svg';
import iconLock from '@/assets/images/icon/icons8-lock_filled.svg';
import {CRYPTO_CURRENCY, EXCHANGE_ACTION, FIAT_CURRENCY, MIN_AMOUNT} from '../../constants';
import {formatMoneyByLocale} from '@/services/offer-util';
import {isNormalInteger, minValue, number, required} from '@/components/core/form/validation';

const nameFormEscrowDeposit = 'escrowDeposit';
const FormEscrowDeposit = createForm({
  propsReduxForm: {
    form: nameFormEscrowDeposit,
  },
});

export const CRYPTO_ICONS = {
  [CRYPTO_CURRENCY.ETH]: iconEthereum,
  [CRYPTO_CURRENCY.BTC]: iconBitcoin,
  BCH: iconBitcoinCash,
};

const CRYPTO_CURRENCY_CREDIT_CARD = {
  ...CRYPTO_CURRENCY, BCH: 'BCH',
};

const listCurrency = Object.values(CRYPTO_CURRENCY_CREDIT_CARD).map((item) => {
  return { name: item, icon: CRYPTO_ICONS[item] };
});

class EscrowDeposit extends React.Component {
  handleOnSubmit = (values) => {
    console.log(values);
  }

  validateSpecificAmount = (values, state, props) => {
    const { percentage } = values;
    let errors = {};

    let isError = true;
    for (const item of Object.values(CRYPTO_CURRENCY_CREDIT_CARD)) {
      const itemValue = values[item];

      if (itemValue && itemValue.trim().length > 0) {
        isError = false;

        break;
      }
    }

    if (isError) {
      for (const item of Object.values(CRYPTO_CURRENCY_CREDIT_CARD)) {
        errors[item] = required(values[item]);
      }
    } else {
      for (const item of Object.values(CRYPTO_CURRENCY_CREDIT_CARD)) {
        errors[item] = minValue(MIN_AMOUNT[item])(values[item]);
      }
    }

    // errors.percentage = isNormalInteger(percentage || 0);

    return errors;
  };


  handleValidate = (values) => {
    return this.validateSpecificAmount(values, this.state, this.props);
  }


  render() {
    const { messages } = this.props.intl;
    const { intl, hideNavigationBar } = this.props;
    const { listOfferPrice } = this.props;

    return (
      <div className="escrow-deposit">
        <div>
          <button className="btn btn-lg bg-transparent d-inline-block btn-close">
            &times;
          </button>
        </div>
        <div className="wrapper">
          <h4>
            <FormattedMessage id="escrow.label.depositCoin" />
          </h4>
          <div>
            <FormEscrowDeposit onSubmit={this.handleOnSubmit} validate={this.handleValidate}>
              <div>
                <div className="d-inline-block w-50 escrow-label">
                  <FormattedMessage id="escrow.label.iWantTo" />
                </div>
                <div className="d-inline-block w-50 escrow-label">
                  <FormattedMessage id="escrow.label.price" />
                </div>
              </div>
              {listCurrency.map(coin => {
                const { name, icon } = coin;

                const offerPrice = listOfferPrice && listOfferPrice.find((item) => {
                  const { type, currency, fiatCurrency } = item;
                  return type === EXCHANGE_ACTION.SELL && currency === name && fiatCurrency === FIAT_CURRENCY.USD;
                });

                const fiatCurrency = offerPrice && offerPrice.price || 0;

                return (
                  <div key={name} className="mt-2">
                    <div className="d-inline-block w-50 pr-2">
                      <div style={{ position: 'relative' }}>
                        <Field
                          name={name}
                          className="form-control form-deposit-custom"
                          type="text"
                          component={fieldInput}
                          elementPrepend={
                            <img src={icon} className="icon-deposit" />
                          }
                          validate={[number]}
                        />
                      </div>
                    </div>
                    <div className="d-inline-block w-50 pl-2 bg-light rounded" style={{ lineHeight: '38px' }}>
                      <span className="font-weight-normal">{formatMoneyByLocale(fiatCurrency, FIAT_CURRENCY.USD)}</span>
                      <span className="escrow-label float-right mr-2 font-weight-normal">{`${FIAT_CURRENCY.USD}/${name}`}</span>
                    </div>
                  </div>
                );
              })}
              <div className="mt-3">
                <div className="w-75 d-inline-block align-middle">
                  <div className="font-weight-normal"><FormattedMessage id="escrow.label.yourSellingPrice" /></div>
                  <div className="escrow-label">
                    <FormattedMessage id="escrow.label.sellingPriceCaption" />
                  </div>
                </div>
                <div className="w-25 d-inline-block align-middle">
                  <div style={{ position: 'relative' }}>
                    <Field
                      name="percentage"
                      className="form-control pr-4"
                      type="tel"
                      component={fieldInput}
                      elementAppend={
                        <span className="percentage-symbol escrow-label font-weight-normal">%</span>
                      }
                      validate={[number, required]}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <button type="submit" className="btn btn-primary btn-block">
                  <img src={iconLock} width={16} className="align-top mr-2" />
                  <FormattedMessage id="escrow.btn.depositNow" />
                </button>
              </div>
            </FormEscrowDeposit>
          </div>
        </div>
      </div>
    );
  }
}

const mapState = state => ({
  listOfferPrice: state.exchange.listOfferPrice,
});

const mapDispatch = dispatch => ({
  // rfChange: bindActionCreators(change, dispatch),
});

export default injectIntl(connect(mapState, mapDispatch)(EscrowDeposit));
