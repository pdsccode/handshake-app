import React from 'react';
import {injectIntl} from 'react-intl';
import Feed from '@/components/core/presentation/Feed';
import Button from '@/components/core/controls/Button';

import createForm from '@/components/core/form/createForm';
import {fieldCleave, fieldDropdown, fieldInput, fieldRadioButton} from '@/components/core/form/customField';
import {required} from '@/components/core/form/validation';
import {Field, formValueSelector} from "redux-form";
import {connect} from "react-redux";

const nameFormExchangeCreate = 'exchangeCreate';
const FormExchangeCreate = createForm({
  propsReduxForm: {
    form: nameFormExchangeCreate,
    initialValues: { type: 1, },
  },
});
const selectorFormExchangeCreate = formValueSelector(nameFormExchangeCreate);

class Component extends React.Component {
  onAmountChange = (e) => {
    const amount = e.target.value;
    console.log('onAmountChange', amount);
    // this.getCryptoPriceByAmount(amount);
    // this.setState({amount: amount}, () => {
    //   this.getCryptoPriceByAmountThrottled(amount);
    // });
  }

  onPriceChange = (e) => {
    const price = e.target.value;
    console.log('onPriceChange', price);
  }

  handleSubmit = (values) => {
    console.log('valuessss', values);
    const {totalAmount} = this.props;
    console.log('totalAmount', totalAmount);
  }

  render() {
    const { totalAmount } = this.props;
    console.log('render totalAmount', totalAmount);

    const coin = 'ETH'
    const amount = 0.0001
    const price = '$1000'
    const address = '81 E August'
    const listType = [
      { value: 1, text: 'Buy' },
      { value: 2, text: 'Sell' },
    ]
    const listCoin = [
      { value: 1, text: 'ETH' },
      { value: 2, text: 'BTC' },
    ]

    return (
      <div>
        <FormExchangeCreate onSubmit={this.handleSubmit}>
          <Feed className="feed p-2 mb-2" background="linear-gradient(-133deg, #006AFF 0%, #3AB4FB 100%)">
            <div style={{ color: 'white' }}>
              <div className="d-flex">
                <label className="col-form-label mr-auto" style={{ width: '100px' }}>I want to</label>
                <div className='input-group'>
                  <Field
                    name="type"
                    component={fieldRadioButton}
                    list={listType}
                  />
                </div>
              </div>
              <div className="d-flex">
                <label className="col-form-label mr-auto" style={{ width: '100px' }}>Coin</label>
                <div className='input-group'>
                  <Field
                    name="coin"
                    component={fieldRadioButton}
                    list={listCoin}
                  />
                </div>
              </div>
              <div className="d-flex">
                <label className="col-form-label mr-auto" style={{ width: '100px' }}>Amount</label>
                <Field
                  name="amount"
                  className="form-control-custom form-control-custom-ex w-100"
                  component={fieldInput}
                  onChange={this.onAmountChange}
                />
              </div>
              <div className="d-flex">
                <label className="col-form-label mr-auto" style={{ width: '100px' }}>Price</label>
                <Field
                  name="price"
                  className="form-control-custom form-control-custom-ex w-100"
                  component={fieldInput}
                  onChange={this.onPriceChange}
                />
              </div>
              <div className="d-flex">
                <label className="col-form-label mr-auto" style={{ width: '100px' }}>Total</label>
                <input name="total" type="number" className="form-control-custom form-control-custom-ex w-100" value={totalAmount} readOnly />
                {/*<Field*/}
                  {/*name="total"*/}
                  {/*className="form-control-custom form-control-custom-ex w-100" disabled value={totalAmount}*/}
                  {/*component={fieldInput}*/}
                {/*/>*/}
              </div>
              <div className="d-flex">
                <label className="col-form-label mr-auto" style={{ width: '100px' }}>Address</label>
                <Field
                  name="address"
                  className="form-control-custom form-control-custom-ex w-100"
                  component={fieldInput}
                />
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
  console.log('mapStateToProps', amount);
  console.log('mapStateToProps', price);
  console.log('mapStateToProps', totalAmount);
  return { totalAmount };
};

const mapDispatchToProps = {
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Component));
