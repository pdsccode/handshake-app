import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { connect } from 'react-redux';

// service, constant
import createForm from '@/components/core/form/createForm';
import { required } from '@/components/core/form/validation';
import { Field } from "redux-form";
import { shakeItem, initHandshake, } from '@/reducers/handshake/action';
import {HANDSHAKE_ID, API_URL, APP } from '@/constants';
import {MasterWallet} from '@/models/MasterWallet';
import local from '@/services/localStore';
import { BettingHandshake } from '@/services/neuron';

// components
import { InputField } from '@/components/handshakes/betting/form/customField';
import Button from '@/components/core/controls/Button';
import Toggle from './../Toggle';
import {showAlert} from '@/reducers/app/action';

import './Shake.scss';
import { BetHandshakeHandler, MESSAGE } from '@/components/handshakes/betting/Feed/BetHandshakeHandler';


const wallet = MasterWallet.getWalletDefault('ETH');
const chainId = wallet.chainId;

const bettinghandshake = new BettingHandshake(chainId);

const nameFormBettingShake = 'bettingShakeForm';
const BettingShakeForm = createForm({
  propsReduxForm: {
    form: nameFormBettingShake,
  },
});

const defaultAmount = 1;

class BetingShake extends React.Component {
  static propTypes = {
    outcomeId: PropTypes.number,
    outcomeHid: PropTypes.number,
    matchName: PropTypes.string,
    matchOutcome: PropTypes.string,
    onSubmitClick: PropTypes.func,
    onCancelClick: PropTypes.func,
  }

  static defaultProps = {
    outcomeId: -1
  };

  constructor(props) {
    super(props);
    this.state = {
      buttonClass: 'btnOK btnRed',
      isShowOdds: false,
      extraData: {},

    };

    this.onSubmit = ::this.onSubmit;
    this.onCancel = ::this.onCancel;
    this.renderInputField = ::this.renderInputField;
    this.renderForm = ::this.renderForm;
    this.onToggleChange = ::this.onToggleChange;
  }
  componentDidMount(){

  }
  componentWillReceiveProps(nextProps){
    // const {extraData} = this.state;
    // const {matchName, matchOutcome, outcomeHid} = this.props;
    // console.log("componentWillReceiveProps Props:", this.props);
    // extraData["event_name"] = matchName;
    // extraData["event_predict"] = matchOutcome;
    // console.log('componentWillReceiveProps Extra Data: ', extraData);
    // this.setState({extraData})

  }



