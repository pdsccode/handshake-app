import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { connect } from 'react-redux';

// service, constant
import { shakeItem, initHandshake, } from '@/reducers/handshake/action';
import {HANDSHAKE_ID, API_URL, APP } from '@/constants';
import {MasterWallet} from '@/services/Wallets/MasterWallet';
import local from '@/services/localStore';
import moment from 'moment';
import GA from '@/services/googleAnalytics';

// components
import Button from '@/components/core/controls/Button';
import {showAlert} from '@/reducers/app/action';
import {getMessageWithCode, isExpiredDate, getChainIdDefaultWallet,
  getBalance, getEstimateGas, getAddress, isExistMatchBet, isRightNetwork, parseBigNumber} from '@/components/handshakes/betting/utils.js';

import './Shake.scss';
import { BetHandshakeHandler, MESSAGE, SIDE } from '@/components/handshakes/betting/Feed/BetHandshakeHandler';


const betHandshakeHandler = BetHandshakeHandler.getShareManager();


const titleBySide = { 1: 'Bet for the outcome', 2: 'Bet against the outcome' };
const ROUND = 1000000;
const ROUND_ODD = 10;
class BetingShake extends React.Component {
  static propTypes = {
    outcomeId: PropTypes.number,
    outcomeHid: PropTypes.number,
    matchName: PropTypes.string,
    matchOutcome: PropTypes.string,
    marketSupportOdds: PropTypes.number,
    marketAgainstOdds: PropTypes.number,
    amountSupport: PropTypes.number,
    amountAgainst: PropTypes.number,
    closingDate: PropTypes.any,
    reportTime: PropTypes.any,
    onSubmitClick: PropTypes.func,
    onCancelClick: PropTypes.func,
  }

  tamButton = false;

  static defaultProps = {
    outcomeId: -1
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


    this.onSubmit = ::this.onSubmit;
    this.onCancel = ::this.onCancel;
    this.renderInputField = ::this.renderInputField;
    this.renderForm = ::this.renderForm;
    this.onToggleChange = ::this.onToggleChange;
  }
  componentDidMount(){
    console.log('Sa test componentDidMount');

  }
  async componentWillReceiveProps(nextProps){

    const {marketSupportOdds, marketAgainstOdds, side, amountSupport, amountAgainst, isOpen} = nextProps;
    const marketOdds = side === SIDE.SUPPORT ? marketSupportOdds : marketAgainstOdds;
    const marketAmount = side === SIDE.SUPPORT ? amountSupport : amountAgainst;
    // const winValue = marketAmount * marketOdds;
    const winValue = parseBigNumber(marketAmount).times(parseBigNumber(marketOdds)).toNumber()||0;
    const roundMarketAmount = Math.floor(marketAmount*ROUND)/ROUND;
    const estimateGas = await getEstimateGas();

    //const roundMarketAmount = marketAmount;
    console.log('componentWillReceiveProps: marketOdds, marketAmount, winValue, roundMarketAmount:', marketOdds, marketAmount, winValue, roundMarketAmount);
    // this.setState({
    //   oddValue: Math.floor(marketOdds*ROUND_ODD)/ROUND_ODD,
    //   amountValue: roundMarketAmount,
    //   winValue: Math.floor(winValue*ROUND)/ROUND,
    //   disable: !isOpen
    // });
    this.setState({
      oddValue: Math.floor(marketOdds*ROUND_ODD)/ROUND_ODD,
      amountValue: roundMarketAmount,
      winValue: Math.floor(winValue*ROUND)/ROUND,
      disable: !isOpen,
      estimateGas
    });
  }


