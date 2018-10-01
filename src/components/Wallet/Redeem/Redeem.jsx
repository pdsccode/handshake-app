import React from 'react';
import { FormattedDate, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { hideLoading, showAlert, showLoading } from '@/reducers/app/action';
import Image from '@/components/core/presentation/Image';
import ExpandArrowSVG from '@/assets/images/icon/expand-arrow.svg';
import { referredInfo } from '@/reducers/auth/action';
import { StringHelper } from '@/services/helper';
import './Redeem.scss';
import local from '@/services/localStore';
import { APP } from '@/constants';
import { getReferalInfo } from '@/reducers/exchange/action';
import { shortenUser } from '@/services/offer-util';
import Button from '@/components/core/controls/Button';
import Input from '../Input';

window.Clipboard = (function (window, document, navigator) {
  let textArea,
    copy;

  function isOS() {
    return navigator.userAgent.match(/ipad|iphone/i);
  }

  function createTextArea(text) {
    textArea = document.createElement('textArea');
    textArea.value = text;
    document.body.appendChild(textArea);
  }

  function selectText() {
    let range,
      selection;
    if (isOS()) {
      range = document.createRange();
      range.selectNodeContents(textArea);
      selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      textArea.setSelectionRange(0, 999999);
    } else {
      textArea.select();
    }
  }

  function copyToClipboard() {
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }

  copy = function (text) {
    createTextArea(text);
    selectText();
    copyToClipboard();
  };
  return { copy };
}(window, document, navigator));

class Redeem extends React.Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {

      giftcardValue: 0,
      cryptoValue: "",

      code: '',
      isLoading: false
    };
  }


  showAlert(msg, type = 'success', timeOut = 3000, icon = '') {
    this.props.showAlert({
      message: <div className="textCenter">{icon}{msg}</div>,
      timeOut,
      type,
      callBack: () => {
      },
    });
  }

  showToast(mst) {
    this.showAlert(mst, 'primary', 3000);
  }

  showLoading(status) {
    this.props.showLoading({ message: '' });
  }

  hideLoading() {
    this.props.hideLoading();
  }

  showLoading = () => {
    this.props.showLoading({ message: '' });
  }

  hideLoading = () => {
    this.props.hideLoading();
  }


  render() {
    const { messages } = this.props.intl;
    const { referalInfo } = this.props;

    return (
     <div className="redeem-page">
        <div className="title">{this.messages.wallet.action.redeem.title}</div>
        <div className="body">
            <div>
              <Input required placeholder={this.messages.wallet.action.redeem.your_code} maxLength="40" value={this.state.walletName} onChange={(value) => {this.handleWalletNameChange(value)}} /> 
            </div>         
            <div><span>{this.messages.wallet.action.redeem.giftcard}:</span> <span>${this.state.giftcardValue}</span></div>         
            <div><span>{this.messages.wallet.action.redeem.value}:</span> <span>{this.state.cryptoValue}</span></div>         
            <div>
              {this.messages.wallet.action.redeem.agree_text}
            </div>
            <div>
              <Button>{this.messages.wallet.action.redeem.button_redeem}</Button>
            </div>
        </div>
     </div>
    );
  }
}

const mapStateToProps = (state) => ({
  referalInfo: state.exchange.referalInfo,
});

const mapDispatchToProps = (dispatch) => ({
  showAlert: bindActionCreators(showAlert, dispatch),
  showLoading: bindActionCreators(showLoading, dispatch),
  hideLoading: bindActionCreators(hideLoading, dispatch),  
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Redeem));
