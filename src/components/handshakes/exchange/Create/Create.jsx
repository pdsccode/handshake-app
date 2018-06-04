import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import { change, Field, formValueSelector } from 'redux-form';
import { injectIntl } from 'react-intl';
import getSymbolFromCurrency from 'currency-symbol-map';
import { BigNumber } from 'bignumber.js';

import ModalDialog from '@/components/core/controls/ModalDialog/ModalDialog';
import { maxValue, minValue, required } from '@/components/core/form/validation';
import { showAlert } from '@/reducers/app/action';
import { createOffer, getOfferPrice } from '@/reducers/exchange/action';
import Feed from '@/components/core/presentation/Feed';
import Button from '@/components/core/controls/Button';
import createForm from '@/components/core/form/createForm';
import {
  fieldInput,
  fieldNumericInput,
  fieldPhoneInput,
  fieldRadioButton,
} from '@/components/core/form/customField';
import {
  API_URL,
  CRYPTO_CURRENCY,
  CRYPTO_CURRENCY_DEFAULT,
  EXCHANGE_ACTION,
  EXCHANGE_ACTION_DEFAULT,
  FIAT_CURRENCY_SYMBOL,
  PRICE_DECIMAL,
  SELL_PRICE_TYPE,
  SELL_PRICE_TYPE_DEFAULT,
  DEFAULT_FEE,
} from '@/constants';
import { URL } from '@/config';
import '../styles.scss';

const nameFormExchangeCreate = 'exchangeCreate';
const FormExchangeCreate = createForm({
  propsReduxForm: {
    form: nameFormExchangeCreate,
    initialValues: {
      type: EXCHANGE_ACTION_DEFAULT,
      currency: CRYPTO_CURRENCY_DEFAULT,
      sellPriceType: SELL_PRICE_TYPE_DEFAULT,
      customizePrice: 0,
    },
  },
});
const selectorFormExchangeCreate = formValueSelector(nameFormExchangeCreate);

const mainColor = '#007AFF';
const validateFee = [
  minValue(-50),
  maxValue(50),
];
const minValue01 = minValue(0.1);
const minValue001 = minValue(0.01);

