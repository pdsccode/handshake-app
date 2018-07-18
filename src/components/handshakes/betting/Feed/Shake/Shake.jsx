import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { connect } from 'react-redux';

// service, constant
import { shakeItem, initHandshake, } from '@/reducers/handshake/action';
import {HANDSHAKE_ID, API_URL, APP } from '@/constants';
import GA from '@/services/googleAnalytics';

// components
import Button from '@/components/core/controls/Button';
import {showAlert} from '@/reducers/app/action';
import {getMessageWithCode, getChainIdDefaultWallet,
     getEstimateGas, getAddress, isExistMatchBet, parseBigNumber , } from '@/components/handshakes/betting/utils.js';
import { validateBet } from '@/components/handshakes/betting/validation.js';
import { MESSAGE } from '@/components/handshakes/betting/message.js';
import { BetHandshakeHandler } from '@/components/handshakes/betting/Feed/BetHandshakeHandler';
import { SIDE } from '@/components/handshakes/betting/constants.js';


import './Shake.scss';


const betHandshakeHandler = BetHandshakeHandler.getShareManager();


const titleBySide = { 1: 'Bet for the outcome', 2: 'Bet against the outcome' };
const ROUND = 1000000;
const ROUND_ODD = 10;
class BetingShake extends React.Component {
  static propTypes = {
    side: PropTypes.number.isRequired,
    outcomeId: PropTypes.number.isRequired,
    outcomeHid: PropTypes.number.isRequired,
    matchName: PropTypes.string.isRequired,
    matchOutcome: PropTypes.string.isRequired,
    marketSupportOdds: PropTypes.number.isRequired,
    marketAgainstOdds: PropTypes.number.isRequired,
    amountSupport: PropTypes.number.isRequired,
    amountAgainst: PropTypes.number.isRequired,
    closingDate: PropTypes.any.isRequired,
    reportTime: PropTypes.any.isRequired,
    onSubmitClick: PropTypes.func,
    onCancelClick: PropTypes.func,
    onCreateBetSuccess: PropTypes.func,
  }

  static defaultProps = {
    outcomeId: -1,
    onSubmitClick: undefined,
    onCancelClick: undefined,
  };

