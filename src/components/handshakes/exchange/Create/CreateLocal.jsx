import React from "react";
import {injectIntl} from "react-intl";
import Feed from "@/components/core/presentation/Feed";
import Button from "@/components/core/controls/Button";
import './styles.scss'
import createForm from "@/components/core/form/createForm";
import {
  fieldCleave,
  fieldDropdown,
  fieldInput,
  fieldNumericInput,
  fieldPhoneInput,
  fieldRadioButton
} from "@/components/core/form/customField";
import {maxValue, minValue, required} from "@/components/core/form/validation";
import {change, Field, formValueSelector} from "redux-form";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {
  API_URL,
  CRYPTO_CURRENCY,
  CRYPTO_CURRENCY_DEFAULT,
  DEFAULT_FEE,
  EXCHANGE_ACTION,
  EXCHANGE_ACTION_DEFAULT,
  EXCHANGE_ACTION_LIST,
  EXCHANGE_ACTION_NAME,
  FIAT_CURRENCY,
  FIAT_CURRENCY_SYMBOL,
  MIN_AMOUNT,
  SELL_PRICE_TYPE_DEFAULT,
  CRYPTO_CURRENCY_NAME,
} from "@/constants";
import "../styles.scss";
import ModalDialog from "@/components/core/controls/ModalDialog/ModalDialog";
// import {MasterWallet} from '@/models/MasterWallet';
import {URL} from "@/constants";
import {hideLoading, showAlert, showLoading} from "@/reducers/app/action";
import {MasterWallet} from "@/models/MasterWallet";
import {ExchangeShopHandshake} from "@/services/neuron";
// import phoneCountryCodes from '@/components/core/form/country-calling-codes.min.json';
import COUNTRIES from "@/data/country-dial-codes.js";
import {feedBackgroundColors} from "@/components/handshakes/exchange/config";
import {formatAmountCurrency, formatMoney} from "@/services/offer-util";
import {createOfferStores,} from "@/reducers/exchange/action";
import {BigNumber} from "bignumber.js/bignumber";
import { authUpdate } from '@/reducers/auth/action';
import OfferShop from "@/models/OfferShop";
import CoinOffer from "@/models/CoinOffer";
import { addOfferItem, } from "@/reducers/exchange/action";
import {getOfferStores} from "@/reducers/exchange/action";
import iconApproximate from '@/assets/images/icon/icons8-approximately_equal.svg';

const nameFormExchangeCreateLocal = "exchangeCreateLocal";
const FormExchangeCreateLocal = createForm({
  propsReduxForm: {
    form: nameFormExchangeCreateLocal,
    // initialValues: {
    //   currency: CRYPTO_CURRENCY_DEFAULT,
    //   customizePriceBuy: 0,
    //   customizePriceSell: 0,
    // }
    initialValues: {
      currency: CRYPTO_CURRENCY_DEFAULT,
      customizePriceBuy: 0.25,
      customizePriceSell: -0.25,
      amountBuy: 0.1,
      amountSell: 0.2,
      nameShop: 'Apple store',
      phone: '1234567',
      address: '139 Hong Ha',
    }
  }
});
const selectorFormExchangeCreateLocal = formValueSelector(nameFormExchangeCreateLocal);

const textColor = "#ffffff";
const btnBg = "rgba(29,29,38,0.30)";
const validateFee = [
  minValue(-50),
  maxValue(50)
];
const minValue01 = minValue(MIN_AMOUNT[CRYPTO_CURRENCY.ETH]);
const minValue001 = minValue(MIN_AMOUNT[CRYPTO_CURRENCY.BTC]);

class Component extends React.Component {

  CRYPTO_CURRENCY_LIST = [
    { value: CRYPTO_CURRENCY.ETH, text: CRYPTO_CURRENCY_NAME[CRYPTO_CURRENCY.ETH], hide: false },
    { value: CRYPTO_CURRENCY.BTC, text: CRYPTO_CURRENCY_NAME[CRYPTO_CURRENCY.BTC], hide: false },
  ];
  constructor(props) {
    super(props);

    this.state = {
      modalContent: "",
      currency: CRYPTO_CURRENCY_DEFAULT,
      lat: 0,
      lng: 0,
      /*haveProfile: false,
      haveOfferETH: false,
      haveOfferBTC: false,*/
    };
    // this.mainColor = _sample(feedBackgroundColors)
    this.mainColor = "#1F2B34";
  }

