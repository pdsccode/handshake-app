import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import Button from '@/components/core/controls/Button';
import './CreateStoreATM.scss';
import createForm from '@/components/core/form/createForm';
import { formatMoneyByLocale, getOfferPrice } from '@/services/offer-util';
import { fieldDropdown, fieldInput, fieldPhoneInput, fieldRadioButton } from '@/components/core/form/customField';
import { maxValue, minValue, required, requiredPhone } from '@/components/core/form/validation';
import { change, clearFields, Field, formValueSelector } from 'redux-form';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import {MasterWallet} from '@/services/Wallets/MasterWallet';
import {
  API_URL,
  CRYPTO_CURRENCY,
  CRYPTO_CURRENCY_COLORS,
  CRYPTO_CURRENCY_DEFAULT,
  CRYPTO_CURRENCY_NAME,
  EXCHANGE_ACTION,
  FIAT_CURRENCY_LIST,
} from '@/constants';

import { validate } from './validation';
import '../styles.scss';
import ModalDialog from '@/components/core/controls/ModalDialog/ModalDialog';
import { hideLoading, showAlert, showLoading, showPopupGetGPSPermission } from '@/reducers/app/action';
// import phoneCountryCodes from '@/components/core/form/country-calling-codes.min.json';
import { createStoreATM, getStoreATM, updateStoreATM } from '@/reducers/exchange/action';
import { getErrorMessageFromCode } from '@/components/handshakes/exchange/utils';
import axios from 'axios';

const nameFormExchangeCreate = 'exchangeCreate';
const FormExchangeCreate = createForm({
  propsReduxForm: {
    form: nameFormExchangeCreate,
    initialValues: {
      currency: CRYPTO_CURRENCY_DEFAULT,
      customizePriceBuy: -0.25,
      customizePriceSell: 0.25,
    },
  },
});
const selectorFormExchangeCreate = formValueSelector(nameFormExchangeCreate);

const textColor = '#000000';
const btnBg = 'rgba(29,29,38,0.30)';
const validateFee = [
  minValue(-50),
  maxValue(50),
];

class Component extends React.Component {
  static propTypes = {
    // setLoading: PropTypes.func.isRequired,
  };

  CRYPTO_CURRENCY_LIST = Object.values(CRYPTO_CURRENCY).map(item => ({ value: item, text: <div className="currency-selector"><img src={CRYPTO_CURRENCY_COLORS[item].icon} /> <span>{CRYPTO_CURRENCY_NAME[item]}</span></div>, hide: false }));

  constructor(props) {
    super(props);

    const isUpdate = false;

    this.state = {
      modalContent: '',
      currency: CRYPTO_CURRENCY_DEFAULT,
      lat: 0,
      lng: 0,
      isUpdate,
      enableAction: true,
      buyBalance: 0,
      sellBalance: 0,
      modalFillContent: '',
    };
  }

