import React from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import {
  API_URL,
  CRYPTO_CURRENCY,
  EXCHANGE_ACTION,
  FIAT_CURRENCY,
  MIN_AMOUNT,
  NB_BLOCKS,
  URL
} from "@/constants";
import { change, Field } from "redux-form";
import "./Deposit.scss";
import { fieldInput } from "@/components/core/form/customField";
import iconPaypal from "@/assets/images/icon/icons8-paypal.svg";
import { formatMoneyByLocale } from "@/services/offer-util";
import {
  isNormalInteger,
  minValue,
  number,
  required
} from "@/components/core/form/validation";
import { bindActionCreators } from "redux";
import {
  createCreditATM,
  depositCoinATM,
  getCreditATM,
  trackingDepositCoinATM
} from "@/reducers/exchange/action";
import { getErrorMessageFromCode } from "@/components/handshakes/exchange/utils";
import { hideLoading, showAlert, showLoading } from "@/reducers/app/action";
import { MasterWallet } from "@/services/Wallets/MasterWallet";

import bgWithdrawSuccessfully from '@/assets/images/cash/escrow-withdraw-success.svg';

import "./CommonStyle.scss";
import "./WithdrawSuccess.scss";

class EscrowWithdrawSuccess extends React.Component {
  backToDashboard = () => {
    this.props.history.push(URL.HANDSHAKE_ME);
  }

  render() {
    const { messages } = this.props.intl;
    const { intl, hideNavigationBar } = this.props;
    const { listOfferPrice } = this.props;

    return (
      <div className="escrow-withdraw-success">
        <div>
          <div className="w-50" style={{ paddingTop: '151px', paddingBottom: '100px' }}>
            <h4 className="font-weight-bold">{messages.me.credit.withdrawSuccess.description}</h4>
            <div className="escrow-label">
              {messages.me.credit.withdrawSuccess.descriptionTransfer}
            </div>
          </div>
          <div className="background">
            <img src={bgWithdrawSuccessfully} />
          </div>
        </div>
        <div className="mt-4">
          <button className="btn btn-block btn-escrow-primary" onClick={this.backToDashboard}>
            <span>&larr; {messages.me.credit.withdrawSuccess.buttonTitle}</span>
          </button>
        </div>
      </div>
    );
  }
}

const mapState = state => ({
  depositInfo: state.exchange.depositInfo
});

const mapDispatch = dispatch => ({
  rfChange: bindActionCreators(change, dispatch)
});

export default injectIntl(
  connect(mapState, mapDispatch)(EscrowWithdrawSuccess)
);
