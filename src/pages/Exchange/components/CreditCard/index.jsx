import React from 'react';
// import Button from '@/components/core/controls/Button/Button';
// import { URL } from '@/config';
import { Grid, Row, Col } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { Collapse, Button, CardBody, Card } from 'reactstrap';
import { Formik, Field } from 'formik';

// import imgCC from '@/assets/images/card/credit-card.svg';
// import imgAmex from '@/assets/images/card/amex.svg';
// import imgDiscover from '@/assets/images/card/discover.svg';
// import imgMastercard from '@/assets/images/card/mastercard.svg';
// import imgVisa from '@/assets/images/card/visa.svg';

import { fieldInput, fieldCleave, fieldDropdown } from '../Form/customField'
import validation, { required } from '../Form/validation'


// const allCCTypes = {
//   amex: {
//     name: 'amex',
//     img: imgAmex
//   },
//   discover: {
//     name: 'discover',
//     img: imgDiscover
//   },
//   mastercard: {
//     name: 'mastercard',
//     img: imgMastercard
//   },
//   visa: {
//     name: 'visa',
//     img: imgVisa
//   },
// }


class Component extends React.Component {
  state = {
    ccType: '',
  }
  handleCCTypeChanged = (type) => {
    this.setState({ ccType: type })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const {handleSubmit} = this.props;
    const fakeValues = {
      cc_number: '4111111111111111',
      cc_expired: '11/21',
      cc_cvc: '111',
    }

    handleSubmit(fakeValues);
  }
  render() {
    const { isCCExisting, lastDigits, isNewCCOpen, handleToggleNewCC } = this.props
    const { ccType } = this.state;

    const newCCElement = (
      <div className={`bg-primary rounded-bottom p-2 ${!isCCExisting ? 'mb-2' : ''}`}>
        <div className="d-flex">
          <label className="col-form-label mr-auto" style={{ width: '100px' }}>Number</label>
          <div className='input-group'>
            <Field
              name="cc_number"
              className='form-control-custom'
              component={fieldCleave}
              // elementPrepend={
              //   <div className="input-group-prepend">
              //     <span className="input-group-text bg-white">
              //       <img width="26px" height="26px" src={(allCCTypes[ccType] && allCCTypes[ccType].img) || imgCC} />
              //     </span>
              //   </div>
              // }
              propsCleave={{
                // id: `card-number-${this.lastUniqueId()}`,
                placeholder: 'Required',
                options: {
                  creditCard: true,
                  onCreditCardTypeChanged: this.handleCCTypeChanged
                },
                // type: "tel",
                // maxLength: "19",
                // htmlRef: input => this.ccNumberRef = input,
              }}
              // validate={(!isCCExisting || isNewCCOpen) ? [required] : []}
            />
          </div>
        </div>
        <div className="d-flex mt-2">
          <label className="col-form-label mr-auto" style={{ width: '100px' }}>Expiry</label>
          <div className='input-group'>
            <Field
              name="cc_expired"
              className='form-control-custom'
              component={fieldCleave}
              propsCleave={{
                placeholder: 'MM/YY',
                options: {blocks: [2, 2], delimiter: '/', numericOnly: true},
                // type: "tel",
                // id: `cart-date-${this.lastUniqueId()}`,
                // htmlRef: input => this.ccExpiredRef = input,
                // onKeyDown: this.ccExpiredRefKeyDown,
              }}
              // validate={(!isCCExisting || isNewCCOpen) ? [required] : []}
            />
          </div>
        </div>
        <div className="d-flex mt-2">
          <label className="col-form-label mr-auto" style={{ width: '100px' }}>CVC</label>
          <div className='input-group'>
            <Field
              name="cc_cvc"
              className='form-control-custom'
              component={fieldCleave}
              propsCleave={{
                placeholder: 'Security Code',
                options: {blocks: [4], numericOnly: true},
                type: "password",
                // maxLength: "4",
                // minLength: "3",
                // id: `cart-cvc-${this.lastUniqueId()}`,
                // htmlRef: input => this.ccCvcRef = input,
              }}
              // validate={(!isCCExisting || isNewCCOpen) ? [required] : []}
            />
          </div>
        </div>
      </div>
    )
    return (
      <div className="row1">
        <div className='col1'>
          {
            isCCExisting ? (
              <div className='form-group'>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text bg-light rounded-0">
                      <img width="26px" height="26px" src={imgCC} />
                    </span>
                  </div>
                  <input type="text" className="form-control bg-light border-left-0 border-right-0" value={`**** **** **** ${lastDigits}`} readOnly />
                  <div className="input-group-append">
                    <span className="input-group-text bg-light rounded-0">
                      <Field
                        name="toggleCCOpen"
                        component={
                          ({ field: { onChange, value, name }, form: { setFieldValue } }) =>
                            <button className="w-100 btn btn-link" type='button'
                                    onClick={() => {
                                      setFieldValue(name, !value)
                                      handleToggleNewCC()
                                    }}
                            >
                              Change&nbsp;{value ? 'v' : '>'}
                            </button>
                        }
                      />
                    </span>
                  </div>
                </div>
                <Collapse isOpen={isNewCCOpen}>
                  {newCCElement}
                </Collapse>
              </div>
            ) : (
              <div>
                {newCCElement}
              </div>
            )
          }
        </div>
      </div>
    )
  }
}

export default Component;
