import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
// service, constant
import { Grid, Row, Col } from 'react-bootstrap';
import { setHeaderRight } from '@/reducers/app/action';
import {getFiatCurrency} from '@/reducers/exchange/action';
import { bindActionCreators } from "redux";
import Modal from '@/components/core/controls/Modal';
import Checkout from './Checkout';
import ChooseWallet from './ChooseWallet';
import Overview from './Overview';
import DevDoc from './DevDoc';
import { API_URL } from "@/constants";
import { showAlert } from '@/reducers/app/action';
import { showLoading, hideLoading } from '@/reducers/app/action';
import ReactBottomsheet from 'react-bottomsheet';
import HeaderMore from './HeaderMore';
import qs from 'querystring';

// style
import './Payment.scss';
import '../Wallet/BottomSheet.scss';

class Payment extends React.Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      isShowSuccess: false,
      toAddress: "",
      fromAddress: "",
      coinName: "",
      amount: 0,
      fee: 0,
      total: 0,
      orderID: "",
      confirmURL: "",
      bottomSheet: false,
      listMenu: [],

      modalChooseWallet: '',
      modalCheckout: ''
    };
    this.props.setHeaderRight(this.headerRight());
  }

  showAlert(msg, type = 'success', timeOut = 5000, icon = '') {
    this.props.showAlert({
      message: <div className="textCenter">{icon}{msg}</div>,
      timeOut,
      type,
      callBack: () => {},
    });
  }
  showToast(mst) {
    this.showAlert(mst, 'primary', 2000);
  }
  showError(mst) {
    this.showAlert(mst, 'danger', 3000);
  }
  showSuccess(mst) {
    this.showAlert(mst, 'success', 4000, <img className="iconSuccessChecked" src={iconSuccessChecked} />);
  }
  showLoading(status) {
    this.props.showLoading({ message: '' });
  }
  hideLoading() {
    this.props.hideLoading();
  }

  componentDidMount() {
    this.checkPayNinja();
  }

  async checkPayNinja() {
    const querystring = window.location.search.replace('?', '');
    this.querystringParsed = qs.parse(querystring);
    const { order_id, amount, fiat_currency:fiatCurrency, crypto_currency:cryptoCurrency, confirm_url } = this.querystringParsed;
    if (!order_id && !amount) {
      //missing parameters
    }

    if(isNaN(amount)){
      //invalid parameters
    }

    if(cryptoCurrency){

    }
    else{
      this.setState({
        modalChooseWallet: <ChooseWallet
          amount={amount}
          fiatCurrency={fiatCurrency}
          callbackSuccess={(wallet) => { this.chosenWallet(wallet) }}
        />
        }, () => {
          this.modalChooseWalletRef.open();
        }
      );
    }
  }

  chosenWallet = async (wallet) => {
    let { order_id, amount, fiat_currency:fiatCurrency, coin, to, crypto_currency:cryptoCurrency, confirm_url } = this.querystringParsed;
    let amountCrypto = await this.getCryptoAmount(amount, fiatCurrency, wallet.name);

    if(!cryptoCurrency)
      cryptoCurrency = wallet.name;

    this.setState({
      modalCheckout: <Checkout
        wallet={wallet}
        amount={amount}
        fiatCurrency={fiatCurrency}
        amountCrypto={amountCrypto}
        cryptoCurrency={cryptoCurrency}
      />,
      modalChooseWallet: ''
      }, () => {
        this.modalChooseWalletRef.close();
        this.modalCheckoutRef.open();
      }
    );
  }

  getCryptoAmount = async (amount, fiatCurrency, cryptoCurrency) => {
    let result = 0;
    let rate = await this.getRate(fiatCurrency, cryptoCurrency);
    result = Number(amount)/rate;
    result = Math.round(result * 10000000) / 10000000; //roundup 7 decimal
    return result;
  }

  getRate(fiatCurrency, cryptoCurrency){
    return new Promise((resolve, reject) => {

      this.props.getFiatCurrency({
        PATH_URL: API_URL.EXCHANGE.GET_FIAT_CURRENCY,
        qs: {fiat_currency: fiatCurrency, currency: cryptoCurrency},
        successFn: (res) => {
          let data = res.data;
          let result = fiatCurrency == 'USD' ? data.price : data.fiat_amount;
          resolve(result);
        },
        errorFn: (err) => {
          console.error("Error", err);
          resolve(0);
        },
      });
    });
  }

  onIconRightHeaderClick = () => {
    let listMenu = this.creatSheetMenuHeaderMore();
    console.log(listMenu);
    this.setState({ listMenu: listMenu }, () => {
      console.log(this.state.listMenu);
      this.toggleBottomSheet();
    });

  }

  toggleBottomSheet() {
    const obj = (this.state.bottomSheet) ? { bottomSheet: false } : { bottomSheet: true };
    this.setState(obj);
  }

  creatSheetMenuHeaderMore() {
    const { messages } = this.props.intl;
    const obj = [];

    obj.push({
      title: messages.wallet.action.payment.menu.developer_docs,
      handler: () => {
        this.toggleBottomSheet();
        this.modalDevDocRef.open();
      },
    });
    obj.push({
      title: messages.wallet.action.payment.menu.payment_buttons,
      handler: () => {
        this.toggleBottomSheet();
        alert('not ready');
      },
    });
    obj.push({
      title: messages.wallet.action.payment.menu.help,
      handler: () => {
        this.toggleBottomSheet();
        alert('not ready');
      },
    });
    return obj;
  }

  chooseWallet = async (wallet) => {
    let fee = 0, total = 0;
    if(wallet) {
      fee = await wallet.getFee();
      total = wallet.formatNumber(Number(this.state.amount) + Number(fee), 6);
      this.setState({active: true, fee: fee, total: total});
    }
  }

  closePayNinja = () => {
    this.setState({ isShowWallets: false });
  }

  successPayNinja = (data) => {
    this.modalSendRef.close();
    this.setState({isShowSuccess: true});

    //console.log(data);
    if(data) {
      let fullBackUrl = `${this.state.confirmURL}?order_id=${this.state.orderID}&hash=${data.hash}`;
      setTimeout(() => {window.location.href = fullBackUrl}, 3000);
    }
  }

  // To address those who want the "root domain," use this function:
  extractDomain = () => {
    let url = this.state.confirmURL;
    if(!url) return "";

    var domain = function(){
      var hostname;
      if (url.indexOf("://") > -1) {
        hostname = url.split('/')[2];
      }
      else {
        hostname = url.split('/')[0];
      }

      hostname = hostname.split(':')[0];
      hostname = hostname.split('?')[0];

      return hostname;
    }();

    var splitArr = domain.split('.'),
      arrLen = splitArr.length;

    if (arrLen > 2) {
      domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
      if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
          domain = splitArr[arrLen - 3] + '.' + domain;
      }
    }

    if(!domain) domain = "{shop}"

    return domain;
  }

  headerRight() {
    return (<HeaderMore onHeaderMoreClick={() => this.onIconRightHeaderClick()} />);
  }

  showPayNinja = () => {
    const { messages } = this.props.intl;
    const { modalChooseWallet, modalCheckout } = this.state;

    return (
      <div className="checkout-wrapper">
        <Modal title="Select crypto payment" onRef={modal => this.modalChooseWalletRef = modal}  onClose={this.closePayNinja}>
          {modalChooseWallet}
        </Modal>

        <Modal title="Payment" onRef={modal => this.modalCheckoutRef = modal}  onClose={this.closePayNinja}>
          {modalCheckout}
        </Modal>
      </div>);
  }

  showOverview = () => {
    return(
      <Overview />
    )
  }

  showSuccess = () => {
    return(
      <div>
        <div className="payment-success">Ninja get back to webshop <u>{this.state.confirmURL}</u>... please wait!</div>
        {/* {
          this.state.confirmURL ? <Redirect to={{ pathname: this.state.confirmURL }} /> : ""
        } */}
      </div>
    )
  }

  render = () => {
    const { messages } = this.props.intl;
    return (

      <div>
        {
          !this.state.isShowWallets && !this.state.isShowSuccess ? this.showOverview() : ""
        }
        {
          this.state.isShowSuccess ? this.showSuccess() : ""
        }

        <Grid>
          <ReactBottomsheet
            visible={this.state.bottomSheet}
            appendCancelBtn={false}
            onClose={this.toggleBottomSheet.bind(this)}
            list={this.state.listMenu}
          />
        </Grid>

        <Modal title="Developer Documents" onRef={modal => this.modalDevDocRef = modal}>
          <DevDoc />
        </Modal>


      {/* <div className="shop-info">
          <div className="order">Order # {this.state.orderID}</div>
          <div className="shop">{this .extractDomain()}</div>
        </div>

        <div className="order-info">
          <div className="label">Payment Amount</div>
          <div className="key">{this.state.amount} {this.state.coinName}</div>
          <div className="clearfix"></div>
          <div className="label">Transaction Fee</div>
          <div className="key">{this.state.fee} {this.state.coinName}</div>
          <div className="clearfix"></div>
          <div className="label bold">Total</div>
          <div className="key bold">{this.state.total} {this.state.coinName}</div>
        </div>
      */}

        {
          this.showPayNinja()
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
  getFiatCurrency: bindActionCreators(getFiatCurrency, dispatch),
  setHeaderRight,
  showAlert,
  showLoading,
  hideLoading
});



export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Payment));
