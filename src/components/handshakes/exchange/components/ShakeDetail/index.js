import React from 'react';
import './styles.scss'
import createForm from '@/components/core/form/createForm';
import {required} from '@/components/core/form/validation';

import { formValueSelector, Field } from "redux-form";
import Button from '@/components/core/controls/Button';

import {fieldCleave, fieldDropdown, fieldInput, fieldRadioButton} from '@/components/core/form/customField'
import iconBitcoin from '@/assets/images/icon/coin/btc.svg';
import iconEthereum from '@/assets/images/icon/coin/eth.svg';
import iconApproximate from '@/assets/images/icon/icons8-approximately_equal.svg';
const nameFormShakeDetail = 'shakeDetail'
const FormShakeDetail = createForm({ propsReduxForm: { form: nameFormShakeDetail } });
const selectorFormShakeDetail = formValueSelector(nameFormShakeDetail);

export class Component extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  handleSubmit = (values) => {
    console.log('valuess', values)
  }

  render() {
    const currency = "ETH";
    const fiat = "USD";
    const total = "623,232";
    return (
      <div className="shake-detail">
        <FormShakeDetail onSubmit={this.handleSubmit}>
          <div className='input-group'>
            <Field
              name="type"
              // containerClass="radio-container-old"
              component={fieldRadioButton}
              type="tab-1"
              list={[{ value: 'buy', text: 'BUY' }, { value: 'sell', text: 'SELL' }]}
              // color={textColor}
              // validate={[required]}
            />
          </div>
          <div className='input-group mt-3'>
            <Field
              name="currency"
              // containerClass="radio-container-old"
              component={fieldRadioButton}
              type="tab-2"
              list={[{ value: 'btc', text: 'BTC', icon: <img src={iconBitcoin} width={22} /> }, { value: 'eth', text: 'ETH', icon: <img src={iconEthereum} width={22} /> }]}
              // color={textColor}
              // validate={[required]}
            />
          </div>
          <div className="mt-3">
            <div className="text">Amount</div>
            <div className='input-group'>
              <Field
                name="amount"
                // containerClass="radio-container-old"
                component={fieldInput}
                className="input"
                placeholder="10.00"
                // type="tab-2"
                // list={[{ value: 'btc', text: 'BTC', icon: <img src={iconBitcoin} width={22} /> }, { value: 'eth', text: 'ETH', icon: <img src={iconEthereum} width={22} /> }]}
                validate={[required]}
              />
              <span className="append-text">{currency}</span>
            </div>
          </div>
          <hr className="hl" />
          <div className="text-total">
            Total ({fiat}) <img src={iconApproximate} /> <span className="float-right">{total}</span>
          </div>
          <Button block type="submit" className="mt-3">Shake</Button>
        </FormShakeDetail>
      </div>
    );
  }
}

Component.propTypes = {
};

export default Component;
