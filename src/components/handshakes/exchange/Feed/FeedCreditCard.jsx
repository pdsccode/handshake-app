import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { change, Field, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import local from '@/services/localStore';
import {
  API_ENDPOINT,
  API_URL,
  APP,
  CRYPTO_CURRENCY,
  CRYPTO_CURRENCY_NAME,
  EXCHANGE_ACTION,
  EXCHANGE_ACTION_NAME,
  FIAT_CURRENCY,
  FIAT_CURRENCY_NAME,
  URL,
} from '@/constants';
import '../styles.scss';
import { validate, validateSpecificAmount } from '@/components/handshakes/exchange/validation';
import createForm from '@/components/core/form/createForm';
import { fieldCleave, fieldDropdown, fieldInput } from '@/components/core/form/customField';
import { email, required } from '@/components/core/form/validation';
import {
  createCCOrder,
  getCcLimits,
  getCryptoPrice,
  getCryptoPriceForPackage,
  getUserCcLimit,
  initPaymentInstantBuy,
} from '@/reducers/exchange/action';
import CryptoPrice from '@/models/CryptoPrice';
import { MasterWallet } from '@/services/Wallets/MasterWallet';
import { bindActionCreators } from 'redux';
import { showAlert } from '@/reducers/app/action';
import { roundNumberByLocale } from '@/services/offer-util';
import { BigNumber } from 'bignumber.js';
import axios from 'axios';
import './FeedCreditCard.scss';
import { getErrorMessageFromCode } from '@/components/handshakes/exchange/utils';
import * as gtag from '@/services/ga-utils';
import taggingConfig from '@/services/tagging-config';

import iconBitcoin from '@/assets/images/icon/coin/btc.svg';
import iconEthereum from '@/assets/images/icon/coin/eth.svg';
import iconBitcoinCash from '@/assets/images/icon/coin/bch.svg';
import iconUsd from '@/assets/images/icon/coin/icons8-us_dollar.svg';
import iconLock from '@/assets/images/icon/icons8-lock_filled.svg';
import cx from 'classnames';
import ExpandArrowSVG from '@/assets/images/icon/expand-arrow-green.svg';
import Deposit from '@/pages/Escrow/Deposit';
import Modal from '@/components/core/controls/Modal/Modal';
import Image from '@/components/core/presentation/Image';
import loadingSVG from '@/assets/images/icon/loading.gif';


const adyenEncrypt = require('adyen-cse-web');

const nameFormShowAddressWallet = 'showAddressWallet';
const ShowAddressWalletForm = createForm({ propsReduxForm: { form: nameFormShowAddressWallet } });

export const CRYPTO_ICONS = {
  [CRYPTO_CURRENCY.ETH]: iconEthereum,
  [CRYPTO_CURRENCY.BTC]: iconBitcoin,
  BCH: iconBitcoinCash,
};

const CRYPTO_CURRENCY_CREDIT_CARD = {
  ...CRYPTO_CURRENCY, BCH: 'BCH',
};

const listCurrency = Object.values(CRYPTO_CURRENCY_CREDIT_CARD).map((item) => {
  return { id: item, text: <span><img src={CRYPTO_ICONS[item]} width={24} /> {CRYPTO_CURRENCY_NAME[item]}</span> };
});

const listPackages = {
  [CRYPTO_CURRENCY.ETH]: [{ name: 'basic', amount: 0.1, fiatAmount: 0, show: false }, { name: 'pro', amount: 0.4, fiatAmount: 0, show: false }],
  [CRYPTO_CURRENCY.BTC]: [{ name: 'basic', amount: 0.005, fiatAmount: 0, show: false }, { name: 'pro', amount: 0.01, fiatAmount: 0, show: false }],
  BCH: [{ name: 'basic', amount: 0.1, fiatAmount: 0, show: false }, { name: 'pro', amount: 0.15, fiatAmount: 0, show: false }],
};

const listFiatCurrency = [
  {
    id: FIAT_CURRENCY.USD,
    text: <span><img src={iconUsd} width={24} /> {FIAT_CURRENCY_NAME[FIAT_CURRENCY.USD]}</span>,
  },
];

const nameFormSpecificAmount = 'specificAmount';
const FormSpecificAmount = createForm({
  propsReduxForm: {
    form: nameFormSpecificAmount,
    initialValues: {
      currency: {
        id: CRYPTO_CURRENCY.BTC,
        text: <span><img src={iconBitcoin} width={22} /> {CRYPTO_CURRENCY_NAME[CRYPTO_CURRENCY.BTC]}</span>,
      },
      fiatCurrency: {
        id: FIAT_CURRENCY.USD,
        text: <span><img src={iconUsd} width={24} /> {FIAT_CURRENCY_NAME[FIAT_CURRENCY.USD]}</span>,
      },
    },
  },
});
const selectorFormSpecificAmount = formValueSelector(nameFormSpecificAmount);

const nameFormCreditCard = 'creditCard';
const FormCreditCard = createForm({
  propsReduxForm: {
    form: nameFormCreditCard,
    initialValues: {},
  },
});
const selectorFormCreditCard = formValueSelector(nameFormCreditCard);

const DECIMAL_NUMBER = 2;

class FeedCreditCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasSelectedCoin: false,
      isNewCCOpen: true,
      amount: 0,
      currency: CRYPTO_CURRENCY.BTC,
      fiatAmount: 0,
      fiatCurrency: FIAT_CURRENCY.USD,
      cryptoPrice: this.props.cryptoPrice,
      wallets: [],
      walletSelected: false,
      allowBuy: true,
      hasSelectedPackage: false,
      modalContent: '',
      modalTitle: '',
      isLoading: false,
      issuerUrl: '',
      paReq: '',
      md: '',
      termUrl: '',
    };
  }

  showLoading = () => {
    this.setLoading(true);
  };

  hideLoading = () => {
    this.setLoading(false);
  };

  setLoading = (loadingState) => {
    this.setState({ isLoading: loadingState });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (JSON.stringify(nextProps.cryptoPrice) !== JSON.stringify(prevState.cryptoPrice)) {
      return { cryptoPrice: nextProps.cryptoPrice };
    }

    return null;
  }

  async componentDidMount() {
    const { currencyForced, rfChange } = this.props;
    if (currencyForced) {
      const item = { id: currencyForced, text: <span><img src={CRYPTO_ICONS[currencyForced]} width={24} /> {CRYPTO_CURRENCY_NAME[currencyForced]}</span> };
      rfChange(nameFormSpecificAmount, 'currency', item);

      this.setState({ currency: currencyForced }, () => {
        // this.getCryptoPriceByAmount(1);
      });
    } else {
      // this.getCryptoPriceByAmount(1);
    }

    this.props.getCcLimits({ PATH_URL: API_URL.EXCHANGE.GET_CC_LIMITS });
    this.props.getUserCcLimit({ PATH_URL: API_URL.EXCHANGE.GET_USER_CC_LIMIT });

    // this.intervalCountdown = setInterval(() => {
    //   const { amount } = this.props;
    //   this.getCryptoPriceByAmount(amount);
    // }, 30000);
    this.getListWallets();
    this.calculatePriceForPackages();
  }

  componentWillUnmount() {
    // if (this.intervalCountdown) {
    //   clearInterval(this.intervalCountdown);
    // }
  }

  calculatePriceForPackages = () => {
    Object.entries(listPackages).forEach(([currency, items]) => {
      items.forEach((item) => {
        const { amount } = item;
        this.getCryptoPriceForPackageByAmount(amount, currency);
      });
    });
  }

  getCryptoPriceForPackageByAmount = (amount, currency) => {
    const data = { amount, currency };

    this.props.getCryptoPriceForPackage({
      PATH_URL: API_URL.EXCHANGE.GET_CRYPTO_PRICE,
      qs: data,
      successFn: this.handleGetCryptoPriceForPackageSuccess,
      errorFn: this.handleGetCryptoPricePackageFailed,
    });
  };

  handleGetCryptoPriceForPackageSuccess = (responseData) => {
    const cryptoPrice = CryptoPrice.cryptoPrice(responseData.data);
    console.log('handleGetCryptoPriceForPackageSuccess', cryptoPrice);

    Object.entries(listPackages).forEach(([currency, items]) => {
      for (const item of items) {
        const { amount } = item;
        console.log('cryptoPrice.currency  cryptoPrice.amount ', cryptoPrice.currency, cryptoPrice.amount);
        console.log('currency  amount ', currency, amount);
        if (cryptoPrice.currency === currency && +cryptoPrice.amount === amount) {
          console.log('hello');
          item.show = true;
          item.fiatAmount = cryptoPrice.fiatAmount;
          break;
        }
      }
    });
  };

  handleGetCryptoPricePackageFailed = (e) => {
    console.log('handleGetCryptoPriceFailed', e);
  };

  getCryptoPriceByAmount = (amount) => {
    const { currency } = this.state;

    const data = { amount, currency };

    this.props.getCryptoPrice({
      PATH_URL: API_URL.EXCHANGE.GET_CRYPTO_PRICE,
      qs: data,
      successFn: this.handleGetCryptoPriceSuccess,
      errorFn: this.handleGetCryptoPriceFailed,
    });
  };

  handleGetCryptoPriceSuccess = (responseData) => {
    // console.log('handleGetCryptoPriceSuccess', data);
    // const { userCcLimit } = this.props;
    const { hasSelectedPackage } = this.state;
    const { amount } = this.props;
    const { rfChange } = this.props;
    const cryptoPrice = CryptoPrice.cryptoPrice(responseData.data);

    console.log('handleGetCryptoPriceSuccess amount', amount);
    let fiatAmount = amount * cryptoPrice.fiatAmount / cryptoPrice.amount || 0;

    fiatAmount = roundNumberByLocale(fiatAmount, cryptoPrice.fiatCurrency, DECIMAL_NUMBER);
    console.log('onAmountChange', fiatAmount);
    rfChange(nameFormSpecificAmount, 'fiatAmount', fiatAmount);

    this.setState({ allowBuy: true });

    if (hasSelectedPackage) {
      this.setState({ hasSelectedCoin: true, hasSelectedPackage: false });
    }

    // this.generatePackages(cryptoPrice);

    //
    // const amoutWillUse = new BigNumber(userCcLimit.amount).plus(new BigNumber(cryptoPrice.fiatAmount)).toNumber();
    //
    // if (this.state.amount && userCcLimit && userCcLimit.limit < amoutWillUse) {
    //   this.setState({ showCCScheme: false });
    // } else {
    //   this.setState({ showCCScheme: false });
    // }
  };

  handleGetCryptoPriceFailed = (e) => {
    console.log('handleGetCryptoPriceFailed', e);
    this.setState({ allowBuy: false, hasSelectedPackage: false });
    this.props.showAlert({
      message: <div className="text-center">{getErrorMessageFromCode(e)}</div>,
      timeOut: 3000,
      type: 'danger',
    });
  };

  handleSubmitSpecificAmount = (values) => {
    this.setState({
      hasSelectedCoin: true, amount: values.amount, fiatAmount: values.fiatAmount, currency: values.currency.id, fiatCurrency: values.fiatCurrency.id,
    }, () => {
      this.getCryptoPriceByAmount(values.amount);
    });
  }

  closeInputCreditCard = () => {
    this.setState({ hasSelectedCoin: false }, () => {
      const { rfChange } = this.props;
      const { amount, fiatAmount, currency } = this.state;

      rfChange(nameFormSpecificAmount, 'amount', amount);
      rfChange(nameFormSpecificAmount, 'fiatAmount', fiatAmount);
      const item = { id: currency, text: <span><img src={CRYPTO_ICONS[currency]} width={24} /> {CRYPTO_CURRENCY_NAME[currency]}</span> };
      rfChange(nameFormSpecificAmount, 'currency', item);
    });
  }

  handleValidate = (values) => {
    return validate(values, this.state, this.props);
  };

  handleValidateSpecificAmount = (values) => {
    return validateSpecificAmount(values, this.state, this.props);
  };

  handleSubmit = async (values) => {
    console.log('handleSubmit', values);

    const { handleSubmit } = this.props;
    const { userCcLimit, cryptoPrice, addressForced, currencyForced } = this.props;
    const { walletSelected } = this.state;

    gtag.event({
      category: taggingConfig.creditCard.category,
      action: taggingConfig.creditCard.action.clickBuy,
    });

    // const amoutWillUse = new BigNumber(userCcLimit.amount).plus(new BigNumber(fiatAmount)).toNumber();
    //
    // if (this.state.amount && userCcLimit && userCcLimit.limit < amoutWillUse) {
    //   this.props.showAlert({
    //     message: <div className="text-center"><FormattedMessage
    //       id="overCCLimit"
    //       values={{
    //         currency: FIAT_CURRENCY_SYMBOL,
    //         limit: formatMoney(userCcLimit.limit),
    //         amount: formatMoney(userCcLimit.amount),
    //       }}
    //     />
    //     </div>,
    //     timeOut: 5000,
    //     type: 'danger',
    //     // callBack: this.handleBuySuccess
    //   });
    //
    //   return;
    // }

    this.showLoading();

    if (handleSubmit) {
      handleSubmit(values);
    } else {
      const { userProfile: { creditCard } } = this.props;

      let cc = {};

      // Use existing credit card
      if (creditCard.ccNumber.length > 0 && !this.state.isNewCCOpen) {
        cc = { token: 'true' };
        this.handleCreateCCOrder(cc);
      } else {
        const { cc_number, cc_expired, cc_cvc, cc_email } = values;
        const mmYY = cc_expired.split('/');
        // const params = new URLSearchParams();
        // params.append('card[number]', cc_number && cc_number.trim().replace(/ /g, ''));
        // params.append('card[exp_month]', mmYY[0]);
        // params.append('card[exp_year]', `20${mmYY[1]}`);
        // params.append('card[cvc]', cc_cvc);
        // params.append('key', process.env.stripeKey);
        // params.append('type', 'card');

        const serverTime = await axios.get(`${API_ENDPOINT}/public-api/exchange/server-time`);
        console.log('serverTime', serverTime?.data?.data);

        try {
          const postData = {};

          const cardData = {
            number: cc_number && cc_number.trim().replace(/ /g, ''),
            cvc: cc_cvc,
            holderName: 'First Last',
            expiryMonth: mmYY[0],
            expiryYear: `20${mmYY[1]}`,
            // generationtime : moment(new Date()).format('YYYY-MM-DDThh:mm:ss.sssTZD'),
            generationtime: serverTime?.data?.data,
          };

          const source = {
            three_d_secure: {
              last4: cc_number.substr(cc_number.length - 4, 4),
              exp_month: mmYY[0],
              exp_year: `20${mmYY[1]}`,
            },
          };

          local.save(APP.CC_SOURCE, source);

          const key = process.env.adyenKey;
          const options = {}; // See adyen.encrypt.nodom.html for details

          const cseInstance = adyenEncrypt.createEncryption(key, options);
          // postData['adyen-encrypted-data'] = cseInstance.encrypt(cardData);
          postData.additionalData = { 'card.encrypted.json': cseInstance.encrypt(cardData) };
          postData.amount = { value: new BigNumber(cryptoPrice.fiatAmount).multipliedBy(100).toNumber(), currency: 'USD' };

          console.log('source', source);
          console.log('cardData', cardData);
          console.log('postData', JSON.stringify(postData));

          // this.encryptExample();

          this.props.initPaymentInstantBuy({
            PATH_URL: `${API_URL.EXCHANGE.CREATE_CC_ORDER}/init-payment`,
            data: postData,
            METHOD: 'POST',
            successFn: this.handleInitPaymentSuccess,
            errorFn: this.handleInitPaymentFailed,
          });
        } catch (e) {
          console.log('', e.toString());
        }

        // axios.post(
        //   'https://api.stripe.com/v1/sources',
        //   params,
        //   { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
        //   .then((payload) => {
        //     console.log('payload', payload);
        //     const stripe = Stripe(process.env.stripeKey);
        //     stripe.createSource({
        //       type: 'three_d_secure',
        //       amount: new BigNumber(cryptoPrice.fiatAmount).multipliedBy(100).toString(),
        //       currency: FIAT_CURRENCY.USD,
        //       three_d_secure: {
        //         card: payload.data.id,
        //       },
        //       redirect: {
        //         return_url: `${window.origin}${URL.CC_PAYMENT_URL}`,
        //       },
        //     }).then((result) => {
        //       console.log('submit result', result);
        //       if (result.source.three_d_secure.three_d_secure === 'not_supported') {
        //         this.hideLoading();
        //
        //         const message = <FormattedMessage id="threeDSecureNotSupported" />;
        //         this.props.showAlert({
        //           message: <div className="text-center">{message}</div>,
        //           timeOut: 3000,
        //           type: 'danger',
        //           // callBack: this.handleBuySuccess
        //         });
        //       } else {
        //         local.save(APP.CC_SOURCE, result.source);
        //         local.save(APP.CC_PRICE, cryptoPrice);
        //         local.save(APP.CC_TOKEN, payload.data.id);
        //         local.save(APP.CC_EMAIL, cc_email);
        //
        //         let address = '';
        //         if (currencyForced && addressForced && currencyForced === cryptoPrice.currency) {
        //           address = addressForced;
        //         } else {
        //           // const wallet = MasterWallet.getWalletDefault(cryptoPrice.currency);
        //           address = walletSelected.address;
        //         }
        //         local.save(APP.CC_ADDRESS, address);
        //
        //         window.location = result.source.redirect.url;
        //       }
        //     });
        //
        //     // const newCCNum = payload.data.id;
        //     // cc = {
        //     //   cc_num: newCCNum,
        //     //   cvv: cc_cvc && cc_cvc.trim().replace(/ /g, ""),
        //     //   expiration_date: cc_expired && cc_expired.trim().replace(/ /g, ""),
        //     //   token: "",
        //     //   save: "true"
        //     // };
        //     // this.handleCreateCCOrder(cc);
        //   }).catch((error) => {
        //     console.log('error', error);
        //     this.hideLoading();
        //
        //     // const message = error?.response?.data?.error?.message || 'Something wrong!';
        //     const message = 'Opp, something wrong! Please go back later!';
        //     this.props.showAlert({
        //       message: <div className="text-center">{message}</div>,
        //       timeOut: 5000,
        //       type: 'danger',
        //     // callBack: this.handleBuySuccess
        //     });
        //   });
      }
      // console.log('handleSubmit', cc);
    }
  };

  handleInitPaymentSuccess = (res) => {
    console.log('handleInitPaymentSuccess', res);
    const { additionalData, authCode, issuerUrl, md, paRequest, pspReference, resultCode } = res.data;
    const { cryptoPrice, addressForced, currencyForced } = this.props;
    const { cc_email } = this.props;
    const { walletSelected } = this.state;

    if (resultCode !== 'RedirectShopper') {
      const message = 'Opp, something wrong! Please go back later!';
      this.props.showAlert({
        message: <div className="text-center">{message}</div>,
        timeOut: 5000,
        type: 'danger',
        // callBack: this.handleBuySuccess
      });
      return;
    }

    local.save(APP.CC_PRICE, cryptoPrice);
    local.save(APP.CC_EMAIL, cc_email);

    const source = local.get(APP.CC_SOURCE);

    source.id = md;

    local.save(APP.CC_SOURCE, source);

    let address = '';
    if (currencyForced && addressForced && currencyForced === cryptoPrice.currency) {
      address = addressForced;
    } else {
      // const wallet = MasterWallet.getWalletDefault(cryptoPrice.currency);
      address = walletSelected.address;
    }
    local.save(APP.CC_ADDRESS, address);
    const paymentUrl = `${API_ENDPOINT}/public-api/exchange/authorise-receive`;
    // `${window.origin}${URL.CC_PAYMENT_URL}`

    this.setState({ issuerUrl, paReq: paRequest, md, termUrl: paymentUrl }, () => {
      document.getElementById('3dform').submit();
    });

    // var bodyFormData = new FormData();
    //
    // bodyFormData.set('PaReq', paRequest);
    // bodyFormData.set('MD', md);
    // bodyFormData.set('TermUrl', `${window.origin}${URL.CC_PAYMENT_URL}`);
    //
    // axios({
    //   method: 'post',
    //   url: issuerUrl,
    //   data: bodyFormData,
    //   config: { headers: {'Content-Type': 'multipart/form-data' }}
    // })
    //   .then((payload) => {
    //     console.log(payload);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //
    //     this.hideLoading();
    //
    //     // const message = error?.response?.data?.error?.message || 'Something wrong!';
    //     const message = 'Opp, something wrong! Please go back later!';
    //     this.props.showAlert({
    //       message: <div className="text-center">{message}</div>,
    //       timeOut: 5000,
    //       type: 'danger',
    //       // callBack: this.handleBuySuccess
    //     });
    //   });

    // window.location = result.source.redirect.url;
  }

  handleInitPaymentFailed = (e) => {
    console.log('handleInitPaymentFailed', e);

    const message = 'Opp, something wrong! Please go back later!';
    this.props.showAlert({
      message: <div className="text-center">{message}</div>,
      timeOut: 5000,
      type: 'danger',
      // callBack: this.handleBuySuccess
    });
  }

  handleCreateCCOrder = (params) => {
    const { cryptoPrice, addressForced, authProfile, currencyForced } = this.props;

    let address = '';
    if (currencyForced && addressForced && currencyForced === cryptoPrice.currency) {
      address = addressForced;
    } else {
      const wallet = MasterWallet.getWalletDefault(cryptoPrice.currency);
      address = wallet.address;
    }

    if (cryptoPrice) {
      const paramsObj = {
        amount: cryptoPrice.amount.trim(),
        currency: cryptoPrice.currency.trim(),
        fiat_amount: cryptoPrice.fiatAmount.trim(),
        fiat_currency: FIAT_CURRENCY.USD,
        address,
        email: authProfile ? authProfile.email : '',
        payment_method_data: params,
      };
      // console.log('handleCreateCCOrder',paramsObj);
      this.props.createCCOrder({
        PATH_URL: API_URL.EXCHANGE.CREATE_CC_ORDER,
        data: paramsObj,
        METHOD: 'POST',
        successFn: this.handleCreateCCOrderSuccess,
        errorFn: this.handleCreateCCOrderFailed,
      });
    }
  };

  handleCreateCCOrderSuccess = (data) => {
    this.hideLoading();

    console.log('handleCreateCCOrderSuccess', data);

    const {
      data: {
        currency, fiat_amount, fiat_currency,
      },
    } = data;

    const value = roundNumberByLocale(new BigNumber(fiat_amount).multipliedBy(100).toNumber(), fiat_currency).toNumber();

    gtag.event({
      category: taggingConfig.creditCard.category,
      action: taggingConfig.creditCard.action.buySuccess,
      label: currency,
      value,
    });

    this.props.showAlert({
      message: <div className="text-center"><FormattedMessage id="buyUsingCreditCardSuccessMessge" /></div>,
      timeOut: 2000,
      type: 'success',
      callBack: this.handleBuySuccess,
    });
  };

  handleBuySuccess = () => {
    // if (this.timeoutClosePopup) {
    //   clearTimeout(this.timeoutClosePopup);
    // }

    const { callbackSuccess } = this.props;
    // this.modalRef.close();

    if (callbackSuccess) {
      callbackSuccess();
    } else {
      this.props.history.push(URL.HANDSHAKE_ME);
    }
  };

  handleCreateCCOrderFailed = (e) => {
    this.hideLoading();

    // console.log('handleCreateCCOrderFailed', JSON.stringify(e.response));
    this.props.showAlert({
      message: <div className="text-center">{getErrorMessageFromCode(e)}</div>,
      timeOut: 3000,
      type: 'danger',
      callBack: this.handleBuyFailed,
    });

    // this.setState({modalContent:
    //     (
    //       <div className="py-2">
    //         <Feed className="feed p-2" background="#259B24">
    //           <div className="text-white d-flex align-items-center" style={{ minHeight: '50px' }}>
    //             <div>{e.response?.data?.message}</div>
    //           </div>
    //         </Feed>
    //         <Button block className="btn btn-secondary mt-2" onClick={this.handleBuyFailed}>Dismiss</Button>
    //       </div>
    //     )
    // }, () => {
    //   this.modalRef.open();
    // });
  };

  handleBuyFailed = () => {
    // this.modalRef.close();

    const { callbackFailed } = this.props;

    if (callbackFailed) {
      callbackFailed();
    }
  };

  onCurrencyChange = (e, newValue) => {
    const { currency, amount } = this.state;

    if (currency !== newValue.id) {
      this.setState({ currency: newValue.id }, () => {
        this.getCryptoPriceByAmount(amount);
        this.getListWallets(newValue.id);
      });
    }
  }

  onAmountChange = (e, amount) => {
    console.log('onAmountChange', amount);
    const { rfChange, cryptoPrice } = this.props;

    // let fiatAmount = amount * cryptoPrice.fiatAmount / cryptoPrice.amount;
    //
    // fiatAmount = roundNumberByLocale(fiatAmount, cryptoPrice.fiatCurrency, DECIMAL_NUMBER);
    // console.log('onAmountChange', fiatAmount);
    // rfChange(nameFormSpecificAmount, 'fiatAmount', fiatAmount);

    this.setState({ amount }, () => {
      if (this.intervalCountdown) {
        clearTimeout(this.intervalCountdown);
      }

      this.intervalCountdown = setTimeout(() => {
        this.getCryptoPriceByAmount(amount);
      }, 1000);
    });
  }

  componentWillUnmount() {
    if (this.intervalCountdown) {
      clearTimeout(this.intervalCountdown);
    }
  }


  //   this.setState({
  //                   hasSelectedCoin: true, amount: values.amount, fiatAmount: values.fiatAmount, currency: values.currency.id, fiatCurrency: values.fiatCurrency.id,
  // }, () => {
  //   this.getCryptoPriceByAmount(values.amount);
  // });

  onFiatAmountChange = (e, fiatAmount) => {
    console.log('onFiatAmountChange', fiatAmount);
    const { rfChange, cryptoPrice } = this.props;

    let newAmount = fiatAmount * cryptoPrice.amount / cryptoPrice.fiatAmount;
    newAmount = (new BigNumber(newAmount).decimalPlaces(6)).toNumber();
    console.log('onFiatAmountChange', newAmount);
    rfChange(nameFormSpecificAmount, 'amount', newAmount);
  }

  // generatePackages = (cryptoPrice) => {
  //   const { currency } = this.state;
  //   const moneyPackages = [{ name: 'basic', fiatAmount: 99 }, { name: 'pro', fiatAmount: 199 }];
  //
  //   const packages = moneyPackages.map((item) => {
  //     const { name, fiatAmount } = item;
  //
  //     let newAmount = fiatAmount * cryptoPrice.amount / cryptoPrice.fiatAmount;
  //     newAmount = (new BigNumber(newAmount).decimalPlaces(6)).toNumber();
  //
  //     return {
  //       name,
  //       price: `$${fiatAmount}`,
  //       amountText: `${newAmount} ${currency}`,
  //       amount: newAmount.toString(),
  //       fiatAmount: fiatAmount.toString(),
  //       currency,
  //       fiatCurrency: FIAT_CURRENCY.USD,
  //     };
  //   });
  //
  //   this.setState({ packages });
  // }

  handleBuyPackage = (item) => {
    const { amount } = item;
    this.setState({
      hasSelectedPackage: true, amount,
    }, () => {
      this.getCryptoPriceByAmount(amount);
    });
  }

  onItemSelectedWallet = (item) => {
    const wallet = MasterWallet.convertObject(item);

    this.setState({ walletSelected: wallet });
  }

  getListWallets = async () => {
    const { currency } = this.state;
    let walletDefault = await MasterWallet.getWalletDefault(currency);
    const wallets = MasterWallet.getWallets(currency);

    // set name + text for list:
    const listWalletCoin = [];
    if (wallets.length > 0) {
      wallets.forEach((wal) => {
        if (!wal.isCollectibles) {
          wal.text = `${wal.getShortAddress()} (${wal.name}-${wal.getNetworkName()})`;
          if (process.env.isLive) {
            wal.text = `${wal.getShortAddress()} (${wal.className} ${wal.name})`;
          }
          wal.id = `${wal.address}-${wal.getNetworkName()}${wal.name}`;
          listWalletCoin.push(wal);
        }
      });
    }

    if (!walletDefault) {
      if (listWalletCoin.length > 0) {
        walletDefault = listWalletCoin[0];
      }
    }


    if (walletDefault) {
      walletDefault.text = `${walletDefault.getShortAddress()} (${walletDefault.name}-${walletDefault.getNetworkName()})`;
      if (process.env.isLive) {
        walletDefault.text = `${walletDefault.getShortAddress()} (${walletDefault.className} ${walletDefault.name})`;
      }
      walletDefault.id = `${walletDefault.address}-${walletDefault.getNetworkName()}${walletDefault.name}`;

      // get balance for first item + update to local store:
      walletDefault.getBalance().then(result => {
        walletDefault.balance = walletDefault.formatNumber(result);
        this.setState({ walletSelected: walletDefault });
        MasterWallet.UpdateBalanceItem(walletDefault);
      });
    }

    this.setState({ wallets: listWalletCoin, walletSelected: walletDefault }, () => {
      // this.checkValid();
    });
  }

  depositCoinATM = () => {
    const { messages } = this.props.intl;

    this.setState({
      modalTitle: messages.me.credit.deposit.title,
      modalContent:
        (
          <Deposit setLoading={this.setLoading} history={this.props.history} />
        ),
    }, () => {
      this.modalRef.open();
    });
  }

  closeModal = () => {
    this.setState({ modalContent: '' });
  }

  render() {
    const { messages } = this.props.intl;
    const { hasSelectedCoin, wallets, walletSelected } = this.state;
    const { intl, isPopup } = this.props;
    const { amount, cryptoPrice } = this.props;
    const { currency, allowBuy } = this.state;
    const { issuerUrl, paReq, md, termUrl } = this.state;
    const { modalContent, modalTitle } = this.state;

    const packages = listPackages[currency];

    return (<div>
      <div className={`discover-overlay ${this.state.isLoading ? 'show' : ''}`}>
        <Image src={loadingSVG} alt="loading" width="100" />
      </div>
      {
    !hasSelectedCoin ? (
      <div className="choose-coin">
        <div className="specific-amount">
          <FormSpecificAmount onSubmit={this.handleSubmitSpecificAmount} validate={this.handleValidateSpecificAmount}>
            {/* <div className="text-right" style={{ margin: '-10px' }}><button className="btn btn-lg bg-transparent text-white d-inline-block">&times;</button></div> */}
            <div className="label-1"><FormattedMessage id="cc.label.1" /></div>
            <div className="label-2"><FormattedMessage id="cc.label.2" /></div>
            <div className="input-group mt-4">
              <Field
                name="amount"
                className="form-control form-control-lg border-0 rounded-right form-control-cc"
                type="text"
                component={fieldInput}
                onChange={this.onAmountChange}
                validate={[required]}
                elementAppend={
                  <Field
                    name="currency"
                    classNameWrapper=""
                    // defaultText={<FormattedMessage id="ex.create.placeholder.stationCurrency" />}
                    classNameDropdownToggle="dropdown-button"
                    list={listCurrency}
                    component={fieldDropdown}
                    // disabled={!enableChooseFiatCurrency}
                    onChange={this.onCurrencyChange}
                  />
                }
              />
            </div>
            <div className="input-group mt-2">
              <Field
                name="fiatAmount"
                className="form-control form-control-lg border-0 rounded-right form-control-cc"
                type="text"
                component={fieldInput}
                // onChange={this.onFiatAmountChange}
                validate={[required]}
                elementAppend={
                  <Field
                    name="fiatCurrency"
                    classNameWrapper=""
                    // defaultText={<FormattedMessage id="ex.create.placeholder.stationCurrency" />}
                    classNameDropdownToggle="dropdown-button"
                    list={listFiatCurrency}
                    component={fieldDropdown}
                    caret={false}
                  />
                }
                disabled
              />
            </div>
            <div className="mt-3 mb-3">
              <button type="submit" className="btn btn-lg btn-primary btn-block btn-submit-specific" disabled={!allowBuy}>
                <img src={iconLock} width={20} className="align-top mr-2" /><span>{EXCHANGE_ACTION_NAME[EXCHANGE_ACTION.BUY]} {amount} {CRYPTO_CURRENCY_NAME[currency]}</span>
              </button>
            </div>
          </FormSpecificAmount>
        </div>

        <div className="by-package">
          <div className="my-3 p-label-choose"><FormattedMessage id="cc.label.3" /></div>
          <div className="mb-5">
            {
              packages && packages.map((item, index) => {
                const {
                  name, amount, fiatAmount, show,
                } = item;

                return show && (
                  <div key={name}>
                    <div className="d-table w-100">
                      <div className="d-table-cell align-middle" style={{ width: '80px' }}>
                        <div className={`package p-${name}`}><FormattedMessage id={`cc.label.${name}`} /></div>
                      </div>
                      <div className="d-table-cell align-middle pl-3">
                        <div className="p-price">
                          {fiatAmount} {FIAT_CURRENCY.USD}
                          {/* {
                            saving && (
                              <span className="p-saving"><FormattedMessage id="cc.label.saving" values={{ percentage: saving }} /></span>
                            )
                          } */}
                        </div>
                        <div className="p-amount">{amount} {currency}</div>
                      </div>
                      <div className="d-table-cell align-middle text-right">
                        <button className="btn btn-p-buy-now" onClick={() => this.handleBuyPackage(item)}><FormattedMessage id="cc.btn.buyNow" /></button>
                      </div>
                    </div>
                    { index < packages.length - 1 && <hr /> }
                  </div>
                );
              })
            }
          </div>
        </div>
        <div>
          <div className={cx('ex-sticky-note', isPopup ? 'ex-sticky-note-popup' : '')}>
            <div className="mb-2"><FormattedMessage id="ex.credit.banner.text" /></div>
            <div>
              <button className="btn btn-become" onClick={this.depositCoinATM}><FormattedMessage id="ex.credit.banner.btnText" /></button>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className="credit-card">
        <div><button className="btn btn-lg bg-transparent d-inline-block btn-close" onClick={this.closeInputCreditCard}>&times;</button></div>
        <div className="wrapper">
          <FormCreditCard onSubmit={this.handleSubmit} validate={this.handleValidate}>
            {cryptoPrice && (<div>
              <div className="d-table w-100">
                <div className="d-table-cell text-normal">
                  <span className="text-normal"><FormattedMessage id="ex.label.amount" />:</span>
                    &nbsp;
                  <span className="font-weight-bold">{cryptoPrice?.amount}</span>
                    &nbsp;
                  <span className="text-normal">{cryptoPrice?.currency}</span>
                </div>
                <div className="d-table-cell text-right">
                  <span className="text-normal"><FormattedMessage id="ex.label.cost" />:</span>
                    &nbsp;
                  <span className="font-weight-bold">{cryptoPrice?.fiatAmount}</span>
                    &nbsp;
                  <span className="text-normal">{cryptoPrice?.fiatCurrency}</span>
                </div>
              </div>
            </div>
            )}

            <div className={['bodyBackup bodyShareAddress']}>
              <div className="bodyTitle">
                <span><FormattedMessage id="cc.label.receive.address" /></span>
              </div>

              <div className="box-addresses">
                <div className="box-address">
                  <div className="addressDivPopup">{ walletSelected ? walletSelected.address : ''}&nbsp;
                    <img className="expand-arrow" src={ExpandArrowSVG} alt="expand" />
                  </div>
                </div>

                <div className="box-hide-wallet">
                  <div className="receivewallet-wrapper">
                    { walletSelected &&

                    <Field
                      name="showWalletSelected"
                      component={fieldDropdown}
                      placeholder={messages.wallet.action.receive.placeholder.choose_wallet}
                      defaultText={currency}
                      list={wallets}
                      onChange={(item) => {
                        this.onItemSelectedWallet(item);
                      }
                      }
                    />
                    }
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="cc-label"><FormattedMessage id="cc.label.cardNo" /></div>
              <div>
                <Field
                  name="cc_number"
                  className="form-control input-custom w-100"
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
                    placeholder: '4111 1111 1111 1111',
                    options: {
                      creditCard: true,
                      onCreditCardTypeChanged: this.handleCCTypeChanged,
                    },
                    // type: "tel",
                    // maxLength: "19",
                    // htmlRef: input => this.ccNumberRef = input,
                  }}
                  // validate={(!isCCExisting || isNewCCOpen) ? [required] : []}
                />
              </div>
            </div>

            <div className="d-table w-100 mt-4">
              <div className="d-table-cell pr-1">
                <div className="cc-label"><FormattedMessage id="cc.label.cvv" /></div>
                <div>
                  <Field
                    name="cc_cvc"
                    className="form-control input-custom w-100"
                    component={fieldCleave}
                    propsCleave={{
                      placeholder: intl.formatMessage({ id: 'securityCode' }),
                      options: { blocks: [4], numericOnly: true },
                      // type: "password",
                      // maxLength: "4",
                      // minLength: "3",
                      // id: `cart-cvc-${this.lastUniqueId()}`,
                      // htmlRef: input => this.ccCvcRef = input,
                    }}
                    // validate={(!isCCExisting || isNewCCOpen) ? [required] : []}
                  />
                </div>
              </div>

              <div className="d-table-cell pl-1">
                <div className="cc-label"><FormattedMessage id="cc.label.expiration" /></div>
                <div>
                  <Field
                    name="cc_expired"
                    className="form-control input-custom w-100"
                    component={fieldCleave}
                    propsCleave={{
                      placeholder: intl.formatMessage({ id: 'ccExpireTemplate' }),
                      options: { blocks: [2, 2], delimiter: '/', numericOnly: true },
                      // type: "tel",
                      // id: `cart-date-${this.lastUniqueId()}`,
                      // htmlRef: input => this.ccExpiredRef = input,
                      // onKeyDown: this.ccExpiredRefKeyDown,
                    }}
                    // validate={(!isCCExisting || isNewCCOpen) ? [required] : []}
                  />
                </div>
              </div>
            </div>

            <div className="d-table w-100 mt-4">
              <div className="cc-label"><FormattedMessage id="cc.label.email" /></div>
              <div>
                <Field
                  name="cc_email"
                  className="form-control input-custom w-100"
                  component={fieldInput}
                  validate={[required, email]}
                  placeholder={intl.formatMessage({ id: 'cc.label.email.hint' })}
                />
              </div>
            </div>

            {/* <div className="mt-4 custom-control custom-checkbox">
              <Field
                id="cc-save-card"
                name="saveCard"
                type="checkbox"
                className="custom-control-input"
                component={fieldInput}
              />
              <label htmlFor="cc-save-card" className="custom-control-label"><FormattedMessage id="cc.label.saveCard" /></label>
            </div> */}

            <div className="mt-4">
              <button type="submit" className="btn btn-lg btn-primary btn-block btn-submit-cc">
                <img src={iconLock} width={18} className="align-top mr-2" /><span><FormattedMessage id="cc.btn.payNow" /></span>
              </button>
            </div>
          </FormCreditCard>
          {/* <div className="alert alert-danger mt-3">Your credit card has been declined. Please try another card</div> */}
          {/* <div className="alert alert-success">You have successfully paid</div> */}
        </div>
        <div>
          <form method="POST" action={issuerUrl} id="3dform">
            <input type="hidden" name="PaReq" value={paReq} />
            <input type="hidden" name="MD" value={md} />
            <input type="hidden" name="TermUrl" value={termUrl} />
          </form>
        </div>
      </div>
    )
      }
      <Modal title={modalTitle} onRef={modal => this.modalRef = modal} onClose={this.closeModal}>
        {modalContent}
      </Modal>
            </div>
    );
  }
}

const mapStateToProps = (state) => ({
  userProfile: state.exchange.userProfile,
  cryptoPrice: state.exchange.cryptoPrice,
  userCcLimit: state.exchange.userCcLimit,
  ccLimits: state.exchange.ccLimits || [],
  authProfile: state.auth.profile,
  amount: selectorFormSpecificAmount(state, 'amount'),
  cc_email: selectorFormCreditCard(state, 'cc_email'),
});

const mapDispatchToProps = (dispatch) => ({
  getCryptoPrice: bindActionCreators(getCryptoPrice, dispatch),
  getCryptoPriceForPackage: bindActionCreators(getCryptoPriceForPackage, dispatch),
  createCCOrder: bindActionCreators(createCCOrder, dispatch),
  getUserCcLimit: bindActionCreators(getUserCcLimit, dispatch),
  getCcLimits: bindActionCreators(getCcLimits, dispatch),
  rfChange: bindActionCreators(change, dispatch),
  showAlert: bindActionCreators(showAlert, dispatch),
  initPaymentInstantBuy: bindActionCreators(initPaymentInstantBuy, dispatch),
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(FeedCreditCard));
