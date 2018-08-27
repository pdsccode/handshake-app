import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { connect } from "react-redux";
import { URL } from "@/constants";
import createForm from "@/components/core/form/createForm";
import { Field } from "redux-form";
import "./Deposit.scss";
import { fieldInput } from "@/components/core/form/customField";

const nameFormEscrowDeposit = "escrowDeposit";
const FormEscrowDeposit = createForm({
  propsReduxForm: {
    form: nameFormEscrowDeposit
  }
});

import iconBitcoin from '@/assets/images/icon/coin/btc.svg';
import iconEthereum from '@/assets/images/icon/coin/eth.svg';
import iconBitcoinCash from '@/assets/images/icon/coin/bch.svg';
import iconUsd from '@/assets/images/icon/coin/icons8-us_dollar.svg';
import iconLock from '@/assets/images/icon/icons8-lock_filled.svg';

class EscrowDeposit extends React.Component {

  handleOnSubmit = (values) => {
    console.log(values)
  }
  render() {
    const { messages } = this.props.intl;
    const { intl, hideNavigationBar } = this.props;

    const coins = [
      {
        name: "eth",
        icon: iconEthereum
      },
      {
        name: "btc",
        icon: iconBitcoin
      },
      {
        name: "bch",
        icon: iconBitcoinCash
      }
    ];
    return (
      <div className="escrow-deposit">
        <div>
          <button className="btn btn-lg bg-transparent d-inline-block btn-close">
            &times;
          </button>
        </div>
        <div className="wrapper">
          <h4>
            <FormattedMessage id="escrow.label.depositCoin" />
          </h4>
          <div>
            <FormEscrowDeposit onSubmit={this.handleOnSubmit}>
              <div>
                <div className="d-inline-block w-50 escrow-label">
                  <FormattedMessage id="escrow.label.iWantTo" />
                </div>
                <div className="d-inline-block w-50 escrow-label">
                  <FormattedMessage id="escrow.label.price" />
                </div>
              </div>
              {coins.map(coin => {
                const { name, icon } = coin;
                return (
                  <div key={name} className="mt-2">
                    <div className="d-inline-block w-50 pr-2">
                      <div style={{ position: 'relative' }}>
                        <Field
                          name={name}
                          className="form-control form-deposit-custom"
                          type="text"
                          component={fieldInput}
                          elementPrepend={
                            <img src={icon} className="icon-deposit" />
                          }
                        />
                      </div>
                    </div>
                    <div className="d-inline-block w-50 pl-2 bg-light rounded" style={{ lineHeight: '38px' }}>
                      <span className="font-weight-normal">7,232,233</span>
                      <span className="escrow-label float-right mr-2 font-weight-normal">USD/{name.toUpperCase()}</span>
                    </div>
                  </div>
                );
              })}
              <div className="mt-3">
                <div className="w-75 d-inline-block align-middle">
                  <div className="font-weight-normal"><FormattedMessage id="escrow.label.yourSellingPrice" /></div>
                  <div className="escrow-label">
                    <FormattedMessage id="escrow.label.sellingPriceCaption" />
                  </div>
                </div>
                <div className="w-25 d-inline-block align-middle">
                  <div style={{ position: 'relative' }}>
                    <Field
                      name="percentage"
                      className="form-control pr-4"
                      type="tel"
                      component={fieldInput}
                      elementAppend={
                        <span className="percentage-symbol escrow-label font-weight-normal">%</span>
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <button type="submit" className="btn btn-primary btn-block">
                  <img src={iconLock} width={16} className="align-top mr-2" />
                  <FormattedMessage id="escrow.btn.depositNow" />
                </button>
              </div>
            </FormEscrowDeposit>
          </div>
        </div>
      </div>
    );
  }
}

const mapState = state => ({
  // discover: state.discover,
});

const mapDispatch = dispatch => ({
  // rfChange: bindActionCreators(change, dispatch),
});

export default injectIntl(connect(null, null)(EscrowDeposit));
