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
import ModalDialog from '@/components/core/controls/ModalDialog';
import Checkout from './Checkout';
import ChooseCrypto from './ChooseCrypto';
import Complete from './Complete';
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
      orderID: "",
      confirmURL: "",
      bottomSheet: false,
      listMenu: [],

      modalChooseCrypto: '',
      modalCheckout: '',
      modalComplete: '',
      msgError: '',
      toAddresses: false,
      fullBackUrl: ''
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
    //this.successPayNinja();
  }

  async checkPayNinja() {
    const querystring = window.location.search.replace('?', '');
    this.querystringParsed = qs.parse(querystring);
    const { order_id, to, amount, fiat_currency:fiatCurrency, crypto_currency:cryptoCurrency, confirm_url } = this.querystringParsed;


    if (!order_id && !amount && !confirm_url) {
      return;
    }

    if (!order_id || !amount && !confirm_url) {
      this.showModalError("Missing parameters");
      return;
    }

    if(isNaN(amount) || amount <= 0){
      this.showModalError("Invalid amount");
      return;
    }

    let toAddresses = this.getToAdresses(to);
    if(toAddresses){
      this.setState({toAddresses: toAddresses});
    }
    else{
      this.showModalError("Not found destination address to checkout");
      return;
    }

    if(cryptoCurrency){

    }
    else{
      let fullBackUrl = `${confirm_url}?order_id=${order_id}&status=0`;
      this.setState({
        fullBackUrl: fullBackUrl,
        modalChooseCrypto: <ChooseCrypto
          amount={amount}
          fiatCurrency={fiatCurrency}
          toCrypto={toAddresses}
          callbackSuccess={(name) => { this.chosenWallet(name) }}
        />
        }, () => {
          this.modalChooseCryptoRef.open();
        }
      );
    }
  }

  showModalError = (msg) => {
    this.setState({msgError: msg}, ()=> {
      this.modalErrorRef.open();
    });
  }

  chosenWallet = async (crypto) => {
    let { order_id, amount, fiat_currency:fiatCurrency, coin, to, crypto_currency:cryptoCurrency } = this.querystringParsed;
    let amountCrypto = await this.getCryptoAmount(amount, fiatCurrency, crypto);


    if(!cryptoCurrency)
      cryptoCurrency = crypto;

    let toAddress = this.getToAddress(cryptoCurrency);
    this.setState({
      modalCheckout: <Checkout
        amount={amount}
        fiatCurrency={fiatCurrency}
        amountCrypto={amountCrypto}
        toAddress={toAddress}
        cryptoCurrency={cryptoCurrency}
        onFinish={result => { this.successPayNinja(result); }}
      />,
      modalChooseCrypto: ''
      }, () => {
        this.modalChooseCryptoRef.close();
        this.modalCheckoutRef.open();
      }
    );
  }

  backChooseCrypto = () => {
    this.setState({modalCheckout: ''});
    this.checkPayNinja();
  }

  tryAgainPayment= () => {
    this.modalCompleteRef.close();
    this.setState({modalComplete: ''});
    this.checkPayNinja();
  }

  getToAdresses = (to) =>{
    let arr = false;
    if(to){
      arr = [];
      to.split(',').forEach(item => {
        let arrItem = item.split(':');
        if(arrItem && arrItem.length > 1){
          arr.push({name: arrItem[0].trim(), address: arrItem[1].trim()});
        }
      });
    }

    return arr;
  }

  getToAddress = (cryptoCurrency) => {
    const toAddresses = this.state.toAddresses;
    let result = '';
    if(toAddresses){
      for(var item of toAddresses){
        if(item.name == cryptoCurrency){
          result = item.address;
          break;
        }
      }
    }

    return result;
  }

  getCryptoAmount = async (amount, fiatCurrency, cryptoCurrency) => {
    let result = 0;
    let rate = await this.getRate(fiatCurrency, cryptoCurrency);
    result = Number(amount)/rate;
    if(result >= 1000){
      result = Math.round(result * 100) / 100; //roundup 2 decimal
    }
    else{
      result = Math.round(result * 10000000) / 10000000; //roundup 7 decimal
    }
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
    this.setState({ listMenu: listMenu }, () => {
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

  closeChooseCrypto = () => {
    if(this.state.fullBackUrl && this.state.modalChooseCrypto){
      window.location.href = this.state.fullBackUrl;
    }
    else{
      this.setState({ isShowWallets: false });
    }
  }

  successPayNinja = (data) => {

    this.setState({
      modalComplete: <Complete
        data={data}
        tryAgain={() => this.tryAgainPayment()}
      />,
      modalCheckout: ''
      }, () => {
        this.modalCompleteRef.open();
      }
    );
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
    const { modalChooseCrypto, modalCheckout, modalComplete } = this.state;

    return (
      <div className="checkout-wrapper">
        <Modal title="Select crypto payment" onRef={modal => this.modalChooseCryptoRef = modal}  onClose={() => this.closeChooseCrypto()}>
          {modalChooseCrypto}
        </Modal>

        <Modal title="Payment" onRef={modal => this.modalCheckoutRef = modal} onClose={this.backChooseCrypto}>
          {modalCheckout}
        </Modal>

        <Modal title="Error" onRef={modal => this.modalErrorRef = modal}>
          <div className="msg-error">{this.state.msgError}</div>
        </Modal>

        <ModalDialog className="complete-wrapper" title="Complete crypto payment" onRef={modal => this.modalCompleteRef = modal}>
          {modalComplete}
        </ModalDialog>
      </div>);
  }

  showOverview = () => {
    return(
      <Overview />
    )
  }

  render = () => {
    const { messages } = this.props.intl;
    return (

      <div>
        {
          !this.state.isShowWallets ? this.showOverview() : ""
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
