import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import {connect} from "react-redux";
import CreditCard from './components/CreditCard';
import Tabs from './components/Tabs';
import LevelItem from './components/LevelItem';
import Feed from '@/components/core/presentation/Feed';
import Button from '@/components/core/controls/Button';
import ModalDialog from '@/components/core/controls/ModalDialog';
import { Formik, Field } from 'formik';
import { fieldInput, fieldCleave, fieldDropdown } from './components/Form/customField'
import validation, { required } from './components/Form/validation'
import localStore from '@/services/localStore';
import { URL } from '@/config';
import './Exchange.scss'
import { validate } from './validation'

import {getUserProfile, getCryptoPrice, createCCOrder,
  getUserCcLimit, getCcLimits
} from '@/reducers/exchange/action';

class Exchange extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: 0,
      currency: 'ETH',
      isNewCCOpen: false,
      modalContent: '',
      showCCScheme: false,
      showCC: false
    }
  }

  componentDidMount() {
    this.props.getUserProfile({headers: {'Custom-Uid': 'megalodon'}});
    this.props.getCcLimits({});
    this.props.getUserCcLimit({headers: {'Custom-Uid': 'megalodon'}});

    this.getCryptoPriceByAmount(0);

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
    const cryptoCurrency = this.state.currency;

    var data = {amount: amount, currency: cryptoCurrency};

    this.props.getCryptoPrice({qs: data,
        successFn: this.handleGetCryptoPriceSuccess,
        errorFn: this.handleGetCryptoPriceFailed
      });
  }

  handleGetCryptoPriceSuccess = (data) => {
    console.log('handleGetCryptoPriceSuccess', data);
    const {userCcLimit} = this.props;

    if (userCcLimit.limit < userCcLimit.amount + data.fiat_amount) {
      this.setState({showCCScheme: true});
    }
  }

  handleGetCryptoPriceFailed = (e) => {
    console.log('handleGetCryptoPriceFailed', e);
  }


  handleCreateCCOrder = (params) => {
    const {cryptoPrice} = this.props;
    let address = localStore.get('address');
    address = '0x2a08a375e203a72f1A378827A3b66D2785A2F7D5';

    if (cryptoPrice) {
      const paramsObj = {
        amount: cryptoPrice.amount.trim(),
        currency: cryptoPrice.currency.trim(),
        fiat_amount: cryptoPrice.fiat_amount.trim(),
        fiat_currency: "USD",
        address: address,
        payment_method_data: params
      };
      console.log('handleCreateCCOrder',paramsObj);
      this.props.createCCOrder({data: paramsObj, headers: {'Custom-Uid': 'megalodon'},
        successFn: this.handleCreateCCOrderSuccess,
        errorFn: this.handleCreateCCOrderFailed
      });
    }
  }

  handleCreateCCOrderSuccess = (data) => {
    console.log('handleCreateCCOrderSuccess', data);
    this.setState({modalContent:
        (<div>
          <h1>Buy Success. Buy another?</h1>
          <Button onClick={this.handleBuySuccess}>Cancel</Button>
          <Button onClick={this.handleBuyAnother}>OK</Button>
        </div>)
    }, () => {
      this.modalRef.open();
    });
  }

  handleBuyAnother = () => {
    this.modalRef.close();
  }

  handleBuySuccess = () => {
    this.props.history.push(URL.TRANSACTION_LIST);
  }

  handleCreateCCOrderFailed = (e) => {
    // console.log('handleCreateCCOrderFailed', JSON.stringify(e.response));
    this.setState({modalContent:
        (<div>
          <h1>Buy Failed</h1>
          <span>{e.response?.data?.message}</span>
          <Button onClick={this.handleBuyFailed}>OK</Button>
        </div>)
    }, () => {
      this.modalRef.open();
    });
  }

  handleBuyFailed = () => {
    this.modalRef.close();
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
        cc_num: cc_number && cc_number.trim().replace(/ /g, ''),
        cvv: cc_cvc && cc_cvc.trim().replace(/ /g, ''),
        expiration_date: cc_expired && cc_expired.trim().replace(/ /g, ''),
        token: "",
        save: "true"
      };
    }

    // console.log('handleSubmit', cc);
    this.handleCreateCCOrder(cc);
  }

  onAmountChange = (e) => {
    const amount = e.target.value;
    this.setState({ showCC: !!amount });
    this.getCryptoPriceByAmount(amount);
    this.setState({amount: amount}, () => {
      // this.props.dispatch(change('cc-order'));
    });
  }

  onCurrencyChange = (e) => {
    const currency = e.target.textContent || e.target.innerText;
    this.setState({currency: currency}, () => {
      this.getCryptoPriceByAmount(this.state.amount);
    });
  }

  handleToggleNewCC = () => {
    this.setState({ isNewCCOpen: !this.state.isNewCCOpen })
  }

  handleValidate = (values) => {
    return validate(values, this.state, this.props)
  }

  // handleValidate = values => {
  //   console.log('valuessv', values)
  //   // same as above, but feel free to move this into a class method now.
  //   let errors = {};
  //   // if (!values.email) {
  //   //   errors.email = 'Required';
  //   // } else if (
  //   //   !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
  //   // ) {
  //   //   errors.email = 'Invalid email address';
  //   // }
  //   return errors;
  // }

  render() {
    const {intl, userProfile, cryptoPrice} = this.props;
    const { showCC } = this.state;
    const allCryptoCurrencies = [
      { name: 'ETH', text: 'ETH' },
      { name: 'BTC', text: 'BTC' },
    ];
    const fiatCurrency = '$';
    const total = cryptoPrice && cryptoPrice.fiat_amount;

    let modalContent = this.state.modalContent;

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
                        initialValues={{ amount: '', currency: this.state.currency }}
                        validate={this.handleValidate}
                        onSubmit={this.handleSubmit}
                        render={(props) => (
                          <form onSubmit={props.handleSubmit}>
                            <Feed className="feed" background="linear-gradient(-133deg, #006AFF 0%, #3AB4FB 100%)">
                              <div style={{ color: 'white' }}>
                                <div className="form-group mx-2 pt-2 d-flex">
                                  <label className="col-form-label"><FormattedMessage id="buy"/></label>
                                  <Field
                                    name="amount"
                                    component={fieldInput}
                                    className="form-control-custom form-control-custom-ex d-inline-block mx-2"
                                    // style={{ width: '40%' }}
                                    onChange={this.onAmountChange}
                                    onRef={div => this.amountRef = div}
                                    placeholder={intl.formatMessage({id: 'amount'})}
                                  />
                                  <span className="d-inline-block ml-auto" style={{ width: '235px' }}>
                                  <Field
                                    name="currency"
                                    component={fieldDropdown}
                                    list={allCryptoCurrencies}
                                    onRef={div => this.currencyRef = div}
                                    onChange={this.onCurrencyChange}
                                    // defaultText={''}
                                  />
                                </span>
                                </div>
                                <div className="mx-2">
                                  <p><FormattedMessage id="askUsingCreditCard" values={{ fiatCurrency: fiatCurrency, total: total }} /></p>
                                </div>
                                {
                                  showCC && (
                                    <CreditCard
                                      isCCExisting={userProfile && userProfile.credit_card.cc_number.trim().length > 0}
                                      lastDigits={userProfile && userProfile.credit_card.cc_number}
                                      isNewCCOpen={this.state.isNewCCOpen}
                                      handleToggleNewCC={this.handleToggleNewCC}
                                    />
                                  )
                                }

                              </div>
                            </Feed>
                            <Button block type="submit"><FormattedMessage id="shakeNow"/></Button>
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
        <ModalDialog onRef={modal => this.modalRef = modal}>
          {modalContent}
        </ModalDialog>
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
  cryptoPrice: state.exchange.cryptoPrice,
  userCcLimit: state.exchange.userCcLimit,
  ccLimits: state.exchange.ccLimits,
});

const mapDispatchToProps = {
  getUserProfile,
  getCryptoPrice,
  createCCOrder,
  getUserCcLimit,
  getCcLimits,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Exchange));
