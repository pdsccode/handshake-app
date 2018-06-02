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

import './Shake.scss';


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
      buttonClass: 'btnOK btnBlue',
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
    const {extraData} = this.state;
    const {matchName, matchOutcome} = this.props;
    extraData["event_name"] = matchName;
    extraData["event_predict"] = matchOutcome;
    this.setState({extraData})
  }

  onSubmit(values) {
    console.log("Submit");
    const {isShowOdds} = this.state;
    const amount = values.amount;
    const odds = values.odds;
    console.log("Amount, this.toggle", this.toggleRef.value);
    // this.props.onSubmitClick(amount);
    const side = this.toggleRef.value;
    if(isShowOdds){
      this.initHandshake(amount, odds);
    }else {
      this.shakeItem(amount, side);

    }
  }

  onCancel() {
    console.log('Cancel')
    this.props.onCancelClick();
  }

  onToggleChange(id) {
    this.setState({buttonClass: `btnOK ${id === 1 ? 'btnBlue' : 'btnRed' }`});
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
      name: 'you',
      label: 'Amount',
      className: 'amount',
      placeholder: '0.00',
    };
    const oddsField = {
      id: 'odds',
      name: 'you',
      label: 'Odds',
      className: 'amount',
      placeholder: '0-0',
    };

    return (
      <BettingShakeForm className="wrapperBettingShake" onSubmit={this.onSubmit}>
        <p className="titleForm text-center text-capitalize">PLACE A BET</p>
        {this.renderInputField(amountField)}
        {isShowOdds && this.renderInputField(oddsField)}
        <Toggle ref={(component) => {this.toggleRef = component}} onChange={this.onToggleChange} />

        <Button type="submit" block className={buttonClass}>
          Shake now
        </Button>
      </BettingShakeForm>
    );
  }

  foundShakeItemList(list){
    var shakerList = [];
    const profile = local.get(APP.AUTH_PROFILE);
    list.forEach(element => {
      const {shakers, outcome_id, from_address} = element;
      console.log('Shakers:', shakers);
      var foundShakedItem = shakers.find(function(element) {
        return element.shaker_id  === profile.id;
      });
      console.log('foundShakedItem:', foundShakedItem);
      if(foundShakedItem){
        foundShakedItem['outcome_id'] = outcome_id;
        foundShakedItem['from_address'] = from_address;
        shakerList.push(foundShakedItem);
      }
    });
    return shakerList;
  }

  render() {
    return this.renderForm();
  }




  shakeItem(amount, side){
      const {outcomeId} = this.props;
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
  async shakeContract(item){
    const {amount,id, odds, side, outcome_id, from_address} = item;
      const stake = amount;
      const payout = stake * odds;
      const offchain = `cryptosign_s${id}`;
      const maker = from_address;
      const hid = outcome_id;
      const result = await bettinghandshake.shake(hid, side,stake, payout,maker, offchain);
      if(result){
          //history.go(URL.HANDSHAKE_DISCOVER);
      }
  }
  shakeItemSuccess = async (successData)=>{
    console.log('shakeItemSuccess', successData);
    const {status, data, message} = successData
    if(status){
      const foundShakeList = this.foundShakeItemList(data);
      console.log('foundShakeList:', foundShakeList);
      foundShakeList.forEach(element => {
        this.shakeContract(element);
      });

    }else {
      // TO DO: Show message, show odd field
      this.setState({
        isShowOdds: true,
      })


    }
  }
  shakeItemFailed = (error) => {
    console.log('shakeItemFailed', error);
  }

  initHandshake(amount, odds){
    const {outcomeId} = this.props;
    const {extraData} = this.state;
    const side = this.toggleRef.value;
    const fromAddress = wallet.address;
    extraData["event_odds"] = odds;
    extraData["event_bet"] = amount;
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
      odds: odds,
      amount: amount,
      extra_data: JSON.stringify(extraData),
      currency: 'ETH',
      side: side,
      from_address: fromAddress,
      chain_id: chainId,
    };
    console.log("Params:", params);

  //   this.props.initHandshake({PATH_URL: API_URL.CRYPTOSIGN.INIT_HANDSHAKE, METHOD:'POST', data: params,
  //   successFn: this.initHandshakeSuccess,
  //   errorFn: this.handleGetCryptoPriceFailed
  // });
  }

  initHandshakeSuccess = async (successData)=>{
    console.log('initHandshakeSuccess', successData);
  }
  initHandshakeFailed = (error) => {
    console.log('initHandshakeFailed', error);
  }
}
const mapDispatch = ({
  initHandshake,
  shakeItem,
});
export default connect(null, mapDispatch)(BetingShake);
