import React from 'react';
import {FormattedMessage, injectIntl} from 'react-intl';
import {Field, formValueSelector} from "redux-form";
import {connect} from "react-redux";
import CreditCard from '@/components/handshakes/exchange/components/CreditCard';
import LevelItem from '@/components/handshakes/exchange/components/LevelItem';
import Feed from '@/components/core/presentation/Feed';
import Button from '@/components/core/controls/Button';
import ModalDialog from '@/components/core/controls/ModalDialog';
import localStore from '@/services/localStore';
import {URL} from '@/config';
import '../styles.scss';
import {validate} from '@/components/handshakes/exchange/Feed/validation';
import throttle from 'lodash/throttle';
import createForm from '@/components/core/form/createForm'
import {fieldCleave, fieldDropdown, fieldInput, fieldRadioButton} from '@/components/core/form/customField'
import {required} from '@/components/core/form/validation'
import {createCCOrder, getCcLimits, getCryptoPrice, getUserCcLimit, getUserProfile} from '@/reducers/exchange/action';
import {API_URL, CRYPTO_CURRENCY, CRYPTO_CURRENCY_DEFAULT} from "@/constants";
import {FIAT_CURRENCY} from "@/constants";

const nameFormCreditCard = 'creditCard'
const FormCreditCard = createForm({ propsReduxForm: { form: nameFormCreditCard,
    initialValues: { currency: CRYPTO_CURRENCY_DEFAULT } } });
const selectorFormCreditCard = formValueSelector(nameFormCreditCard)

const mainColor = '#259B24'

class FeedCreditCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: 0,
      currency: CRYPTO_CURRENCY_DEFAULT,
      isNewCCOpen: false,
      modalContent: '',
      showCCScheme: false,
    }
    this.getCryptoPriceByAmountThrottled = throttle(this.getCryptoPriceByAmount, 500);
  }

  componentDidMount() {
    this.props.getUserProfile({ BASE_URL: API_URL.EXCHANGE.BASE, PATH_URL: API_URL.EXCHANGE.GET_USER_PROFILE});
    this.props.getCcLimits({ BASE_URL: API_URL.EXCHANGE.BASE, PATH_URL: API_URL.EXCHANGE.GET_CC_LIMITS});
    this.props.getUserCcLimit({ BASE_URL: API_URL.EXCHANGE.BASE, PATH_URL: API_URL.EXCHANGE.GET_USER_CC_LIMIT});

    this.getCryptoPriceByAmount(0);

    this.intervalCountdown = setInterval(() => {
      this.getCryptoPriceByAmount(this.state.amount);
    }, 30000);
  }

  componentWillUnmount() {
    if (this.intervalClosePopup) {
      clearInterval(this.intervalClosePopup);
    }
  }

  getCryptoPriceByAmount = (amount) => {
    const cryptoCurrency = this.state.currency;

    var data = {amount: amount, currency: cryptoCurrency};

    this.props.getCryptoPrice({
      BASE_URL: API_URL.EXCHANGE.BASE,
      PATH_URL: API_URL.EXCHANGE.GET_CRYPTO_PRICE,
      qs: data,
      successFn: this.handleGetCryptoPriceSuccess,
      errorFn: this.handleGetCryptoPriceFailed,
      });
  }

  handleGetCryptoPriceSuccess = (data) => {
    // console.log('handleGetCryptoPriceSuccess', data);
    const {userCcLimit} = this.props;

    if (userCcLimit && userCcLimit.limit < userCcLimit.amount + data.fiat_amount) {
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
        fiat_amount: cryptoPrice.fiatAmount.trim(),
        fiat_currency: FIAT_CURRENCY,
        address: address,
        payment_method_data: params
      };
      // console.log('handleCreateCCOrder',paramsObj);
      this.props.createCCOrder({
        BASE_URL: API_URL.EXCHANGE.BASE,
        PATH_URL: API_URL.EXCHANGE.CREATE_CC_ORDER,
        data: paramsObj,
        METHOD: 'POST',
        successFn: this.handleCreateCCOrderSuccess,
        errorFn: this.handleCreateCCOrderFailed,
      });
    }
  }

  handleCreateCCOrderSuccess = (data) => {
    // console.log('handleCreateCCOrderSuccess', data);

    this.intervalClosePopup = setInterval(() => {
      this.modalRef.close();
      this.props.history.push(URL.HANDSHAKE_ME);
    }, 3000);

    this.setState({modalContent:
        (
          <div className="py-2">
            <Feed className="feed p-2" background="#259B24">
              <div className="text-white d-flex align-items-center" style={{ minHeight: '75px' }}>
                <div>Buy success</div>
              </div>
            </Feed>
            <Button block className="btn btn-secondary mt-2" onClick={this.handleBuySuccess}>Dismiss</Button>
          </div>
        )
    }, () => {
      this.modalRef.open();
    });
  }

  handleBuySuccess = () => {
    if (this.intervalCountdown) {
      clearInterval(this.intervalCountdown);
    }
    this.props.history.push(URL.HANDSHAKE_ME);
  }

  handleCreateCCOrderFailed = (e) => {
    // console.log('handleCreateCCOrderFailed', JSON.stringify(e.response));
    this.setState({modalContent:
        (
          <div className="py-2">
            <Feed className="feed p-2" background="#259B24">
              <div className="text-white d-flex align-items-center" style={{ minHeight: '75px' }}>
                <div>{e.response?.data?.message}</div>
              </div>
            </Feed>
            <Button block className="btn btn-secondary mt-2" onClick={this.handleBuyFailed}>Dismiss</Button>
          </div>
        )
    }, () => {
      this.modalRef.open();
    });
  }

  handleBuyFailed = () => {
    this.modalRef.close();
  }

  handleSubmit = (values) => {
    // console.log('handleSubmit', values);
    const {userProfile: {creditCard}} = this.props;

    let cc = {};

    //Use existing credit card
    if (creditCard.ccNumber.length > 0 && !this.state.isNewCCOpen) {
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
    this.getCryptoPriceByAmount(amount);
    this.setState({amount: amount}, () => {
      this.getCryptoPriceByAmountThrottled(amount);
    });
  }

  onCurrencyChange = (e, newValue) => {
    // console.log('onCurrencyChange', newValue);
    // const currency = e.target.textContent || e.target.innerText;
    this.setState({currency: newValue}, () => {
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
    const {intl, userProfile, cryptoPrice, amount, userCcLimit, ccLimits} = this.props;

    const fiatCurrency = '$';
    const total = cryptoPrice && cryptoPrice.fiatAmount;

    let modalContent = this.state.modalContent;

    const curLevel = userCcLimit ? userCcLimit.level : 1;
    return (
      <div>
        <div className='row'>
          <div className='col'>
            <div>
              <FormCreditCard onSubmit={this.handleSubmit} validate={this.handleValidate}>
                <Feed className="feed p-2 mb-2" background={mainColor}>
                  <div style={{ color: 'white' }}>
                    {
                      amount && (
                        <div>
                          {
                            ccLimits.map((ccLimit, index) => {
                              const { level, limit } = ccLimit
                              const isActive = curLevel === level
                              return (
                                <LevelItem key={index} style={{ marginLeft: index > 0 ? '8px' : '', opacity: isActive ? '' : 0.6 }}>
                                  <div>
                                  <span
                                    className='rounded-circle bg-white badge'
                                    style={{ color: mainColor, width: 18 }}
                                  >
                                    {level}
                                  </span>
                                  </div>
                                  <div><small>Can buy up to {fiatCurrency}{limit}</small></div>
                                </LevelItem>
                              )
                            })
                          }
                          <hr className="my-2" />
                        </div>
                      )
                    }
                    <div className="form-group pt-2 d-flex">
                      <label className="col-form-label"><FormattedMessage id="buy"/></label>
                      <div className="mx-2">
                        <Field
                          name="amount"
                          validate={[required]}
                          component={fieldInput}
                          className="form-control-custom form-control-custom-ex d-inline-block w-100"
                          placeholder={intl.formatMessage({id: 'amount'})}
                          onChange={this.onAmountChange}
                        />
                      </div>
                      <span className="d-inline-block ml-auto" style={{ width: '254px' }}>
                        <Field
                          name="currency"
                          component={fieldRadioButton}
                          list={CRYPTO_CURRENCY}
                          color={mainColor}
                          onChange={this.onCurrencyChange}
                        />
                      </span>
                    </div>
                    <div className="pb-2">
                      <span><FormattedMessage id="askUsingCreditCard" values={{ fiatCurrency: fiatCurrency, total: total }} /></span>
                    </div>
                    {
                      amount && (
                        <CreditCard
                          isCCExisting={userProfile && userProfile.creditCard.ccNumber.length > 0}
                          lastDigits={userProfile && userProfile.creditCard.ccNumber}
                          isNewCCOpen={this.state.isNewCCOpen}
                          handleToggleNewCC={this.handleToggleNewCC}
                        />
                      )
                    }
                  </div>
                </Feed>
                <Button block type="submit"><FormattedMessage id="shakeNow"/></Button>
              </FormCreditCard>
            </div>
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
  ccLimits: state.exchange.ccLimits || [],
  amount: selectorFormCreditCard(state, 'amount'),
  currency: selectorFormCreditCard(state, 'currency'),
});

const mapDispatchToProps = {
  getUserProfile,
  getCryptoPrice,
  createCCOrder,
  getUserCcLimit,
  getCcLimits,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(FeedCreditCard));
