import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import Feed from "@/components/core/presentation/Feed";
import Button from "@/components/core/controls/Button";
import axios from "axios";

import createForm from "@/components/core/form/createForm";
import {
  fieldCleave,
  fieldDropdown,
  fieldInput,
  fieldNumericInput,
  fieldPhoneInput,
  fieldRadioButton
} from "@/components/core/form/customField";
import { maxValue, minValue, required } from "@/components/core/form/validation";
import { change, Field, formValueSelector } from "redux-form";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { createOffer, getOfferPrice } from "@/reducers/exchange/action";
import {
  API_URL,
  CRYPTO_CURRENCY_LIST,
  CRYPTO_CURRENCY_DEFAULT,
  DEFAULT_FEE,
  EXCHANGE_ACTION,
  EXCHANGE_ACTION_DEFAULT,
  EXCHANGE_ACTION_LIST,
  EXCHANGE_ACTION_NAME,
  FIAT_CURRENCY,
  FIAT_CURRENCY_SYMBOL,
  SELL_PRICE_TYPE_DEFAULT
} from "@/constants";
import "../styles.scss";
import ModalDialog from "@/components/core/controls/ModalDialog/ModalDialog";
// import {MasterWallet} from '@/models/MasterWallet';
import getSymbolFromCurrency from "currency-symbol-map";
import { URL } from "@/config";
import { showAlert } from "@/reducers/app/action";
import { MasterWallet } from "@/models/MasterWallet";
import { ExchangeHandshake } from "@/services/neuron";
// import phoneCountryCodes from '@/components/core/form/country-calling-codes.min.json';
import COUNTRIES from "@/data/country-dial-codes.js";

import { CRYPTO_CURRENCY, MIN_AMOUNT } from "@/constants";
import _sample from "lodash/sample";
import { feedBackgroundColors } from "@/components/handshakes/exchange/config";
import { formatAmountCurrency, formatMoney } from "@/services/offer-util";
import { BigNumber } from "bignumber.js";
import { showLoading, hideLoading } from "@/reducers/app/action";

const nameFormExchangeCreate = "exchangeCreate";
const FormExchangeCreate = createForm({
  propsReduxForm: {
    form: nameFormExchangeCreate,
    initialValues: {
      type: EXCHANGE_ACTION_DEFAULT,
      currency: CRYPTO_CURRENCY_DEFAULT,
      sellPriceType: SELL_PRICE_TYPE_DEFAULT,
      customizePrice: 0
    }
  }
});
const selectorFormExchangeCreate = formValueSelector(nameFormExchangeCreate);

import iconLock from "@/assets/images/icon/lock.png";
import iconUnlock from "@/assets/images/icon/unlock.png";

const textColor = "#ffffff";
const btnBg = "rgba(29,29,38,0.30)";
const validateFee = [
  minValue(-50),
  maxValue(50)
];
const minValue01 = minValue(0.1);
const minValue001 = minValue(0.01);