class Component extends React.Component {
  static propTypes = {
    profile: PropTypes.object.isRequired,
    ipInfo: PropTypes.object.isRequired,
    wallet: PropTypes.object.isRequired,
    createOffer: PropTypes.func.isRequired,
    getOfferPrice: PropTypes.func.isRequired,
    showAlert: PropTypes.func.isRequired,
    rfChange: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      modalContent: '',
      currency: CRYPTO_CURRENCY_DEFAULT,
      type: 'buy',
      lat: 0,
      lng: 0,
      wallet: this.props.wallet,
    };
  }

  async componentDidMount() {
    const { ipInfo, rfChange, profile } = this.props;
    navigator.geolocation.getCurrentPosition((location) => {
      const { coords: { latitude, longitude } } = location;
      this.setAddressFromLatLng(latitude, longitude);
    }, () => {
      this.setAddressFromLatLng(ipInfo.latitude, ipInfo.longitude);
    });

    rfChange(nameFormExchangeCreate, 'phone', profile.phone || '');

    this.getCryptoPriceByAmount(0);
    this.intervalCountdown = setInterval(() => {
      const { amount } = this.props;
      this.getCryptoPriceByAmount(amount);
    }, 5 * 60000);
  }

  onAmountChange = (e) => {
    const amount = e.target.value;
    console.log('onAmountChange', amount);
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

  getCryptoPriceByAmount = (amount) => {
    const { type, currency } = this.state;
    const { ipInfo: { currency: fiatCurrency } } = this.props;

    const data = {
      amount,
      currency,
      type,
      fiat_currency: fiatCurrency,
    };

    this.props.getOfferPrice({
      BASE_URL: API_URL.EXCHANGE.BASE,
      PATH_URL: API_URL.EXCHANGE.GET_OFFER_PRICE,
      qs: data,
    });
  }

  setAddressFromLatLng = (lat, lng) => {
    this.setState({ lat, lng });
    const { rfChange } = this.props;
    axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&sensor=true`).then((response) => {
      const address = response.data.results[0] && response.data.results[0].formatted_address;
      rfChange(nameFormExchangeCreate, 'address', address);
    });
  }

  handleSubmit = async (values) => {
    const { intl, totalAmount, price } = this.props;
    const { ipInfo: { currency: fiatCurrency } } = this.props;

    const wallet = this.state.wallet.powerful.defaultWallet(values.currency);
    const balance = await wallet.action.getBalance();

    if (values.type === 'sell' && balance < values.amount + DEFAULT_FEE[values.currency]) {
      this.props.showAlert({
        message: (
          <div className="text-center">
            {intl.formatMessage({ id: 'notEnoughCoinInWallet' }, {
              amount: new BigNumber(values.amount).toFormat(6),
              currency: values.currency,
            })}
          </div>
        ),
        timeOut: 3000,
        type: 'danger',
        callBack: () => {
        },
      });

      return;
    }

    const { address } = wallet;

    const rewardWallet = this.state.wallet.powerful.rewardWallet(values.currency);
    const rewardAddress = rewardWallet.address;
    const percentage = values.type === 'sell' && values.sellPriceType === 'flexible'
      ? values.customizePrice.toString()
      : '0';

    const offer = {
      amount: values.amount,
      price,
      percentage,
      currency: values.currency,
      type: values.type,
      contact_info: values.address,
      contact_phone: values.phone,
      fiat_currency: fiatCurrency,
      latitude: this.state.lat,
      longitude: this.state.lng,
    };

    if (values.type === 'buy') {
      offer.user_address = address;
    } else {
      offer.refund_address = address;
    }

    offer.reward_address = rewardAddress;

    console.log('handleSubmit', offer);
    const message = intl.formatMessage({ id: 'createOfferConfirm' }, {
      type: values.type === 'buy' ? 'Buy' : 'Sell',
      amount: new BigNumber(values.amount).toFormat(6),
      currency: values.currency,
      currency_symbol: getSymbolFromCurrency(fiatCurrency),
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

    this.props.createOffer({
      BASE_URL: API_URL.EXCHANGE.BASE,
      PATH_URL: API_URL.EXCHANGE.OFFERS,
      data: offer,
      METHOD: 'POST',
      successFn: this.handleCreateOfferSuccess,
      errorFn: this.handleCreateOfferFailed,
    });
  }

  handleCreateOfferSuccess = async (responseData) => {
    const { data } = responseData;
    const { currency } = data;

    let wallet = this.wallet.powerful.defaultWallet(currency);

    console.log('data', data);
    console.log('wallet', wallet);

    if (currency === 'BTC') {
      wallet.action.transfer(data.system_address, data.amount).then((success) => {
        console.log('transfer', success);
      });
    } else if (currency === 'ETH') {
      wallet = wallet.action.handshake('exchange');
      let result = null;
      if (data.type === 'buy') {
        result = await wallet.action.init(wallet.address, wallet.address, data.amount, data.id);
      } else {
        result = await wallet.action.initByCoinOwner(wallet.address, wallet.address, data.amount, data.id);
      }

      console.log('handleCreateOfferSuccess', result);
    }
  }

  handleCreateOfferFailed = (e) => {
    this.props.showAlert({
      message: (
        <div className="text-center">{e.response?.data?.message}</div>
      ),
      timeOut: 3000,
      type: 'danger',
    });
  }

  render() {
    const {
      totalAmount, type, sellPriceType, offerPrice, currency,
    } = this.props;

    const { modalContent } = this.state;

    return (
      <div>
        <FormExchangeCreate onSubmit={this.handleSubmit}>
          <Feed className="feed p-2 my-2" background={mainColor}>
            <div style={{ color: 'white' }}>
              <div className="d-flex mb-2">
                <span className="col-form-label mr-auto" style={{ width: '120px' }}>I want to</span>
                <div className="input-group">
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
                <span className="col-form-label mr-auto" style={{ width: '120px' }}>Coin</span>
                <div className="input-group">
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
                <span className="col-form-label mr-auto" style={{ width: '120px' }}>Amount*</span>
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
                <span className="col-form-label mr-auto" style={{ width: '120px' }}>
                  Price ({FIAT_CURRENCY_SYMBOL})*
                </span>
                <span className="w-100 col-form-label">{new BigNumber(offerPrice ? offerPrice.price : 0).toFormat(PRICE_DECIMAL)}</span>
              </div>
              <div className="d-flex mt-2">
                <div className="input-group justify-content-end">
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
                <span className="col-form-label mr-auto" style={{ width: '120px' }}>
                  Customize price (%)
                </span>
                <div className="input-group align-items-center">
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
                <span className="col-form-label mr-auto" style={{ width: '120px' }}>
                  Total ({FIAT_CURRENCY_SYMBOL})
                </span>
                <span className="w-100 col-form-label">{new BigNumber(totalAmount).toFormat(PRICE_DECIMAL)}</span>
              </div>
              <div className="d-flex">
                <span className="col-form-label mr-auto" style={{ width: '120px' }}>Phone</span>
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
                <span className="col-form-label mr-auto" style={{ width: '120px' }}>Address*</span>
                <div className="w-100">
                  <Field
                    autoComplete="street-address"
                    name="address"
                    className="form-control-custom form-control-custom-ex w-100"
                    component={fieldInput}
                    validate={[required]}
                  />
                </div>
              </div>
            </div>
          </Feed>
          <Button block type="submit">Sign &amp; send</Button>
        </FormExchangeCreate>
        <ModalDialog onRef={(modal) => { this.modalRef = modal; return null; }}>
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

  const { offerPrice } = state.exchange;
  let totalAmount = amount * ((offerPrice && offerPrice.price) || 0) || 0;
  totalAmount += (totalAmount * customizePrice) / 100;

  const price = (offerPrice && offerPrice.price) || 0;

  return {
    amount,
    currency,
    totalAmount,
    type,
    sellPriceType,
    price,
    offerPrice,
    ipInfo: state.app.ipInfo,
    profile: state.auth.profile,
    wallet: state.wallet,
  };
};

const mapDispatchToProps = ({
  createOffer,
  getOfferPrice,
  showAlert,
  rfChange: change,
});


export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Component));
