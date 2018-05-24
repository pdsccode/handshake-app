import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import {connect} from "react-redux";
import CreditCard from './components/CreditCard';
import Tabs from './components/Tabs';
import Feed from '@/components/core/presentation/Feed';
import Button from '@/components/core/controls/Button';
import { Formik, Field } from 'formik';
import { fieldInput, fieldCleave, fieldDropdown } from './components/Form/customField'
import validation, { required } from './components/Form/validation'

import {getUserProfile, getCryptoPrice, createCCOrder, getUserCcLimit, getCcLimits} from '@/reducers/exchange/action';

class Exchange extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: 0,
      isNewCCOpen: false
    }
  }

  componentDidMount() {
    this.props.getUserProfile({headers: {'Custom-Uid': 'megalodon'}});
    this.props.getCcLimits({});
    this.props.getUserCcLimit({headers: {'Custom-Uid': 'megalodon'}});

    // this.props.dispatch(change('credit-card', 'amount', '1'));
    this.getCryptoPriceByAmount(1);

    this.intervalCountdown = setInterval(() => {
      this.getCryptoPriceByAmount(this.state.amount);
    }, 30000);
  }

  componentWillUnmount() {
    if (this.intervalCountdown) {
      clearInterval(this.intervalCountdown);
    }
  }

  getCryptoPriceByAmount = (amount) => {
    // const {app: {setting: {cryptoCurrency}}} = this.props;
    const cryptoCurrency = 'BTC';

    var data = {amount: amount, currency: cryptoCurrency};

    console.log('getCryptoPriceByAmount', data);

    this.props.getCryptoPrice({qs: data});
  }

  handleCreateCCOrder = (params) => {
    // const {cryptoPrice} = this.props;
    const cryptoPrice = {amount: '123', currency: 'BTC', fiat_amount: '1234567'};
    if (cryptoPrice) {
      const paramsObj = {
        amount: cryptoPrice.amount.trim(),
        currency: cryptoPrice.currency.trim(),
        fiat_amount: cryptoPrice.fiat_amount.trim(),
        fiat_currency: "USD",
        payment_method_data: params
      };
      // console.log('handleCreateCCOrder',paramsObj);
      this.props.createCCOrder({data: paramsObj});
    }
  }


  handleSubmit = (values) => {
    console.log('handleSubmit', values);
    const {userProfile: {credit_card}} = this.props;

    let cc = {};

    //Use existing credit card
    if (credit_card.cc_number.trim().length > 0 && !this.state.isNewCCOpen) {
      cc = {token: "true"};
    } else {
      const {cc_number, cc_expired, cc_cvc} = values;
      cc = {
        cc_num: cc_number && cc_number.trim(),
        cvv: cc_cvc && cc_cvc.trim(),
        expiration_date: cc_expired && cc_expired.trim(),
        token: "",
        save: "true"
      };
    }

    console.log('handleSubmit', cc);
    this.handleCreateCCOrder(cc);
  }

  handleFormSubmit = (values, { setSubmitting, setErrors }) => {
    console.log('valuess', values)
  }

  onAmountChange = (e) => {
    const amount = e.target.value;
    this.getCryptoPriceByAmount(amount);
    this.setState({amount: amount}, () => {
      // this.props.dispatch(change('cc-order'));
    });
  }

  handleToggleNewCC = () => {
    this.setState({ isNewCCOpen: !this.state.isNewCCOpen })
  }

  render() {
    const {userProfile, cryptoPrice} = this.props;
    const allCryptoCurrencies = [
      { name: 'ETH', text: 'ETH' },
      { name: 'BTC', text: 'BTC' },
      { name: 'LTC', text: 'LTC' },
      { name: 'BCH', text: 'BCH' },
    ];
    const fiatCurrency = '$';
    const total = cryptoPrice && cryptoPrice.fiat_amount;

    return (
      <div className='container'>
        <div className='row'>
          <div className='col'>
            <Tabs
              activeIndex={1}
              onClickTab={(tab) => console.log('tab', tab)}
              data={{
                1: {
                  header: 'Buy',
                  element: (
                    <div>
                      <Formik
                        initialValues={{ amount: '', currency: 'BTC' }}
                        onSubmit={this.handleFormSubmit}
                        render={(props) => (
                          <form onSubmit={props.handleSubmit}>
                            <Feed className="feed">
                              <div className="form-group mx-2 pt-2 d-flex">
                                <label className="col-form-label">Buy</label>
                                <Field
                                  name="amount"
                                  component={fieldInput}
                                  className="form-control d-inline-block mx-2"
                                  // style={{ width: '40%' }}
                                  onChange={this.onAmountChange}
                                />
                                <span className="d-inline-block ml-auto" style={{ width: '235px' }}>
                                  <Field
                                    name="currency"
                                    component={fieldDropdown}
                                    list={allCryptoCurrencies}
                                    // defaultText={''}
                                  />
                                </span>
                              </div>
                              <div className="mx-2">
                                <p>for {fiatCurrency}{total} using a credit card?</p>
                              </div>
                              <CreditCard handleSubmit={this.handleSubmit}
                                          isCCExisting={userProfile && userProfile.credit_card.cc_number.trim().length > 0}
                                          lastDigits={userProfile && userProfile.credit_card.cc_number}
                                          isNewCCOpen={this.state.isNewCCOpen} handleToggleNewCC={this.handleToggleNewCC}
                              />
                            </Feed>
                            <Button block type="submit">Shake now</Button>
                          </form>
                        )}
                      />
                    </div>
                  )
                },
                2: {
                  header: 'Sell',
                  element: (
                    <div>Sell</div>
                  )
                },
              }}
            />
          </div>
        </div>
      </div>
    )
    // return (
    //   <Grid>
    //     <Row>
    //       <Col xs={12}>
    //
    //       </Col>
    //     </Row>
    //   </Grid>
    // );
  }
}

const mapStateToProps = (state) => ({
  userProfile: state.exchange.userProfile,
  cryptoPrice: state.exchange.cryptoPrice
});

const mapDispatchToProps = {
  getUserProfile,
  getCryptoPrice,
  createCCOrder,
  getUserCcLimit,
  getCcLimits
};

export default connect(mapStateToProps, mapDispatchToProps)(Exchange);
