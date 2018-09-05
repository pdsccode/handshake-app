import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { API_URL, CRYPTO_CURRENCY, EXCHANGE_ACTION, FIAT_CURRENCY, MIN_AMOUNT, NB_BLOCKS, URL } from '@/constants';
import createForm from '@/components/core/form/createForm';
import { change, Field } from 'redux-form';
import './Deposit.scss';
import { fieldInput } from '@/components/core/form/customField';
import iconPaypal from '@/assets/images/icon/icons8-paypal.svg';
import { formatMoneyByLocale } from '@/services/offer-util';
import { isNormalInteger, minValue, number, required } from '@/components/core/form/validation';
import { bindActionCreators } from 'redux';
import {
  createCreditATM,
  depositCoinATM,
  getCreditATM,
  trackingDepositCoinATM,
  withdrawCashDepositATM,
} from '@/reducers/exchange/action';
import { getErrorMessageFromCode } from '@/components/handshakes/exchange/utils';
import { hideLoading, showAlert, showLoading } from '@/reducers/app/action';
import { MasterWallet } from '@/services/Wallets/MasterWallet';

import './CommonStyle.scss';
import './Withdraw.scss';

const nameFormEscrowWithdraw = 'escrowWithdraw';
const FormEscrowWithdraw = createForm({
  propsReduxForm: {
    form: nameFormEscrowWithdraw,
  },
});

class EscrowWithdraw extends React.Component {
  showLoading = () => {
    this.props.setLoading(true);
  }

  hideLoading = () => {
    this.props.setLoading(false);
  }

  handleWithdraw = (values) => {
    console.log('handleWithdraw', values);
    this.showLoading();
    const offer = {};

    this.props.withdrawCashDepositATM({
      PATH_URL: API_URL.EXCHANGE.WITHDRAW_CASH_DEPOSIT_ATM,
      data: offer,
      METHOD: 'POST',
      successFn: this.handleWithdrawCashSuccess,
      errorFn: this.handleWithdrawCashFailed,
    });
  }

  handleWithdrawCashSuccess = async (res) => {
    console.log('handleWithdrawCashSuccess', res);

    this.hideLoading();

    this.props.history.push(URL.ESCROW_WITHDRAW_SUCCESS);
  }

  handleWithdrawCashFailed = (e) => {
    console.log('handleWithdrawCashFailed', e);
    this.hideLoading();

    this.props.showAlert({
      message: <div className="text-center">{getErrorMessageFromCode(e)}</div>,
      timeOut: 3000,
      type: 'danger',
    });
  }


  render() {
    const { messages } = this.props.intl;
    const { intl, hideNavigationBar } = this.props;
    const { listOfferPrice } = this.props;

    return (
      <div className="escrow-withdraw">
        {/* <div> */}
        {/* <button className="btn btn-lg bg-transparent d-inline-block btn-close"> */}
        {/* &times; */}
        {/* </button> */}
        {/* </div> */}
        <div className="wrapper font-weight-normal">
          <FormEscrowWithdraw onSubmit={this.handleWithdraw}>
            {/* <h4 className="font-weight-bold">Withdraw money</h4> */}
            <div className="d-table w-100 mt-4">
              <div className="d-table-cell escrow-label">{messages.me.credit.withdraw.yourBalance}</div>
              <div className="d-table-cell text-right">
                <span className="blue-text font-weight-bold">$</span> 22,567,291
              </div>
            </div>

            <div className="mt-4">
              <div className="escrow-label">{messages.me.credit.withdraw.yourPapalName}</div>
              <div>
                <Field
                  name="paypal-username"
                  className="form-control w-100"
                  type="text"
                  component={fieldInput}
                  validate={[required]}
                />
              </div>
            </div>

            <div className="mt-4">
              <div className="escrow-label">{messages.me.credit.withdraw.amount}</div>
              <div>
                <Field
                  name="amount"
                  className="form-control w-100"
                  type="text"
                  component={fieldInput}
                  validate={[number, required]}
                />
              </div>
            </div>

            <div className="mt-4">
              <button
                type="submit"
                className="btn btn-block btn-escrow-primary"
              >
                <img src={iconPaypal} className="mr-2" width={20} />
                <span>{messages.me.credit.withdraw.buttonTitle}</span>
              </button>
            </div>
            <div className="text-center mt-2">
              <small className="escrow-label">
                {messages.me.credit.withdraw.description}
              </small>
            </div>
          </FormEscrowWithdraw>
        </div>
      </div>
    );
  }
}

const mapState = state => ({
  depositInfo: state.exchange.depositInfo,
});

const mapDispatch = dispatch => ({
  showAlert: bindActionCreators(showAlert, dispatch),
  rfChange: bindActionCreators(change, dispatch),
  withdrawCashDepositATM: bindActionCreators(withdrawCashDepositATM, dispatch),
});

export default injectIntl(connect(mapState, mapDispatch)(EscrowWithdraw));
