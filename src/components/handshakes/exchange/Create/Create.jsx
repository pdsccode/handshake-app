import React from 'react';
import {FormattedMessage, injectIntl} from 'react-intl';
import Feed from '@/components/core/presentation/Feed';
import Button from '@/components/core/controls/Button';
import axios from 'axios';

import createForm from '@/components/core/form/createForm';
import {
  fieldCleave,
  fieldDropdown,
  fieldInput,
  fieldNumericInput,
  fieldPhoneInput,
  fieldRadioButton
} from '@/components/core/form/customField';
import {maxValue, minValue, required} from '@/components/core/form/validation';
import {change, Field, formValueSelector} from 'redux-form';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {createOffer, getOfferPrice} from '@/reducers/exchange/action';
import {
  API_URL,
  CRYPTO_CURRENCY,
  CRYPTO_CURRENCY_DEFAULT,
  EXCHANGE_ACTION,
  EXCHANGE_ACTION_DEFAULT,
  FIAT_CURRENCY,
  FIAT_CURRENCY_SYMBOL,
  PRICE_DECIMAL,
  SELL_PRICE_TYPE,
  SELL_PRICE_TYPE_DEFAULT
} from '@/constants';
import '../styles.scss';
import ModalDialog from '@/components/core/controls/ModalDialog/ModalDialog';
import {BigNumber} from 'bignumber.js';
// import {MasterWallet} from '@/models/MasterWallet';
import getSymbolFromCurrency from 'currency-symbol-map';
import {URL} from '@/config';
import {showAlert} from '@/reducers/app/action';
import {MasterWallet} from "@/models/MasterWallet";
import {DEFAULT_FEE} from "@/constants";

const nameFormExchangeCreate = 'exchangeCreate';
const FormExchangeCreate = createForm({
  propsReduxForm: {
    form: nameFormExchangeCreate,
    initialValues: { type: EXCHANGE_ACTION_DEFAULT, currency: CRYPTO_CURRENCY_DEFAULT, sellPriceType: SELL_PRICE_TYPE_DEFAULT, customizePrice: 0 },
  },
});
const selectorFormExchangeCreate = formValueSelector(nameFormExchangeCreate);

const mainColor = '#007AFF'
const validateFee = [
  minValue(-50),
  maxValue(50),
]
const minValue01 = minValue(0.1)
const minValue001 = minValue(0.01)