class Component extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalContent: "",
      currency: CRYPTO_CURRENCY_DEFAULT,
      type: "buy",
      lat: 0,
      lng: 0
    };
    // this.mainColor = _sample(feedBackgroundColors)
    this.mainColor = "#1F2B34";
  }

  setAddressFromLatLng = (lat, lng) => {
    this.setState({lat: lat, lng: lng});
    const { rfChange } = this.props;
    axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&sensor=true`).then((response) => {
      const address = response.data.results[0] && response.data.results[0].formatted_address;
      rfChange(nameFormExchangeCreate, 'address', address);
    });
  }

  componentDidMount() {
    const { ipInfo, rfChange, authProfile } = this.props;
    navigator.geolocation.getCurrentPosition((location) => {
      const { coords: { latitude, longitude } } = location
      this.setAddressFromLatLng(latitude, longitude) // better precision
    }, () => {
      this.setAddressFromLatLng(ipInfo.latitude, ipInfo.longitude) // fallback
    });

    // auto fill phone number from user profile
    let detectedCountryCode = ''
    const foundCountryPhone = COUNTRIES.find(i => i.code.toUpperCase() === ipInfo.country_code.toUpperCase())
    if (foundCountryPhone) {
      detectedCountryCode = foundCountryPhone.dialCode
    }
    rfChange(nameFormExchangeCreate, 'phone', authProfile.phone || `${detectedCountryCode}-`)
  }

  render() {
    const { totalAmount, type, sellPriceType, offerPrice, ipInfo } = this.props;
    const modalContent = this.state.modalContent;
    const currency = "ETH";
    const hasFilled1Coin = true;
    return (
      <div>
        <FormExchangeCreate onSubmit={this.handleSubmit}>
          <Feed className="feed my-2 p-0" background={this.mainColor}>
            <div style={{ color: "white", padding: "20px" }}>
              <div className="d-flex mb-4">
                <div className='input-group'>
                  <Field
                    name="type"
                    // containerClass="radio-container-old"
                    component={fieldRadioButton}
                    type="tab"
                    list={EXCHANGE_ACTION_LIST}
                    color={textColor}
                    validate={[required]}
                    onChange={this.onTypeChange}
                  />
                </div>
              </div>

              <div className="d-flex">
                <label className="col-form-label mr-auto label-create">Amount buy</label>
                <div className='input-group'>
                  <Field
                    name="amountBuy"
                    className="form-control-custom form-control-custom-ex w-100 input-no-border"
                    component={fieldInput}
                    placeholder={MIN_AMOUNT[currency]}
                    // onChange={this.onAmountChange}
                    validate={[required, currency === CRYPTO_CURRENCY.BTC ? minValue001 : minValue01]}
                  />
                </div>
              </div>

              <hr className="hrLine"/>

              <div className="d-flex">
                <label className="col-form-label mr-auto label-create">Amount sell</label>
                <div className='input-group'>
                  <Field
                    name="amountSell"
                    className="form-control-custom form-control-custom-ex w-100 input-no-border"
                    component={fieldInput}
                    placeholder={MIN_AMOUNT[currency]}
                    // onChange={this.onAmountChange}
                    validate={[required, currency === CRYPTO_CURRENCY.BTC ? minValue001 : minValue01]}
                  />
                </div>
              </div>

              <hr className="hrLine"/>

              <div className="d-flex py-1">
                <label className="col-form-label mr-auto label-create">Customize price buy</label>
                <div className='input-group align-items-center'>
                  <Field
                    name="customizePriceBuy"
                    // className='form-control-custom form-control-custom-ex w-100'
                    component={fieldNumericInput}
                    btnBg={btnBg}
                    suffix={"%"}
                    color={textColor}
                    validate={validateFee}
                  />
                </div>
              </div>

              <hr className="hrLine"/>

              <div className="d-flex py-1">
                <label className="col-form-label mr-auto label-create">Customize price sell</label>
                <div className='input-group align-items-center'>
                  <Field
                    name="customizePriceSell"
                    // className='form-control-custom form-control-custom-ex w-100'
                    component={fieldNumericInput}
                    btnBg={btnBg}
                    suffix={"%"}
                    color={textColor}
                    validate={validateFee}
                  />
                </div>
              </div>

              {
                hasFilled1Coin && (
                  <div>
                    <hr className="hrLine"/>

                    <div className="d-flex">
                      <label className="col-form-label mr-auto label-create">Name shop</label>
                      <div className='input-group'>
                        <Field
                          name="nameShop"
                          className="form-control-custom form-control-custom-ex w-100 input-no-border"
                          component={fieldInput}
                          placeholder={'Apple store'}
                          // onChange={this.onAmountChange}
                          validate={[required]}
                        />
                      </div>
                    </div>

                    <hr className="hrLine"/>

                    <div className="d-flex mt-2">
                      <label className="col-form-label mr-auto label-create">Phone</label>
                      <div className="input-group w-100">
                        <Field
                          name="phone"
                          className="form-control-custom form-control-custom-ex w-100 input-no-border"
                          component={fieldPhoneInput}
                          type="tel"
                          placeholder="4995926433"
                          // validate={[required, currency === 'BTC' ? minValue001 : minValue01]}
                        />
                      </div>
                    </div>
                    <hr className="hrLine"/>

                    <div className="d-flex mt-2">
                      <label className="col-form-label mr-auto label-create">Address*</label>
                      <div className="w-100">
                        <Field
                          name="address"
                          className="form-control-custom form-control-custom-ex w-100 input-no-border"
                          component={fieldInput}
                          validate={[required]}
                          placeholder="81 E. Augusta Ave. Salinas"
                        />
                      </div>
                    </div>
                  </div>
                )
              }

            </div>
          </Feed>
          <Button block type="submit">Initiate</Button>
        </FormExchangeCreate>
        <ModalDialog onRef={modal => this.modalRef = modal}>
          {modalContent}
        </ModalDialog>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const type = selectorFormExchangeCreate(state, "type");
  const currency = selectorFormExchangeCreate(state, "currency");
  const sellPriceType = selectorFormExchangeCreate(state, "sellPriceType");
  const amount = selectorFormExchangeCreate(state, "amount") || 0;
  const customizePrice = selectorFormExchangeCreate(state, "customizePrice") || 0;

  const offerPrice = state.exchange.offerPrice;
  let totalAmount = amount * (offerPrice && offerPrice.price || 0) || 0;
  totalAmount += totalAmount * customizePrice / 100;

  const price = offerPrice && offerPrice.price || 0;

  return {
    amount, currency, totalAmount, type, sellPriceType, price,
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
  rfChange: bindActionCreators(change, dispatch),
  showLoading: bindActionCreators(showLoading, dispatch),
  hideLoading: bindActionCreators(hideLoading, dispatch)
});


export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Component));