  constructor(props) {
    super(props);

    this.state = {
      buttonClass: 'btnOK btnBlue',
      isShowOdds: true,
      extraData: {},
      isChangeOdds: false,
      marketOdds: 0,
      oddValue: 0,
      amountValue: 0,
      winValue: 0,
      disable: false,
      estimateGas: 0,
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  async componentWillMount() {
    const estimateGas = await getEstimateGas();
    this.setState({
      estimateGas,
    });
  }

  async componentWillReceiveProps(nextProps) {
    const {
      marketSupportOdds,
      marketAgainstOdds,
      side,
      amountSupport,
      amountAgainst,
      isOpen,
    } = nextProps;
    const marketOdds = (side === SIDE.SUPPORT) ? marketSupportOdds : marketAgainstOdds;
    const marketAmount = (side === SIDE.SUPPORT) ? amountSupport : amountAgainst;
    const winValue = parseBigNumber(marketAmount).times(parseBigNumber(marketOdds)).toNumber() || 0;
    const roundMarketAmount = Math.floor(marketAmount * ROUND) / ROUND;
    const estimateGas = await getEstimateGas();

    this.setState({
      oddValue: Math.floor(marketOdds * ROUND_ODD) / ROUND_ODD,
      amountValue: roundMarketAmount,
      winValue: Math.floor(winValue * ROUND) / ROUND,
      disable: !isOpen,
      estimateGas,
    });

    if (nextProps.orderClick) {
      this.onSubmit();
    }
  }

  onSubmit = async (e) => {
    console.log("Submit");
    e.preventDefault();
    const values = this.refs;
    console.log('Values:', values);
    this.setState({
      disable: true,
    });

    const {matchName, matchOutcome, side, closingDate} = this.props;
    const amount = parseBigNumber(values.amount.value);
    const odds = parseBigNumber(values.odds.value);

    console.log("Amount, Side, Odds", amount?.toNumber(), side, odds?.toNumber());


    // send event tracking
    try {
      GA.clickGoButton(matchName, matchOutcome, side);
    } catch (err) { }

    const validate = await validateBet(amount, odds, closingDate, matchName, matchOutcome);
    const { status, message } = validate;
    if (status) {
      this.initHandshake(amount, odds);
      this.props.onSubmitClick();

    } else {
      if(message){
        this.props.showAlert({
          message: <div className="text-center">{message}</div>,
          timeOut: 3000,
          type: 'danger',
          callBack: () => {
          }
        });


      }
      this.props.onCancelClick();
    }
  }

  onCancel = () => {
    console.log('Cancel')
    this.props.onCancelClick();
  }

  onToggleChange = (id) => {
    const { isChangeOdds } = this.state;
    const { marketAgainstOdds, marketSupportOdds, side } = this.props;
    const marketOdds = side === SIDE.SUPPORT ? marketSupportOdds : marketAgainstOdds;

    if (!isChangeOdds) {
      this.setState({
        oddValue: Math.floor(parseFloat(marketOdds) * ROUND_ODD) / ROUND_ODD
      })
    }
    this.setState({ buttonClass: `btnOK ${side === 1 ? 'btnBlue' : 'btnRed'}` });
  }

  updateTotal = () => {
    const { oddValue, amountValue } = this.state;
    const total = oddValue * amountValue;
    this.setState({
      winValue: Math.floor(total * ROUND) / ROUND,
    });
  }

  initHandshake = (amount, odds) => {
    const { outcomeId, matchName, matchOutcome, side } = this.props;
    const { extraData } = this.state;
    //const side = this.toggleRef.value;
    const fromAddress = getAddress();
    extraData["event_name"] = matchName;
    extraData["event_predict"] = matchOutcome;
    extraData["event_odds"] = odds;
    extraData["event_bet"] = amount;
    console.log('Extra Data:', extraData);
    const params = {
      type: HANDSHAKE_ID.BETTING,
      outcome_id: outcomeId,
      odds: `${odds}`,
      amount: `${amount}`,
      extra_data: JSON.stringify(extraData),
      currency: 'ETH',
      side: parseInt(side),
      from_address: fromAddress,
      chain_id: getChainIdDefaultWallet(),
    };
    console.log("Params:", params, this);
    this.props.initHandshake({
      PATH_URL: API_URL.CRYPTOSIGN.INIT_HANDSHAKE, METHOD: 'POST', data: params,
      successFn: this.initHandshakeSuccess,
      errorFn: this.initHandshakeFailed,
    });
  }

  initHandshakeSuccess = async (successData) => {
    console.log('initHandshakeSuccess', successData);
    const { status, data } = successData;

    if (status && data) {
      betHandshakeHandler.controlShake(data);
      const isExist = isExistMatchBet(data);
      console.log('Sa isExist:', isExist);
      let message = MESSAGE.CREATE_BET_NOT_MATCH;
      if (isExist) {
        message = MESSAGE.CREATE_BET_MATCHED;
      }
      this.props.showAlert({
        message: <div className="text-center">{message}</div>,
        timeOut: 3000,
        type: 'success',
        callBack: () => {
        },
      });
      // send ga event
      try {
        const { matchName, matchOutcome, side } = this.props;
        GA.createBetSuccess(matchName, matchOutcome, side);
      } catch (err) { }
    }
  }

  initHandshakeFailed = (error) => {
    console.log('initHandshakeFailed', error);

    const { status, code } = error;
    if (status === 0) {
      const message = getMessageWithCode(code);
      this.props.showAlert({
        message: <div className="text-center">{message}</div>,
        timeOut: 3000,
        type: 'danger',
        callBack: () => {
        },
      });
    }
    this.props.onSubmitClick();
  }

  renderForm = () => {
    const { total, isShowOdds, marketOdds, isChangeOdds, winValue, disable, estimateGas } = this.state;
    const { side } = this.props;
    console.log('Sa Test disable', disable);

    const amountField = {
      id: 'amount',
      name: 'amount',
      label: 'Amount',
      className: 'amount',
      placeholder: '0.00',
      type: 'text',
    };
    let oddsField = {
      id: 'odds',
      name: 'odds',
      label: 'Odds',
      className: `odds${isChangeOdds ? ' yourOdds' : ''}`,
      placeholder: '2.0',
      value: 3.0,
      defaultValue: marketOdds,
      infoText: isChangeOdds ? 'Your Odds' : 'Market Odds',
      isShowInfoText: true,
      type: 'text',
    };
    // const {BettingShakeForm} = this.state;
    // console.log('BettingShakeForm:', BettingShakeForm);
    const buttonClass = `btnOK ${side === 1 ? 'btnBlue' : 'btnRed'}`;

    return (
      <form className="wrapperBetting">
        {/* <p className="titleForm text-center">{titleBySide[side]}</p> */}
        {/*<Toggle ref={(component) => {this.toggleRef = component}} onChange={this.onToggleChange} />*/}
        {this.renderInputField(amountField)}
        {isShowOdds && this.renderInputField(oddsField)}
        <div className="rowWrapper">
          <div>Possible winnings</div>
          <div className="possibleWinningsValue">{this.state.winValue}</div>
        </div>
        <div className="rowWrapper">
          <div className="gasPriceTitle">Current gas price per transaction (ETH)</div>
          <div className="possibleWinningsValue">{estimateGas}</div>
        </div>
        {/* <Button type="submit" disable={disable} block className={buttonClass}>
          Go
        </Button> */}
      </form>
    );
  }

  renderInputField = (props) => {
    const {
      label,
      className,
      id,
      infoText = 'ETH',
      isShowInfoText = true,
      type = 'text',
      value,
      defaultValue,
      isInput = true,
      ...newProps
    } = props;
    const { oddValue, amountValue } = this.state;
    console.log('Label Default Value:', label, defaultValue);
    return (
      <div className="rowWrapper">
        <label className="label" htmlFor={id}>{label}</label>
        {
          isInput ? (
            <input
              ref={id}
              //component={InputField}
              className={cn('form-control-custom input value', className || '')}
              id={id}
              type={type}
              //defaultValue={defaultValue}
              value={id === "odds" ? oddValue : amountValue}
              //value={value}
              {...newProps}
              onChange={(evt) => {
                if (id === 'odds') {
                  console.log('Change Odds');
                  this.setState({
                    oddValue: evt.target.value,
                    isChangeOdds: true,
                  }, () => this.updateTotal());
                } else {
                  this.setState({
                    amountValue: evt.target.value,
                  }, () => this.updateTotal());
                }
              }}
              onClick={(event) => { event.target.setSelectionRange(0, event.target.value.length); }}
            />
          ) : (<div className={cn('value', className)}>{value}</div>)
        }
        {
          isShowInfoText && <div className="cryptoCurrency">{infoText}</div>
        }
      </div>
    );
  }

  render() {
    return this.renderForm();
  }

  initHandshake(amount, odds){

    const {outcomeId, matchName, matchOutcome, side} = this.props;
    const {extraData} = this.state;
    //const side = this.toggleRef.value;
    const fromAddress = getAddress();
    extraData["event_name"] = matchName;
    extraData["event_predict"] = matchOutcome;
    extraData["event_odds"] = odds;
    extraData["event_bet"] = amount;
    console.log('Extra Data:', extraData);
    const params = {

      type: HANDSHAKE_ID.BETTING,
      outcome_id: outcomeId,
      odds:`${odds}`,
      amount: `${amount}`,
      extra_data: JSON.stringify(extraData),
      currency: 'ETH',
      side: parseInt(side),
      from_address: fromAddress,
      chain_id: getChainIdDefaultWallet(),
    };
    console.log("Params:", params, this);


      this.props.initHandshake({PATH_URL: API_URL.CRYPTOSIGN.INIT_HANDSHAKE, METHOD:'POST', data: params,
      successFn: this.initHandshakeSuccess,
      errorFn: this.initHandshakeFailed

    });


  }

  initHandshakeSuccess = async (successData)=>{
    console.log('initHandshakeSuccess', successData);
    const {status, data} = successData

    if(status && data){

    //  const {outcomeHid} = this.props;
    //   console.log('OutcomeHid:', outcomeHid);
     betHandshakeHandler.controlShake(data);
     const isExist = isExistMatchBet(data);
     console.log('Sa isExist:', isExist);
     let message = MESSAGE.CREATE_BET_NOT_MATCH;
     if(isExist){
       message = MESSAGE.CREATE_BET_MATCHED;
     }
     this.props.showAlert({
      message: <div className="text-center">{message}</div>,
      timeOut: 3000,
      type: 'success',
      callBack: () => {
      }
    });
     // send ga event
      try {
        const {matchName, matchOutcome, side} = this.props;
        GA.createBetSuccess(matchName, matchOutcome, side);
      } catch (err) {}
      this.props.onCreateBetSuccess();
    }
    //this.props.onSubmitClick();


  }
  initHandshakeFailed = (error) => {
    console.log('initHandshakeFailed', error);

    const {status, code} = error;
    if(status == 0){
      const message = getMessageWithCode(code);
      this.props.showAlert({
        message: <div className="text-center">{message}</div>,
        timeOut: 3000,
        type: 'danger',
        callBack: () => {
        }
      });
    }
    //this.props.onCancelClick();

  }
}

const mapDispatch = ({
  initHandshake,
  shakeItem,
  showAlert,
});
export default connect(null, mapDispatch)(BetingShake);