class Component extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalContent: '',
      currency: CRYPTO_CURRENCY_DEFAULT,
      type: 'buy',
      lat: 0,
      lng: 0
    };
  }

  setAddressFromLatLng = (lat, lng) => {
    this.setState({lat: lat, lng: lng});
    const { rfChange } = this.props;
    axios.get(`http://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&sensor=true`).then((response) => {
      const address = response.data.results[0] && response.data.results[0].formatted_address;
      rfChange(nameFormExchangeCreate, 'address', address);
    });
  }

  async componentDidMount() {
    const { ipInfo, rfChange, authProfile } = this.props
    navigator.geolocation.getCurrentPosition((location) => {
      const { coords: { latitude, longitude } } = location
      this.setAddressFromLatLng(latitude, longitude) // better precision
    }, () => {
      this.setAddressFromLatLng(ipInfo.latitude, ipInfo.longitude) // fallback
    });

    // auto fill phone number from user profile
    rfChange(nameFormExchangeCreate, 'phone', authProfile.phone || '')

    this.getCryptoPriceByAmount(0);
    this.intervalCountdown = setInterval(() => {
      const { amount } = this.props;
      this.getCryptoPriceByAmount(amount);
    }, 5 * 60000);

    // const ipInfo = await axios.get(`https://ipfind.co/me`, {
    //   params: {
    //     auth: 'a59f33e5-0879-411a-908b-792359a0d6cc',
    //   },
    // });

    // this.setState({ ipInfo: ipInfo.data });
  }

  getCryptoPriceByAmount = (amount) => {
    const { type, currency } = this.state;
    const {ipInfo: {currency: fiat_currency}} = this.props;

    let data = {
      amount,
      currency: currency,
      type,
      fiat_currency,
    };

    this.props.getOfferPrice({
      BASE_URL: API_URL.EXCHANGE.BASE,
      PATH_URL: API_URL.EXCHANGE.GET_OFFER_PRICE,
      qs: data,
    });
  }

  onAmountChange = (e) => {
    const amount = e.target.value;
    console.log('onAmountChange', amount);
    // this.getCryptoPriceByAmount(amount);
    // this.setState({amount: amount}, () => {
    //   this.getCryptoPriceByAmountThrottled(amount);
    // });
  }

  onTypeChange = (e, newValue) => {
    const { amount } = this.props;

    this.setState({ type: newValue }, () => {
      this.getCryptoPriceByAmount(amount);
    });
  }

  onSellPriceTypeChange = (e, newValue) => {
    const { amount } = this.props;
    // this.setState({currency: newValue}, () => {
    this.getCryptoPriceByAmount(amount);
    // });
  }

  onCurrencyChange = (e, newValue) => {
    // console.log('onCurrencyChange', newValue);
    // const currency = e.target.textContent || e.target.innerText;
    const { amount } = this.props;
    this.setState({ currency: newValue }, () => {
      this.getCryptoPriceByAmount(amount);
    });
  }

  handleSubmit = (values) => {
    const { intl, totalAmount, price } = this.props;
    // const fiat_currency = this.state.ipInfo.currency;
    const {ipInfo: {currency: fiat_currency}} = this.props;
    // console.log('valuessss', values);

    const wallet = MasterWallet.getWalletDefault(values.currency);

    if (values.type === 'sell' && wallet.balance < values.amount + DEFAULT_FEE[values.currency]) {
      this.props.showAlert({
        message: <div className="text-center">
          {intl.formatMessage({ id: 'notEnoughCoinInWallet' }, {
            amount: new BigNumber(values.amount).toFormat(6),
            currency: values.currency,
          })}
          </div>,
        timeOut: 3000,
        type: 'danger',
        callBack: () => {
        }
      });

      return;
    }

    const address = wallet.address;
    const reward_address = address;

    const offer = {
      amount: values.amount,
      price: price,
      percentage: values.type === 'sell' && values.sellPriceType === 'flexible' ? values.customizePrice.toString() : '0',
      currency: values.currency,
      type: values.type,
      contact_info: values.address,
      contact_phone: values.phone,
      fiat_currency: fiat_currency,
      latitude: this.state.lat,
      longitude: this.state.lng
    };

    if (values.type === 'buy') {
      offer.user_address = address;
    } else {
      offer.refund_address = address;
    }

    offer.reward_address = reward_address;

    console.log('handleSubmit', offer);
    const message = intl.formatMessage({ id: 'createOfferConfirm' }, {
      type: values.type === 'buy' ? 'Buy' : 'Sell',
      amount: new BigNumber(values.amount).toFormat(6),
      currency: values.currency,
      currency_symbol: getSymbolFromCurrency(fiat_currency),
      total: new BigNumber(totalAmount).toFormat(2),
    });

    this.setState({
      modalContent:
        (
          <div className="py-2">
            <Feed className="feed p-2" background="#259B24">
              <div className="text-white d-flex align-items-center" style={{ minHeight: '50px' }}>
                <div>{message}</div>
              </div>
            </Feed>
            <Button className="mt-2" block onClick={() => this.createOffer(offer)}>Confirm</Button>
            <Button block className="btn btn-secondary" onClick={this.cancelCreateOffer}>Not now</Button>
          </div>
        ),
    }, () => {
      this.modalRef.open();
    });
  }

  cancelCreateOffer = () => {
    this.modalRef.close();
  }

  createOffer = (offer) => {
    this.modalRef.close();
    console.log('createOffer', offer);
    const { currency } = this.props;

    // if (currency === 'BTC') {
      this.props.createOffer({
        BASE_URL: API_URL.EXCHANGE.BASE,
        PATH_URL: API_URL.EXCHANGE.OFFERS,
        data: offer,
        METHOD: 'POST',
        successFn: this.handleCreateOfferSuccess,
        errorFn: this.handleCreateOfferFailed,
      });
    // } else {
    //
    // }
  }

  handleCreateOfferSuccess = (data) => {
    // this.props.history.push(URL.HANDSHAKE_ME);

    this.props.showAlert({
      message: <div className="text-center"><FormattedMessage id="createOfferSuccessMessage"/></div>,
      timeOut: 3000,
      type: 'danger',
      callBack: () => {
        this.props.history.push(URL.HANDSHAKE_ME);
      }
    });

    // this.timeoutClosePopup = setTimeout(() => {
    //   this.handleBuySuccess();
    // }, 3000);
    //
    // console.log('handleCreateCCOrderSuccess', data);
    // this.setState({
    //   modalContent:
    //   (
    //     <div className="py-2">
    //       <Feed className="feed p-2" background="#259B24">
    //         <div className="text-white d-flex align-items-center" style={{ minHeight: '75px' }}>
    //           <div>Create offer success</div>
    //         </div>
    //       </Feed>
    //       <Button block className="btn btn-secondary mt-2" onClick={this.handleBuySuccess}>Dismiss</Button>
    //     </div>
    //   ),
    // }, () => {
    //   this.modalRef.open();
    // });
  }

  // handleBuySuccess = () => {
  //   if (this.timeoutClosePopup) {
  //     clearTimeout(this.timeoutClosePopup);
  //   }
  //   this.modalRef.close();
  //   this.props.history.push(URL.HANDSHAKE_ME);
  // }

  handleCreateOfferFailed = (e) => {
    this.props.showAlert({
      message: <div className="text-center">{e.response?.data?.message}</div>,
      timeOut: 3000,
      type: 'danger',
    });
    // console.log('handleCreateCCOrderFailed', JSON.stringify(e.response));
    // this.setState({
    //   modalContent:
    //     (
    //       <div className="py-2">
    //         <Feed className="feed p-2" background="#259B24">
    //           <div className="text-white d-flex align-items-center" style={{ minHeight: '75px' }}>
    //             <div>Create offer failed</div>
    //           </div>
    //         </Feed>
    //         <Button block className="btn btn-secondary mt-2" onClick={this.handleBuyFailed}>Dismiss</Button>
    //       </div>
    //     ),
    // }, () => {
    //   this.modalRef.open();
    // });
  }

  // handleBuyFailed = () => {
  //   this.modalRef.close();
  // }

  render() {
    const { totalAmount, type, sellPriceType, offerPrice, currency } = this.props;

    const modalContent = this.state.modalContent;

    return (
      <div>
        <FormExchangeCreate onSubmit={this.handleSubmit}>
          <Feed className="feed p-2 my-2" background={mainColor}>
            <div style={{ color: 'white' }}>
              <div className="d-flex mb-2">
                <label className="col-form-label mr-auto" style={{ width: '120px' }}>I want to</label>
                <div className='input-group'>
                  <Field
                    name="type"
                    component={fieldRadioButton}
                    list={EXCHANGE_ACTION}
                    color={mainColor}
                    validate={[required]}
                    onChange={this.onTypeChange}
                  />
                </div>
              </div>
              <div className="d-flex">
                <label className="col-form-label mr-auto" style={{ width: '120px' }}>Coin</label>
                <div className='input-group'>
                  <Field
                    name="currency"
                    component={fieldRadioButton}
                    list={CRYPTO_CURRENCY}
                    color={mainColor}
                    validate={[required]}
                    onChange={this.onCurrencyChange}
                  />
                </div>
              </div>
              <div className="d-flex mt-2">
                <label className="col-form-label mr-auto" style={{ width: '120px' }}>Amount*</label>
                <div className="w-100">
                  <Field
                    name="amount"
                    className="form-control-custom form-control-custom-ex w-100"
                    component={fieldInput}
                    onChange={this.onAmountChange}
                    validate={[required, currency === 'BTC' ? minValue001 : minValue01]}
                  />
                </div>
              </div>
              <div className="d-flex">
                <label className="col-form-label mr-auto" style={{ width: '120px' }}>Price ({FIAT_CURRENCY_SYMBOL})*</label>
                <span className="w-100 col-form-label">{new BigNumber(offerPrice ? offerPrice.price : 0).toFormat(PRICE_DECIMAL)}</span>
              </div>
              <div className="d-flex mt-2">
                {/*<label className="col-form-label mr-auto" style={{ width: '120px' }} />*/}
                <div className='input-group justify-content-end'>
                  <Field
                    name="sellPriceType"
                    component={fieldRadioButton}
                    list={SELL_PRICE_TYPE}
                    color={mainColor}
                    validate={[required]}
                    onChange={this.onSellPriceTypeChange}
                  />
                </div>
              </div>
              <div className="d-flex mt-2">
                <label className="col-form-label mr-auto" style={{ width: '120px' }}>Customize price (%)</label>
                <div className='input-group align-items-center'>
                  <Field
                    name="customizePrice"
                    // className='form-control-custom form-control-custom-ex w-100'
                    component={fieldNumericInput}
                    color={mainColor}
                    validate={validateFee}
                  />
                </div>
              </div>
              <div className="d-flex">
                <label className="col-form-label mr-auto" style={{ width: '120px' }}>Total ({FIAT_CURRENCY_SYMBOL})</label>
                <span className="w-100 col-form-label">{new BigNumber(totalAmount).toFormat(PRICE_DECIMAL)}</span>
              </div>
              <div className="d-flex">
                <label className="col-form-label mr-auto" style={{ width: '120px' }}>Phone</label>
                <div className="input-group w-100">
                  <Field
                    name="phone"
                    className="form-control-custom form-control-custom-ex w-100"
                    component={fieldPhoneInput}
                    type="tel"
                    placeholder="+74995926433"
                    // validate={[required, currency === 'BTC' ? minValue001 : minValue01]}
                  />
                </div>
              </div>
              <div className="d-flex mt-2">
                <label className="col-form-label mr-auto" style={{ width: '120px' }}>Address*</label>
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
        <ModalDialog onRef={modal => this.modalRef = modal}>
          {modalContent}
        </ModalDialog>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const type = selectorFormExchangeCreate(state, 'type');
  const currency = selectorFormExchangeCreate(state, 'currency');
  const sellPriceType = selectorFormExchangeCreate(state, 'sellPriceType');
  const amount = selectorFormExchangeCreate(state, 'amount') || 0;
  const customizePrice = selectorFormExchangeCreate(state, 'customizePrice') || 0;

  const offerPrice = state.exchange.offerPrice;
  let totalAmount =  amount * (offerPrice && offerPrice.price || 0) || 0;
  totalAmount += totalAmount * customizePrice / 100;

  const price = offerPrice && offerPrice.price || 0;

  return { amount, currency, totalAmount, type, sellPriceType, price,
    offerPrice: offerPrice,
    ipInfo: state.app.ipInfo,
    authProfile: state.auth.profile
  };
};

// this.props.showAlert({
//   message: <p className="text-center">aaaaaaaa</p>,
//   timeOut: 10000000,
//   type: 'danger',
// });

const mapDispatchToProps = (dispatch) => ({
  createOffer: bindActionCreators(createOffer, dispatch),
  getOfferPrice: bindActionCreators(getOfferPrice, dispatch),
  showAlert: bindActionCreators(showAlert, dispatch),
  rfChange: bindActionCreators(change, dispatch)
});


export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Component));