  async onSubmit(e) {
    console.log("Submit");
    e.preventDefault();
    const values = this.refs;
    console.log('Values:', values);
    this.setState({
      disable: true,
    });
    const {isShowOdds, isChangeOdds, estimateGas} = this.state;
    const {matchName, matchOutcome, side, marketAgainstOdds, marketSupportOdds, closingDate, reportTime} = this.props;
    const amount = parseBigNumber(values.amount.value);
    const odds = parseBigNumber(values.odds.value);

    // const marketOdds = side === SIDE.SUPPORT ? marketSupportOdds : marketAgainstOdds;

    console.log("Amount, Side, Odds", amount?.toNumber(), side, odds?.toNumber());
    const balance = await getBalance();
    const estimatedGas = parseBigNumber(estimateGas.toString()||0);

    // const total = amount + parseFloat(estimatedGas);
    const total = amount.plus(estimatedGas).toNumber()||0;
    console.log('Balance, estimate gas, total, date:', balance, estimateGas, total, closingDate);

    var message = null;
    console.log
    // send event tracking
    try {
      GA.clickGoButton(matchName, matchOutcome, side);
    } catch (err) {}


    if(!isRightNetwork()){
      message = MESSAGE.RIGHT_NETWORK;

    }

    else if(matchName && matchOutcome){
      if (isExpiredDate(closingDate)){
        message = MESSAGE.MATCH_OVER;
      }else if(amount > 0){
          if(total <= parseFloat(balance)){
            if(isShowOdds){
              if(odds >1){
                this.initHandshake(amount, odds);
              }else {
                message = MESSAGE.ODD_LARGE_THAN;
              }
            }else {
              //LOGIC new nerver use shake item
              //this.shakeItem(amount, side);

            }
          }else {
            message = MESSAGE.NOT_ENOUGH_BALANCE;
          }
        }else {
          message = MESSAGE.AMOUNT_VALID;
        }
    }else {
      message = MESSAGE.CHOOSE_MATCH;
    }


    if(message){
      this.props.showAlert({
        message: <div className="text-center">{message}</div>,
        timeOut: 3000,
        type: 'danger',
        callBack: () => {
        }
      });

    }
    this.props.onSubmitClick();


  }

  onCancel() {
    console.log('Cancel')
    this.props.onCancelClick();
  }

  onToggleChange(id) {
    const {isChangeOdds} = this.state;
    const {marketAgainstOdds, marketSupportOdds, side} = this.props;
    const marketOdds = side === SIDE.SUPPORT ? marketSupportOdds : marketAgainstOdds;

    if(!isChangeOdds){
      this.setState({
        oddValue: Math.floor(parseFloat(marketOdds)*ROUND_ODD)/ROUND_ODD
      })
    }
    this.setState({buttonClass: `btnOK ${side === 1 ? 'btnBlue' : 'btnRed' }`});

  }

  updateTotal() {
    const {oddValue, amountValue} = this.state;
    const total = oddValue * amountValue;
      this.setState({
        winValue: Math.floor(total*ROUND)/ROUND,
      })
  }

  renderInputField(props) {
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
    const {oddValue, amountValue} = this.state;
    console.log('Label Default Value:',label, defaultValue);
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
              value={id==="odds" ? oddValue : amountValue}
              //value={value}
              {...newProps}
              onChange= {(evt)=> {
                if (id === 'odds'){
                  console.log('Change Odds');
                  this.setState({
                    oddValue: evt.target.value,
                    isChangeOdds: true
                  }, ()=> this.updateTotal())
                }else {
                  this.setState ({
                    amountValue: evt.target.value
                  }, ()=> this.updateTotal())
                }
              }}
              onClick={event => {event.target.setSelectionRange(0, event.target.value.length)}}
            />
          ) : (<div className={cn('value', className)}>{value}</div>)
        }
        {
          isShowInfoText && <div className="cryptoCurrency">{infoText}</div>
        }
      </div>
    )
  }

  renderForm() {
    const { total, isShowOdds, marketOdds, isChangeOdds, winValue, disable, estimateGas } = this.state;
    const {side} = this.props;
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
    const buttonClass = `btnOK ${side === 1 ? 'btnBlue' : 'btnRed' }`;

    return (
      <form className="wrapperBettingShake" onSubmit={this.onSubmit}>
        <p className="titleForm text-center">{titleBySide[side]}</p>
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
        <Button type="submit" disabled={disable} block className={buttonClass}>
          Go
        </Button>
      </form>
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
    }

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
    this.props.onSubmitClick();

  }
}
const mapDispatch = ({
  initHandshake,
  shakeItem,
  showAlert
});
export default connect(null, mapDispatch)(BetingShake);
