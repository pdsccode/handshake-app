import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import Modal from '@/components/core/controls/Modal';
import Checkout from './Checkout';
import Overview from './Overview';
import { setHeaderRight } from '@/reducers/app/action';
import { showAlert } from '@/reducers/app/action';
import { showLoading, hideLoading } from '@/reducers/app/action';
import qs from 'querystring';

// style
import './Payment.scss';

class Payment extends React.Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      //isShowWallets: false,
      isShowSuccess: false,
      toAddress: "",
      fromAddress: "",
      coinName: "",
      amount: 0,
      fee: 0,
      active: false,
      orderID: "",
      confirmURL: "",
    };

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
    const { order_id, amount, coin, ca, sa, confirm_url } = this.querystringParsed;
    if (order_id && amount && sa && coin) {
      //let fee = await wallet.getFee();
      this.setState({active: true, fee: 0, toAddress: sa, fromAddress: ca, amount: !isNaN(amount) ? amount : 0,
        coinName: coin.toUpperCase(), orderID: order_id, confirmURL: confirm_url}, () => {
          this.modalSendRef.open();
        }
      );
    }
  }

  closePayNinja = () => {
    this.setState({ isShowWallets: false });
  }

  successPayNinja = () => {
    this.modalSendRef.close();
    this.setState({isShowSuccess: true});

    let fullBackUrl = `${this.state.confirmURL}?order_id=${this.state.orderID}&status=0&hash=`;
    setTimeout(() => {window.location.href = fullBackUrl}, 3000);
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
    return domain;
  }

  showPayNinja = () => {
    const { messages } = this.props.intl;
    return (
      <Modal title="Pay with Ninja" onRef={modal => this.modalSendRef = modal}  onClose={this.closePayNinja}>
        <div className="shop-info">
          <div className="order">Order # {this.state.orderID}</div>
          <div className="shop">{this.extractDomain()}</div>

        </div>
        <div className="order-info">
          <div className="label">Payment Amount</div>
          <div className="key">{this.state.amount} {this.state.coinName}</div>
          <div className="clearfix"></div>
          <div className="label">Network Cost</div>
          <div className="key">{this.state.fee} {this.state.coinName}</div>
          <div className="clearfix"></div>
          <div className="label bold">Total</div>
          <div className="key bold">{this.state.amount} {this.state.coinName}</div>
        </div>
        <Checkout isShowWallets={true} active={this.state.active}  toAddress={this.state.toAddress} fromAddress={this.state.fromAddress} amount={this.state.amount} coinName={this.state.coinName} onFinish={() => { this.successPayNinja() }} />
      </Modal>);
  }

  showOverview = () => {
    return(
      <Overview />
    )
  }

  showSuccess = () => {
    return(
      <div>
        <div className="payment-success">Ninja get back to webshop {this.state.confirmURL}... please wait!</div>
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
          this.showPayNinja()
        }
        {
          !this.state.isShowWallets && !this.state.isShowSuccess ? this.showOverview() : ""
        }
        {
          this.state.isShowSuccess ? this.showSuccess() : ""
        }
      </div>
    );
  }
}

const mapState = (state) => ({

});

const mapDispatch = ({
  setHeaderRight,
  showAlert,
  showLoading,
  hideLoading
});


export default injectIntl(connect(mapState, mapDispatch)(Payment));