  async onSubmit(values) {
    console.log("Submit");
    const {isShowOdds} = this.state;
    const {matchName, matchOutcome} = this.props;
    const amount = parseFloat(values.amount);
    const odds = parseFloat(values.odds);
    console.log("Amount, this.toggle", this.toggleRef.value);
    // this.props.onSubmitClick(amount);
    const side = parseInt(this.toggleRef.value);
    const balance = await BetHandshakeHandler.getBalance();
    const estimatedGas = await bettinghandshake.getEstimateGas();
    const total = amount + parseFloat(estimatedGas);

    console.log('Amount:', amount);
    console.log('Props:', this.props);
    var message = null;



    if(matchName && matchOutcome){
        if(amount > 0){
          if(total <= parseFloat(balance)){
            if(isShowOdds){
              if(odds >=1){
                this.initHandshake(amount, odds);
              }else {
                message = MESSAGE.ODD_LARGE_THAN;
              }
            }else {
              this.shakeItem(amount, side);

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



    //if(matchName && matchOutcome && amount <= parseFloat(balance) && amount > 0){
      // if(isShowOdds){
      //   this.initHandshake(amount, odds);
      // }else {
      //   this.shakeItem(amount, side);

      // }
    //}
    if(message){
      this.props.showAlert({
        message: <div className="text-center">{message}</div>,
        timeOut: 3000,
        type: 'danger',
        callBack: () => {
        }
      });
    }

  }

  onCancel() {
    console.log('Cancel')
    this.props.onCancelClick();
  }

  onToggleChange(id) {
    this.setState({buttonClass: `btnOK ${id === 2 ? 'btnBlue' : 'btnRed' }`});
  }

  updateTotal(value) {
    console.log('value:', value);
    if (!!value) {
      const { odd } = this.props;
      const amount = value * odd;
      this.setState({
        amount: value,
        total: amount.toFixed(4),
      })
    }
  }

  renderInputField(props) {
    const {
      label,
      className,
      id,
      cryptoCurrency = 'ETH',
      isShowCurrency = true,
      type = 'text',
      value,
      isInput = true,
      ...newProps
    } = props;

    return (
      <div className="rowWrapper">
        <label className="label" htmlFor={id}>{label}</label>
        {
          isInput ? (
            <Field
              component={InputField}
              className={cn('form-control-custom input value', className || '')}
              id={id}
              type={type}
              {...newProps}
            />
          ) : (<div className={cn('value', className)}>{value}</div>)
        }
        {
          isShowCurrency && <div className="cryptoCurrency">{cryptoCurrency}</div>
        }
      </div>
    )
  }

  renderForm() {
    const { total, buttonClass, isShowOdds } = this.state;
    const { remaining, odd } = this.props;
    const odds = `1 : ${odd}`;

    const formFieldData = [
      {
        id: 'you_bet',
        name: 'you_bet',
        label: 'You bet',
        key: 1,
        defaultValue: '1',
        onChange: (evt) => this.updateTotal(parseFloat(evt.target.value)),
      },
      {
        id: 'at_odds',
        name: 'at_odds',
        label: 'At odds',
        isInput: false,
        value: odds,
        className: 'atOdds',
        isShowCurrency: false,
        key: 2,
      },
      {
        id: 'remaining',
        name: 'remaining',
        label: 'Remaining',
        isInput: false,
        value: remaining,
        key: 3,
      },
    ];

    const youCouldWinField = {
      id: 'you_could_win',
      name: 'you_could_win',
      label: 'You could win',
      className: 'total',
      isInput: false,
      value: total || 0,
      readOnly: true,
    };

    const amountField = {
      id: 'amount',
      name: 'amount',
      label: 'Amount',
      className: 'amount',
      placeholder: '0.00',
      type: 'tel',
    };
    const oddsField = {
      id: 'odds',
      name: 'odds',
      label: 'Odds',
      placeholder: '0-0',
      isShowCurrency: false,
      type: 'tel',
    };

    return (
      <BettingShakeForm className="wrapperBettingShake" onSubmit={this.onSubmit}>
        <p className="titleForm text-center text-capitalize">Bet on the outcome</p>
        <Toggle ref={(component) => {this.toggleRef = component}} onChange={this.onToggleChange} />
        {this.renderInputField(amountField)}
        {isShowOdds && this.renderInputField(oddsField)}

        <Button type="submit" block className={buttonClass}>
          Shake
        </Button>
      </BettingShakeForm>
    );
  }


  render() {
    return this.renderForm();
  }




  shakeItem(amount, side){
      const {outcomeId} = this.props;
      const {extraData} = this.state;
      const {matchName, matchOutcome, outcomeHid} = this.props;
      extraData["event_name"] = matchName;
      extraData["event_predict"] = matchOutcome;
      extraData["event_bet"] = amount;
      this.setState({
        extraData
      })
      console.log("Props:", this.props);

      const params = {
        //to_address: toAddress ? toAddress.trim() : '',
        //public: isPublic,
        //description: content,
        // description: JSON.stringify(extraParams),
        //industries_type: industryId,
        type: HANDSHAKE_ID.BETTING,
        //type: 3,
        //extra_data: JSON.stringify(fields),
        outcome_id: outcomeId,
        extra_data: JSON.stringify(extraData),
        amount,
        currency: 'ETH',
        side,
        chain_id: chainId,
        from_address: wallet.address
      };
      console.log(params);

      this.props.shakeItem({PATH_URL: API_URL.CRYPTOSIGN.SHAKE, METHOD:'POST', data: params,
      successFn: this.shakeItemSuccess,
      errorFn: this.shakeItemFailed
    });
  }

  shakeItemSuccess = async (successData)=>{
    console.log('shakeItemSuccess', successData);
    const {status, data, message} = successData;
    if(status){
      /*
      const foundShakeList = this.foundShakeItemList(data);
      console.log('foundShakeList:', foundShakeList);
      foundShakeList.forEach(element => {
        this.shakeContract(element);
      });
      */
     const {outcomeHid} = this.props;
     BetHandshakeHandler.controlShake(data, outcomeHid);
     this.props.showAlert({
      message: <div className="text-center">{MESSAGE.CREATE_BET_SUCCESSFUL}</div>,
      timeOut: 3000,
      type: 'danger',
      callBack: () => {
      }
    });

    }else {
      // TO DO: Show message, show odd field
      this.setState({
        isShowOdds: true,
      }, ()=> {
        const {message} = successData
          this.props.showAlert({
            message: <div className="text-center">{message}</div>,
            timeOut: 3000,
            type: 'danger',
            callBack: () => {
            }
          });
      })


    }
  }
  shakeItemFailed = (error) => {
    console.log('shakeItemFailed', error);
    console.log('Error:', error);
    const {status} = error;
    if(status === 0){
      const {message} = error;
      this.setState({
        isShowOdds: true,
      }, ()=> {
        const {message} = successData
          this.props.showAlert({
            message: <div className="text-center">{message}</div>,
            timeOut: 3000,
            type: 'danger',
            callBack: () => {
            }
          });
      })
    }
   
  }

  initHandshake(amount, odds){
    const {outcomeId} = this.props;
    const {extraData} = this.state;
    const side = this.toggleRef.value;
    const fromAddress = wallet.address;
    extraData["event_odds"] = odds;
    extraData["event_bet"] = amount;
    console.log('Extra Data:', extraData);
    const params = {
      //to_address: toAddress ? toAddress.trim() : '',
      //public: isPublic,
      //description: content,
      // description: JSON.stringify(extraParams),
      //industries_type: industryId,
      type: HANDSHAKE_ID.BETTING,
      //type: 3,
      //extra_data: JSON.stringify(fields),
      outcome_id: outcomeId,
      odds:  parseFloat(odds),
      amount: parseFloat(amount),
      extra_data: JSON.stringify(extraData),
      currency: 'ETH',
      side: parseInt(side),
      from_address: fromAddress,
      chain_id: chainId,
    };
    console.log("Params:", params);

    this.props.initHandshake({PATH_URL: API_URL.CRYPTOSIGN.INIT_HANDSHAKE, METHOD:'POST', data: params,
    successFn: this.initHandshakeSuccess,
    errorFn: this.handleGetCryptoPriceFailed
  });
  }

  initHandshakeSuccess = async (successData)=>{
    console.log('initHandshakeSuccess', successData);
    const {status, data} = successData

    if(status && data){
      /*
      const {offchain, side} = data;
      var result = null;

      if(this.isShakedBet(data)){
        result = await bettinghandshake.shake(hid, side,stake, payout,maker, offchain);
      }else {
        result = await bettinghandshake.initBet(hid, side,stake, payout, offchain);
      }
      if(result){
        //TO DO: redirect and show alert
      }
      */
     const {outcomeHid} = this.props;
      console.log('OutcomeHid:', outcomeHid);
     BetHandshakeHandler.controlShake(data, outcomeHid);
     this.props.showAlert({
      message: <div className="text-center">{MESSAGE.CREATE_BET_SUCCESSFUL}</div>,
      timeOut: 3000,
      type: 'danger',
      callBack: () => {
      }
    });
    }
  }
  initHandshakeFailed = (error) => {
    console.log('initHandshakeFailed', error);
  }
}
const mapDispatch = ({
  initHandshake,
  shakeItem,
  showAlert
});
export default connect(null, mapDispatch)(BetingShake);
