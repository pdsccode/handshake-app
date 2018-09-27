import React, { Component } from 'react';
import { BANK_INFO, API_URL } from '@/constants';
import PropTypes from 'prop-types';
import ImageUploader from '@/components/handshakes/exchange/components/ImageUploader';
import { connect } from 'react-redux';
import { uploadReceipAtmCashTransfer } from '@/reducers/exchange/action';
import loadingSVG from '@/assets/images/icon/loading.gif';
import Image from '@/components/core/presentation/Image';
import { showAlert } from '@/reducers/app/action';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { injectIntl } from 'react-intl';
import iconCopy from '@/assets/images/icon/icon-copy-white.svg';
import iconUpload from '@/assets/images/icon/icon-upload-white.svg';
import './styles.scss';

const DATA_TEMPLATE = {
  AMOUNT: { intlKey: 'amount', text: '--- USD', className: 'money' },
  'ACCOUNT NAME': { intlKey: 'account_name', text: BANK_INFO.ACCOUNT_NAME },
  'ACCOUNT NUMBER': { intlKey: 'account_number', text: BANK_INFO.ACCOUNT_NUMBER, copyable: true },
  'BANK NAME': { intlKey: 'bank_name', text: BANK_INFO.BANK_NAME, copyable: true },
  'BANK ID': { intlKey: 'bank_id', text: BANK_INFO.BANK_ID, copyable: true },
  'REFERENCE CODE': { intlKey: 'reference_code', text: '---', className: 'reference-code', copyable: true },
};

class AtmCashTransferInfo extends Component {
  constructor() {
    super();
    this.state = {
      data: DATA_TEMPLATE,
      showUploader: false,
      uploaded: false,
      imgUploaded: null,
      isLoading: false,
    };

    this.uploader = React.createRef();
    this.modalRef = null;

    this.onUpload = :: this.onUpload;
    this.onUploaded = :: this.onUploaded;
    this.onDone = :: this.onDone;
    this.saveReceipt = :: this.saveReceipt;
    this.copied = :: this.copied;
  }

  static getDerivedStateFromProps({ receipt }, prevState) {
    const newData = { ...prevState?.data };
    const { amount, fiatCurrency, referenceCode } = receipt;
    amount && fiatCurrency && (newData.AMOUNT.text = `${amount} ${fiatCurrency}`);
    referenceCode && (newData['REFERENCE CODE'].text = referenceCode);
    return { data: newData };
  }

  onUpload() {
    this.setState({ showUploader: true }, () => {
      // get uploader instance
      const uploaderInstance = this?.uploader?.current?.getWrappedInstance()?.getWrappedInstance();
      uploaderInstance.onOpenClick();
    });
  }

  onUploaded(res) {
    const imgUploaded = res && res[0];
    this.setState({ uploaded: true, imgUploaded }, this.saveReceipt);
  }

  onDone() {
    if (typeof this.props.onDone === 'function') {
      typeof this.props.onDone();
    }
  }

  saveReceipt() {
    this.showLoading(true);
    const { receipt } = this.props;
    const { imgUploaded } = this.state;
    const data = {
      receipt_url: imgUploaded.url,
    };
    this.props.uploadReceipAtmCashTransfer({
      PATH_URL: `${API_URL.EXCHANGE.SEND_ATM_CASH_TRANSFER}/${receipt.referenceCode}`,
      METHOD: 'PUT',
      data,
      successFn: () => {
        this.showLoading(false);
      },
      errorFn: () => {
        this.showLoading(false);
      },
    });
  }

  showLoading(isLoading = false) {
    this.setState({
      isLoading,
    });
  }

  copied() {
    const { messages: { atm_cash_transfer } } = this.props.intl;
    this.props.showAlert({
      message: atm_cash_transfer.copied,
      timeOut: 3000,
      isShowClose: true,
      type: 'success',
      callBack: () => { },
    });
  }

  renderCopyIcon(text) {
    return (
      <CopyToClipboard text={text} onCopy={this.copied}>
        <div className="copy-icon"><img alt="copy-icon" src={iconCopy} /></div>
      </CopyToClipboard>
    );
  }

  renderInfo() {
    const { data } = this.state;
    const { messages: { atm_cash_transfer_info } } = this.props.intl;
    return (
      <React.Fragment>
        {Object.entries(data).map(([name, value]) => (
          <div key={name} className="row-item info-item">
            <div>
              <span className="title">{atm_cash_transfer_info[value.intlKey]}</span>
            </div>
            <div>
              <span className={`value ${value.className && value.className}`}>{value.text}</span>
              {value.copyable && this.renderCopyIcon(value.text)}
            </div>
          </div>
        ))}
      </React.Fragment>
    );
  }

  render() {
    const { showUploader, uploaded } = this.state;
    const { messages: { atm_cash_transfer_info } } = this.props.intl;
    return (
      <div className="transaction-info-container">
        <div className={`discover-overlay ${this.state.isLoading ? 'show' : ''}`}>
          <Image src={loadingSVG} alt="loading" width="100" />
        </div>
        <div className="item">
          <div className="row-item payment-detail">
            <div>
              <span className="title">{atm_cash_transfer_info.payment_detail}</span>
            </div>
            <div>
              <span className="text">{atm_cash_transfer_info.order_will_expire_in}<span className="time">30:00</span></span>
            </div>
          </div>
        </div>
        <div className="item info-group">
          {this.renderInfo()}
        </div>
        <div className="item notice">
          <span className="notice-tilte">{atm_cash_transfer_info.important}</span>
          <span className="notice-desc">{atm_cash_transfer_info.notice_desc}</span>
        </div>
        <div className="item">
          { showUploader &&
            <ImageUploader
              className="uploader-zone"
              ref={this.uploader}
              onSuccess={this.onUploaded}
              imgSample={null}
              multiple={false}
            />
          }
          {
            uploaded ?
              <button className="btn btn-upload-receipt" onClick={this.onDone}>{atm_cash_transfer_info.done_btn}</button> :
              <button className="btn btn-upload-receipt" onClick={this.onUpload}>
                <img src={iconUpload} height="10px" alt="upload receipt" />
                {atm_cash_transfer_info.upload_btn}
              </button>
          }
        </div>
      </div>
    );
  }
}

AtmCashTransferInfo.defaultProps = {
  /* eslint react/default-props-match-prop-types:0 */
  receipt: {},
};

AtmCashTransferInfo.propTypes = {
  /* eslint react/no-unused-prop-types:0 */
  receipt: PropTypes.object.isRequired,
  uploadReceipAtmCashTransfer: PropTypes.func.isRequired,
  onDone: PropTypes.func.isRequired,
  showAlert: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};
export default injectIntl(connect(null, { uploadReceipAtmCashTransfer, showAlert })(AtmCashTransferInfo));