  render() {
    const { currency  } = this.props;
    const modalContent = this.state.modalContent;
    const haveProfile = this.offer ? true : false;
    const allowInitiate = this.offer ? (!this.offer.itemFlags.ETH || !this.offer.itemFlags.BTC) : true;
    const total = 1234;
    const fiat = "USD"
    return (
      <div className="create-exchange-local">
        <FormExchangeCreateLocal onSubmit={this.handleSubmit}>
          <Feed className="feed my-2 p-0" background={this.mainColor}>
            <div style={{ color: "white", padding: "20px" }}>

              <div className="d-flex mb-4">
                <label className="col-form-label mr-auto label-create head-label"><span className="align-middle">I want to</span></label>
                <div className='input-group'>
                  <Field
                    name="type"
                    // containerClass="radio-container-old"
                    component={fieldRadioButton}
                    type="tab"
                    list={this.CRYPTO_CURRENCY_LIST}
                    color={textColor}
                    validate={[required]}
                    onChange={this.onCurrencyChange}
                  />
                </div>
              </div>

              <div className="d-flex mb-3">
                <label className="col-form-label mr-auto label-create"></label>
                <div className='input-group'>
                  <Field
                    name="what"
                    className="form-control-custom form-control-custom-ex w-100 input-no-border"
                    component={fieldInput}
                    placeholder="something, something"
                    // onChange={this.onAmountChange}
                    validate={[required]}
                  />
                  <hr className="hrLine w-100"/>
                </div>
              </div>

              <div className="d-flex mb-2">
                <label className="col-form-label mr-auto label-create" style={{ width: '190px' }}><span className="align-middle">Coin</span></label>
                <div className='input-group'>
                  <Field
                    name="currency"
                    // containerClass="radio-container-old"
                    component={fieldRadioButton}
                    type="radio-1"
                    list={this.CRYPTO_CURRENCY_LIST}
                    color={textColor}
                    validate={[required]}
                  />
                </div>
              </div>

              <hr className="hrLine"/>

              <div className="d-flex">
                <label className="col-form-label mr-auto label-create"><span className="align-middle">Amount coin</span></label>
                <div className='input-group'>
                  <Field
                    name="amount"
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
                <label className="col-form-label mr-auto label-create"><span className="align-middle">Total</span></label>
                <div className='input-group'>
                  <div><span className="form-text"><img src={iconApproximate} /> {total} {fiat}</span></div>
                </div>
              </div>

              <hr className="hrLine"/>

              <div className="d-flex mt-2">
                <label className="col-form-label mr-auto label-create"><span className="align-middle">Phone</span></label>
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
                <label className="col-form-label mr-auto label-create"><span className="align-middle">Address*</span></label>
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
          </Feed>
          <Button block type="submit" disabled={!allowInitiate}>Initiate</Button>
        </FormExchangeCreateLocal>
        <ModalDialog onRef={modal => this.modalRef = modal}>
          {modalContent}
        </ModalDialog>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const currency = selectorFormExchangeCreateLocal(state, "currency");

  const amountBuy = selectorFormExchangeCreateLocal(state, "amountBuy");
  const amountSell = selectorFormExchangeCreateLocal(state, "amountSell");

  const customizePriceBuy = selectorFormExchangeCreateLocal(state, "customizePriceBuy") || 0;
  const customizePriceSell = selectorFormExchangeCreateLocal(state, "customizePriceSell") || 0;

  const nameShop = selectorFormExchangeCreateLocal(state, "nameShop");
  const phone = selectorFormExchangeCreateLocal(state, "phone");
  const address = selectorFormExchangeCreateLocal(state, "address");

  return {
    currency, amountBuy, amountSell,
    customizePriceBuy, customizePriceSell,
    nameShop, phone, address,
    ipInfo: state.app.ipInfo,
    authProfile: state.auth.profile,
    offerStores: state.exchange.offerStores,
  };
};

const mapDispatchToProps = (dispatch) => ({
  showAlert: bindActionCreators(showAlert, dispatch),
  rfChange: bindActionCreators(change, dispatch),
  showLoading: bindActionCreators(showLoading, dispatch),
  hideLoading: bindActionCreators(hideLoading, dispatch),
  authUpdate: bindActionCreators(authUpdate, dispatch),

  createOfferStores: bindActionCreators(createOfferStores, dispatch),
  addOfferItem: bindActionCreators(addOfferItem, dispatch),
  getOfferStores: bindActionCreators(getOfferStores, dispatch),
});
export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Component));
