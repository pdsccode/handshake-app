import React from 'react';
// import Button from '@/components/core/controls/Button/Button';
// import { URL } from '@/config';
import { Grid, Row, Col } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { Collapse, Button, CardBody, Card } from 'reactstrap';
import { Formik, Field } from 'formik';
import { fieldInput, fieldCleave } from '../Form/customField'
import validation, { required } from '../Form/validation'

const allCCTypes = {
  amex: {
    name: 'amex',
    img: 'https://kbob.github.io/images/sample-1.jpg'
  },
  discover: {
    name: 'discover',
    img: 'https://kbob.github.io/images/sample-2.jpg'
  },
  mastercard: {
    name: 'mastercard',
    img: 'https://kbob.github.io/images/sample-5.jpg'
  },
  visa: {
    name: 'visa',
    img: 'https://kbob.github.io/images/sample-4.jpg'
  },
}


class Component extends React.Component {
  state = {
    ccType: '',
    isNewCCOpen: false
  }
  handleCCTypeChanged = (type) => {
    this.setState({ ccType: type })
  }
  handleToggleNewCC = () => {
    this.setState({ isNewCCOpen: !this.state.isNewCCOpen })
  }
  handleSubmit = (e) => {
    e.preventDefault()
    const fakeValues = {
      amount: 12341234,
      total: 12341234,
      cardNumber: 12341234,
      cardExpiration: 12341234,
    }
  }
  render() {
    const { isCCExisting = true } = this.props
    const { ccType, isNewCCOpen } = this.state
    const lastDigits = '1222'
    const newCCElement = (
      <div className='mt-3'>
        <div className="form-group">
          <label>cc:label.cardNumber</label>
          <div className='input-group'>
            <Field
              name="cc_number"
              className='form-control'
              component={fieldCleave}
              elementPrepend={
                <div className="input-group-prepend">
                  <span className="input-group-text bg-white">
                    <img width="26px" height="26px" src={(allCCTypes[ccType] && allCCTypes[ccType].img) || 'https://kbob.github.io/images/sample-3.jpg'} />
                  </span>
                </div>
              }
              propsCleave={{
                // id: `card-number-${this.lastUniqueId()}`,
                placeholder: 'cc:placeholder.cardNumber',
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
        <div className="form-row">
          <div className="form-group col-6">
            <label>{'cc:label.cardExpiry'}</label>
            <Field
              name="cc_expired"
              className='form-control'
              component={fieldCleave}
              propsCleave={{
                placeholder: 'cc:placeholder.cardExpiry',
                options: {blocks: [2, 2], delimiter: '/', numericOnly: true},
                // type: "tel",
                // id: `cart-date-${this.lastUniqueId()}`,
                // htmlRef: input => this.ccExpiredRef = input,
                // onKeyDown: this.ccExpiredRefKeyDown,
              }}
              // validate={(!isCCExisting || isNewCCOpen) ? [required] : []}
            />
          </div>
          <div className="form-group col-6">
            <label>{'cc:label.cardCVC'}</label>
            <Field
              name="cc_cvc"
              className='form-control'
              component={fieldCleave}
              propsCleave={{
                placeholder: 'cc:placeholder.cardCVC',
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
      <div className="">
        <Formik
          initialValues={{ email: '', password: '' }}
          onSubmit={(
            values,
            { setSubmitting, setErrors /* setValues and other goodies */ }
          ) => {
            console.log('valuess', values)
          }}
          render={(props) => (
            <form onSubmit={props.handleSubmit}>
              {
                isCCExisting ? (
                  <div className='form-group'>
                    <label>{'cc:label.existingCC'}</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                  <span className="input-group-text bg-white">
                    <img width="26px" height="26px" src={'https://kbob.github.io/images/sample-3.jpg'} />
                  </span>
                      </div>
                      <input type="text" className="form-control bg-white border-left-0 border-right-0" value={`**** **** **** ${lastDigits}`} readOnly />
                      <div className="input-group-append">
                  <span className="input-group-text bg-white">
                    <span className="badge badge-pill badge-success">&#10004;</span>
                  </span>
                      </div>
                    </div>
                    <div className='card mt-3'>
                      <div className='card-body'>
                        <Field
                          name="toggleCCOpen"
                          component={
                            ({ field: { onChange, value, name }, form: { setFieldValue } }) =>
                              <button className="w-100 btn btn-light dropdown-toggle" type='button'
                                      onClick={() => {
                                        setFieldValue(name, !value)
                                        this.handleToggleNewCC()
                                      }}
                              >
                                { 'cc:button.changeNewCredit' }
                              </button>
                          }
                        />
                        <Collapse isOpen={isNewCCOpen}>
                          {newCCElement}
                        </Collapse>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    {newCCElement}
                  </div>
                )
              }
              <button type="submit">Submit</button>
            </form>
          )}
        />
      </div>
    )
  }
}

export default Component;