  setAddressFromLatLng = (lat, lng, addressDefault) => {
    this.setState({ lat, lng });
    const { rfChange } = this.props;
    if (addressDefault) {
      setTimeout(() => {
        rfChange(nameFormExchangeCreate, 'address', addressDefault);
      }, 0);
    } else {
      axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&sensor=true`).then((response) => {
        const address = response.data.results[0] && response.data.results[0].formatted_address;
        rfChange(nameFormExchangeCreate, 'address', address);
      });
    }
  }

  componentDidMount() {
    const {
      ipInfo, rfChange, authProfile, freeStartInfo, isChooseFreeStart, getUserLocation,
    } = this.props;
    this.setAddressFromLatLng(ipInfo?.latitude, ipInfo?.longitude, ipInfo?.addressDefault);

    // show popup to get GPS permission
    this.props.showPopupGetGPSPermission();

    this.getStoreATM();
  }

  getStoreATM() {
    this.props.getStoreATM({
      PATH_URL: `${API_URL.EXCHANGE.CASH_STORE_ATM}`,
      successFn: this.handleGetOfferStoresSuccess,
      errorFn: this.handleGetOfferStoresFailed,
    });
  }

  showLoading = () => {
    // this.props.setLoading(true);
    this.props.showLoading();
  }

  hideLoading = () => {
    // this.props.setLoading(false);
    this.props.hideLoading();
  }

  showAlert = (message) => {
    this.props.showAlert({
      message: <div className="text-center">
        {message}
      </div>,
      timeOut: 5000,
      type: 'danger',
      callBack: () => {
      },
    });
  }

  resetFormValue = () => {
    const { rfChange, clearFields } = this.props;
    rfChange(nameFormExchangeCreate, 'currency', CRYPTO_CURRENCY_DEFAULT);
    rfChange(nameFormExchangeCreate, 'customizePriceBuy', -0.25);
    rfChange(nameFormExchangeCreate, 'customizePriceSell', 0.25);
    clearFields(nameFormExchangeCreate, false, false, 'amountBuy', 'amountSell');
  }

  onSubmit = (values) => {
    const { messages } = this.props.intl;

    const data = {
      name: 'Hey hey',
      address: '123 Abc street',
      phone: '1234567890',
      business_type: 'personal',
      status: 'open',
      center: 'abcdef',
      information: { open_hour: '7 AM', close_hour: '8 PM' },
      longitude: 1,
      latitude: 2,
    };

    // this.createOffer(data);
    this.updateOffer(data);
  }

  createOffer = (offer) => {
    this.modalRef.close();
    console.log('createOffer', offer);

    this.props.createStoreATM({
      PATH_URL: API_URL.EXCHANGE.CASH_STORE_ATM,
      data: offer,
      METHOD: 'POST',
      successFn: this.handleCreateOfferSuccess,
      errorFn: this.handleCreateOfferFailed,
    });
  }

  updateOffer = (offer) => {
    this.modalRef.close();
    console.log('createOffer', offer);

    this.props.createStoreATM({
      PATH_URL: API_URL.EXCHANGE.CASH_STORE_ATM,
      data: offer,
      METHOD: 'PUT',
      successFn: this.handleCreateOfferSuccess,
      errorFn: this.handleCreateOfferFailed,
    });
  }

  handleCreateOfferSuccess = async (responseData) => {
    console.log('handleCreateOfferSuccess', responseData);
    const { rfChange, currency, amountSell } = this.props;
    // const offer = OfferShop.offerShop(responseData.data);
    // this.offer = offer;


    this.hideLoading();
    const message = <FormattedMessage id="createOfferSuccessMessage" />;

    this.props.showAlert({
      message: <div className="text-center">{message}</div>,
      timeOut: 2000,
      type: 'success',
      callBack: () => {
        // this.gotoUserDashBoard();
      },
    });
  }

  handleCreateOfferFailed = (e) => {
    console.log('handleCreateOfferFailed', e);
    this.hideLoading();
    this.props.showAlert({
      message: <div className="text-center">{getErrorMessageFromCode(e)}</div>,
      timeOut: 3000,
      type: 'danger',
    });
  }

  handleValidate = values => {
    const { isUpdate } = this.state;
    return validate(values, isUpdate);
  }

  render() {
    const { messages } = this.props.intl;
    const {
      currency, listOfferPrice, stationCurrency, customizePriceBuy, customizePriceSell, amountBuy, amountSell, freeStartInfo, isChooseFreeStart,
    } = this.props;
    const {
      isUpdate, enableAction, buyBalance, sellBalance, modalContent, modalFillContent,
    } = this.state;
    const fiatCurrency = stationCurrency?.id;

    console.log('this.offer', this.offer);
    // console.log('this.state', this.state);

    const { price: priceBuy } = getOfferPrice(listOfferPrice, EXCHANGE_ACTION.BUY, currency, fiatCurrency);
    const { price: priceSell } = getOfferPrice(listOfferPrice, EXCHANGE_ACTION.SELL, currency, fiatCurrency);
    const priceBuyDisplayed = formatMoneyByLocale(priceBuy, fiatCurrency);
    const priceSellDisplayed = formatMoneyByLocale(priceSell, fiatCurrency);
    const estimatedPriceBuy = formatMoneyByLocale(priceBuy * (1 + parseFloat(customizePriceBuy, 10) / 100), fiatCurrency);
    const estimatedPriceSell = formatMoneyByLocale(priceSell * (1 + parseFloat(customizePriceSell, 10) / 100), fiatCurrency);

    const wantToBuy = amountBuy && amountBuy > 0;
    const wantToSell = amountSell && amountSell > 0;

    const listCurrency = FIAT_CURRENCY_LIST;
    return (
      <div className="create-exchange">
        <FormExchangeCreate onSubmit={this.onSubmit} validate={this.handleValidate}>
          <div className="d-flex mt-3">
            <div className="input-group">
              <Field
                name="currency"
                // containerClass="radio-container-old"
                component={fieldRadioButton}
                type="tab-3"
                list={this.CRYPTO_CURRENCY_LIST}
                validate={[required]}
                onChange={this.onCurrencyChange}
              />
            </div>
          </div>

          <div>
            <div className="label"><FormattedMessage id="ex.create.label.stationInfo" /></div>
            <div className="section">
              {/*
            <div className="d-flex">
              <label className="col-form-label mr-auto label-create"><span className="align-middle"><FormattedMessage id="ex.create.label.nameStation"/></span></label>
              <div className='input-group'>
                <Field
                  name="nameShop"
                  className="form-control-custom form-control-custom-ex w-100 input-no-border"
                  component={fieldInput}
                  placeholder={'Apple store'}
                  // onChange={this.onAmountChange}
                  // validate={[required]}
                />
              </div>
            </div>
            <hr className="hrLine"/> */}

              <div className="d-flex py-1">
                <label className="col-form-label mr-auto label-create">
                  <span className="align-middle">{messages.me.profile.text.username.label}</span>
                </label>
                <div className="input-group">
                  <Field
                    name="username"
                    className="form-control-custom form-control-custom-ex w-100 input-no-border"
                    component={fieldInput}
                    placeholder={messages.me.profile.text.username.label}
                    validate={[required]}
                  />
                </div>
              </div>

              <div>
                <div className="d-flex mt-2">
                  <label className="col-form-label mr-auto label-create"><span
                    className="align-middle"
                  ><FormattedMessage id="ex.create.label.stationCurrency" />
                  </span>
                  </label>
                  <div className="input-group w-100">
                    <Field
                      name="stationCurrency"
                      classNameWrapper=""
                      defaultText={<FormattedMessage id="ex.create.placeholder.stationCurrency" />}
                      classNameDropdownToggle="dropdown-button"
                      list={listCurrency}
                      component={fieldDropdown}
                      // disabled={!enableChooseFiatCurrency}
                    />
                  </div>
                </div>
                <hr className="hrLine" />
              </div>

              <div className="d-flex mt-2">
                <label className="col-form-label mr-auto label-create"><span
                  className="align-middle"
                ><FormattedMessage id="ex.create.label.phone" />
                </span>
                </label>
                <div className="input-group w-100">
                  <Field
                    name="phone"
                    className="form-control-custom form-control-custom-ex w-100 input-no-border"
                    component={fieldPhoneInput}
                    color={textColor}
                    type="tel"
                    placeholder="4995926433"
                    // validate={[required, currency === 'BTC' ? minValue001 : minValue01]}
                    validate={[requiredPhone]}
                  />
                </div>
              </div>
              <hr className="hrLine" />

              <div className="d-flex mt-2">
                <label className="col-form-label mr-auto label-create"><span
                  className="align-middle"
                >{messages.create.atm.label.bankInfo}
                </span>
                </label>
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
              <hr className="hrLine" />

              <div className="d-flex mt-2">
                <label className="col-form-label mr-auto label-create"><span
                  className="align-middle"
                >{messages.create.atm.label.bankInfo}
                </span>
                </label>
                <div className="w-100">
                  <Field
                    name="bankInfo"
                    className="form-control-custom form-control-custom-ex w-100 input-no-border"
                    component={fieldInput}
                    validate={[required]}
                    placeholder="81 E. Augusta Ave. Salinas"
                  />
                </div>
              </div>
              <hr className="hrLine" />

              <div className="d-flex mt-2">
                <label className="col-form-label mr-auto label-create"><span
                  className="align-middle"
                >{messages.create.atm.label.ccInfo}
                </span>
                </label>
                <div className="w-100">
                  <Field
                    name="ccInfo"
                    className="form-control-custom form-control-custom-ex w-100 input-no-border"
                    component={fieldInput}
                    validate={[required]}
                    placeholder="81 E. Augusta Ave. Salinas"
                  />
                </div>
              </div>
            </div>
          </div>

          <Button block type="submit" disabled={!enableAction} className="mt-3"> {
            messages.create.atm.button.save
          }
          </Button>
        </FormExchangeCreate>
        <ModalDialog onRef={modal => this.modalRef = modal}>
          {modalContent}
        </ModalDialog>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const currency = selectorFormExchangeCreate(state, 'currency');

  const amountBuy = selectorFormExchangeCreate(state, 'amountBuy');
  const amountSell = selectorFormExchangeCreate(state, 'amountSell');

  const customizePriceBuy = selectorFormExchangeCreate(state, 'customizePriceBuy') || 0;
  const customizePriceSell = selectorFormExchangeCreate(state, 'customizePriceSell') || 0;

  // const nameShop = selectorFormExchangeCreate(state, 'nameShop');
  const phone = selectorFormExchangeCreate(state, 'phone');
  const address = selectorFormExchangeCreate(state, 'address');
  const stationCurrency = selectorFormExchangeCreate(state, 'stationCurrency');
  const username = selectorFormExchangeCreate(state, 'username');

  return {
    currency,
    amountBuy,
    amountSell,
    customizePriceBuy,
    customizePriceSell,
    // nameShop,
    phone,
    address,
    stationCurrency,
    username,
    ipInfo: state.app.ipInfo,
    authProfile: state.auth.profile,
    offerStores: state.exchange.offerStores,
    listOfferPrice: state.exchange.listOfferPrice,
    freeStartInfo: state.exchange.freeStartInfo,
    isChooseFreeStart: state.exchange.isChooseFreeStart,
    app: state.app,
  };
};

const mapDispatchToProps = dispatch => ({
  showAlert: bindActionCreators(showAlert, dispatch),
  rfChange: bindActionCreators(change, dispatch),
  clearFields: bindActionCreators(clearFields, dispatch),
  showLoading: bindActionCreators(showLoading, dispatch),
  hideLoading: bindActionCreators(hideLoading, dispatch),

  createStoreATM: bindActionCreators(createStoreATM, dispatch),
  getStoreATM: bindActionCreators(getStoreATM, dispatch),
  updateStoreATM: bindActionCreators(updateStoreATM, dispatch),
  showPopupGetGPSPermission: bindActionCreators(showPopupGetGPSPermission, dispatch),
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Component));
