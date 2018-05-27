import React from 'react';
import {injectIntl} from 'react-intl';
import Feed from '@/components/core/presentation/Feed';
import Button from '@/components/core/controls/Button';

import createForm from '@/components/core/form/createForm';
import {fieldCleave, fieldDropdown, fieldInput, fieldRadioButton} from '@/components/core/form/customField';
import {required} from '@/components/core/form/validation';
import {Field, formValueSelector} from "redux-form";
import {connect} from "react-redux";
import {createOffer} from '@/reducers/exchange/action';
import {API_URL} from "@/constants";
import {
  CRYPTO_CURRENCY, CRYPTO_CURRENCY_DEFAULT, EXCHANGE_ACTION,
  EXCHANGE_ACTION_DEFAULT, FIAT_CURRENCY
} from "@/constants";
import {FIAT_CURRENCY_SYMBOL} from "../../../../constants";

const nameFormExchangeCreate = 'exchangeCreate';
const FormExchangeCreate = createForm({
  propsReduxForm: {
    form: nameFormExchangeCreate,
    initialValues: { type: EXCHANGE_ACTION_DEFAULT, currency: CRYPTO_CURRENCY_DEFAULT },
  },
});
const selectorFormExchangeCreate = formValueSelector(nameFormExchangeCreate);

const mainColor = '#007AFF'

class Component extends React.Component {
  onAmountChange = (e) => {
    const amount = e.target.value;
    // console.log('onAmountChange', amount);
    // this.getCryptoPriceByAmount(amount);
    // this.setState({amount: amount}, () => {
    //   this.getCryptoPriceByAmountThrottled(amount);
    // });
  }

  onPriceChange = (e) => {
    const price = e.target.value;
    // console.log('onPriceChange', price);
  }

  handleSubmit = (values) => {
    const {totalAmount} = this.props;
    console.log('valuessss', values);
    const offer = {
      min_amount: values.amount,
      max_amount: values.amount,
      currency: values.currency,
      price: values.price,
      price_currency: FIAT_CURRENCY,
      total: totalAmount,
      type: values.type,
    };

    console.log('handleSubmit', offer);

    this.props.createOffer({ BASE_URL: API_URL.EXCHANGE.BASE, PATH_URL: API_URL.EXCHANGE.OFFER, data: offer, METHOD: 'POST' });
  }

  render() {
    const { totalAmount } = this.props;

    return (
      <div>
        <FormExchangeCreate onSubmit={this.handleSubmit}>
          <Feed className="feed p-2 mb-2" background={mainColor}>
            <div style={{ color: 'white' }}>
              <div className="d-flex mb-2">
                <label className="col-form-label mr-auto" style={{ width: '100px' }}>I want to</label>
                <div className='input-group'>
                  <Field
                    name="type"
                    component={fieldRadioButton}
                    list={EXCHANGE_ACTION}
                    color={mainColor}
                    validate={[required]}
                  />
                </div>
              </div>
              <div className="d-flex">
                <label className="col-form-label mr-auto" style={{ width: '100px' }}>Coin</label>
                <div className='input-group'>
                  <Field
                    name="currency"
                    component={fieldRadioButton}
                    list={CRYPTO_CURRENCY}
                    color={mainColor}
                    validate={[required]}
                  />
                </div>
              </div>
              <div className="d-flex">
                <label className="col-form-label mr-auto" style={{ width: '100px' }}>Amount</label>
                <div className="w-100">
                  <Field
                    name="amount"
                    className="form-control-custom form-control-custom-ex w-100"
                    component={fieldInput}
                    onChange={this.onAmountChange}
                    validate={[required]}
                  />
                </div>
              </div>
              <div className="d-flex">
                <label className="col-form-label mr-auto" style={{ width: '100px' }}>Price({FIAT_CURRENCY_SYMBOL})</label>
                <div className="w-100">
                  <Field
                    name="price"
                    className="form-control-custom form-control-custom-ex w-100"
                    component={fieldInput}
                    onChange={this.onPriceChange}
                    validate={[required]}
                  />
                </div>
              </div>
              <div className="d-flex">
                <label className="col-form-label mr-auto" style={{ width: '100px' }}>Total({FIAT_CURRENCY_SYMBOL})</label>
                <span className="w-100 col-form-label">{totalAmount}</span>
              </div>
              <div className="d-flex">
                <label className="col-form-label mr-auto" style={{ width: '100px' }}>Address</label>
                <div className="w-100">
                  <Field
                    name="address"
                    className="form-control-custom form-control-custom-ex w-100"
                    component={fieldInput}
                    validate={[required]}
                  />
                </div>
              </div>
            </div>
          </Feed>
          <Button block type="submit">Sign & send</Button>
        </FormExchangeCreate>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const amount = selectorFormExchangeCreate(state, 'amount');
  const price = selectorFormExchangeCreate(state, 'price');
  const totalAmount = amount * price;

  return { totalAmount };
};

const mapDispatchToProps = {
  createOffer
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Component));
