import React from 'react';
import Feed from '@/components/core/presentation/Feed';
import Button from '@/components/core/controls/Button';

import createForm from '@/components/core/form/createForm';
import { fieldInput, fieldCleave, fieldDropdown, fieldRadioButton } from '@/components/core/form/customField';
import { required } from '@/components/core/form/validation';
import { formValueSelector, Field } from "redux-form";

const nameFormExchangeCreate = 'exchangeCreate';
const FormExchangeCreate = createForm({
  propsReduxForm: {
    form: nameFormExchangeCreate,
    initialValues: { type: 1 },
  },
});
const selectorFormExchangeCreate = formValueSelector(nameFormExchangeCreate);

class NewComponent extends React.Component {
  handleSubmit = (values) => {
    console.log('valuessss', values)
  }
  render() {
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
                />
              </div>
              <div className="d-flex">
                <label className="col-form-label mr-auto" style={{ width: '100px' }}>Price</label>
                <Field
                  name="price"
                  className="form-control-custom form-control-custom-ex w-100"
                  component={fieldInput}
                />
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

export default NewComponent;
