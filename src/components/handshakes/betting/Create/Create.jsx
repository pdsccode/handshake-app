import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import history from '@/services/history';

// service, constant
import createForm from '@/components/core/form/createForm';
import { required } from '@/components/core/form/validation';
import { Field } from "redux-form";
import { initHandshake } from '@/reducers/handshake/action';
import { loadMatches } from '@/reducers/betting/action';
import { HANDSHAKE_ID, API_URL } from '@/constants';
import  { BetHandshakeHandler, SIDE} from '@/components/handshakes/betting/Feed/BetHandshakeHandler.js';
import { URL } from '@/config';

// components
import Button from '@/components/core/controls/Button';
import Input from '@/components/core/forms/Input/Input';
import DatePicker from '@/components/handshakes/betting/Create/DatePicker';
import { InputField } from '../form/customField';
import {MasterWallet} from '@/models/MasterWallet';
import Dropdown from '@/components/core/controls/Dropdown';

import { BettingHandshake } from '@/services/neuron';
// self
import './Create.scss';

import Neuron from '@/services/neuron';
const wallet = MasterWallet.getWalletDefault('ETH');
const chainId = wallet.chainId;
console.log('Chain Id:', chainId);

const bettinghandshake = new BettingHandshake(chainId);
const nameFormBettingCreate = 'bettingCreate';
const BettingCreateForm = createForm({
  propsReduxForm: {
    form: nameFormBettingCreate,
  },
});

const regex = /\[.*?\]/g;
const regexReplace = /\[|\]/g;
const regexReplacePlaceholder = /\[.*?\]/;

class ErrorBox extends React.PureComponent {
  render() {
    return (
      <div className="text-danger">
        {this.props.children}
      </div>
    );
  }
}

const TAG = 'BETTING_CREATE';
class BettingCreate extends React.PureComponent {
  static propTypes = {
    item: PropTypes.object.isRequired,
    toAddress: PropTypes.string.isRequired,
    isPublic: PropTypes.bool.isRequired,
    industryId: PropTypes.number.isRequired,
    onClickSend: PropTypes.func,
    initHandshake: PropTypes.func.isRequired,
  }

  static defaultProps = {
    item: {
      "backgroundColor": "#332F94",
      "desc": "[{\"key\": \"event_odds\", \"label\": \"Odds\", \"placeholder\": \"10\", \"className\": \"oddField\"}] [{\"key\": \"event_bet\", \"label\": \"Your bet\", \"placeholder\": \"\", \"type\": \"number\", \"className\": \"betField\"}]",
      "id": 18,
      "message": null,
      "name": "Bet",
      "order_id": 5,
      "public": 1
    },
    toAddress: "sa@autonomous.nyc",
    isPublic: true,
    industryId: 18,
  }

  constructor(props) {
    super(props);
    this.state = {
      values: {},
      address: null,
      privateKey: null,
      matches: [
        {
            "awayTeamCode": "",
            "awayTeamFlag": "https://upload.wikimedia.org/wikipedia/commons/0/0d/Flag_of_Saudi_Arabia.svg",
            "awayTeamName": "Saudi Arabia",
            "date": 1528963200,
            "homeTeamCode": "RUS",
            "homeTeamFlag": "https://upload.wikimedia.org/wikipedia/commons/f/f3/Flag_of_Russia.svg",
            "homeTeamName": "Russia",
            "id": 1,
            "outcomes": [
                {
                    "handshakes": [{
                        id: 1,
                        support: 1,
                        odd: 2.3,
                        amount: 0.1528
                    },
                    {
                        id: 2,
                        support: 1,
                        odd: 2.3,
                        amount: 0.1528
                    },
                    {
                        id: 3,
                        support: 1,
                        odd: 2.3,
                        amount: 0.1528
                    },
                    {
                        id: 4,
                        support: 1,
                        odd: 2.3,
                        amount: 0.1528
                    },
                    {
                        id: 5,
                        support: 1,
                        odd: 2.3,
                        amount: 0.1528
                    },
                    {
                        id: 6,
                        support: 2,
                        odd: 2.3,
                        amount: 0.1528
                    },
                    {
                        id: 7,
                        support: 2,
                        odd: 2.3,
                        amount: 0.1528
                    },
                    {
                        id: 8,
                        support: 2,
                        odd: 2.3,
                        amount: 0.1528
                    },
                    {
                        id: 9,
                        support: 2,
                        odd: 2.3,
                        amount: 0.1528
                    },
                    {
                        id: 10,
                        support: 2,
                        odd: 2.3,
                        amount: 0.1528
                    }],
                    "id": 1,
                    "name": "Russia wins"
                },
                {
                    "handshakes": [],
                    "id": 2,
                    "name": "Saudi Arabia wins"
                },
                {
                    "handshakes": [],
                    "id": 3,
                    "name": "Russia draws Saudi Arabia"
                }
            ]
        },
        {
            "awayTeamCode": "",
            "awayTeamFlag": "https://upload.wikimedia.org/wikipedia/commons/f/fe/Flag_of_Uruguay.svg",
            "awayTeamName": "Uruguay",
            "date": 1529038800,
            "homeTeamCode": "",
            "homeTeamFlag": "https://upload.wikimedia.org/wikipedia/commons/f/fe/Flag_of_Egypt.svg",
            "homeTeamName": "Egypt",
            "id": 2,
            "outcomes": [
                {
                    "handshakes": [],
                    "id": 7,
                    "name": "Uruguay wins"
                },
                {
                    "handshakes": [],
                    "id": 8,
                    "name": "Egypt wins"
                },
                {
                    "handshakes": [],
                    "id": 9,
                    "name": "Uruguay draws Egypt"
                }
            ]
        }
    ],
    selectedMatch:null,
    selectedOutcome: null,
    };
    this.onSubmit = ::this.onSubmit;
    this.renderInput = ::this.renderInput;
    this.renderDate = ::this.renderDate;
    this.renderForm = ::this.renderForm;
    this.renderNumber = ::this.renderNumber;
  }
  componentDidMount(){
    console.log('Betting Create Props:', this.props, history);
    this.setState({
      address: wallet.address,
      privateKey: wallet.privateKey,
    })
    this.props.loadMatches({PATH_URL: API_URL.CRYPTOSIGN.LOAD_MATCHES});

  }
  componentWillReceiveProps(nextProps){

    const {matches} = nextProps;
    console.log(`${TAG} Matches:`, matches);

    this.setState({
        matches
    })
}
get foundMatch(){
  const {selectedMatch, matches} = this.state;
  if(selectedMatch){
      return matches.find(function(element) {
          return element.id  === selectedMatch.id;
        });
  }
  return null;

}

get matchNames() {
  const {matches} = this.state;
  return matches.map((item) => ({ id: item.id, value: `${item.awayTeamName} - ${item.homeTeamName}` }));
}
get matchResults(){
  const {selectedMatch, matches} = this.state;
  if(selectedMatch){
      const foundMatch = this.foundMatch;
      if (foundMatch){
          const {outcomes} = foundMatch;
          if(outcomes){
              return outcomes.map((item) => ({ id: item.id, value: item.name}));
          }
      }
  }


  return [];
}

  onSubmit(dict) {
    const {address, privateKey, values} = this.state;
    console.log("values", values);

    let content = this.content;
    const inputList = this.inputList;
    let extraParams = values;
    console.log('Before Content:', content);

    inputList.forEach(element => {
      const item = JSON.parse(element.replace(regexReplace, ''));
      console.log('Element:', item);
      const {key, placeholder, type} = item;
      const valueInputItem = key === 'event_date' ? this.datePickerRef.value : values[key];
      content = content.replace(
        regexReplacePlaceholder,
        valueInputItem ? valueInputItem : ''
      );
    });
    console.log('After Content:', content);
    //console.log("this", this.datePickerRef.value);

    //const {toAddress, isPublic, industryId} = this.props;

    //const fromAddress = "0x54CD16578564b9952d645E92b9fa254f1feffee9";
    const fromAddress = address;
    this.initHandshake(extraParams, fromAddress);
  }

  get inputList() {
    const content = this.content;
    return content ? content.match(regex) : [];
  }

  get content() {
    const { desc } = this.props.item;
    return desc || '';
  }

  changeText(key, text) {
    const {values} = this.state;
    values[key] = text;
    this.setState({values});
  }

  renderInput(item, index) {
    const {key, placeholder, type} = item;
    const className = 'form-control-custom input';
    return (
      <Field
        component={InputField}
        type="text"
        placeholder={placeholder}
        className={className}
        name={key}
        validate={[required]}
        ErrorBox={ErrorBox}
        onChange={(evt) => {
          this.changeText(key, evt.target.value)
        }}
      />
    );
  }

  renderDate(item) {
    const {key, placeholder, type} = item;

    return (
      <DatePicker
        onChange={(selectedDate) => {
          console.log('SelectedDate', selectedDate);
          console.log('Key:', key);
          const {values} = this.state;
          values[key] = selectedDate.format();
          this.setState({values}, ()=>console.log(values));

        }}
        inputProps={{
          readOnly: true,
          className: 'form-control-custom input',
          name: key,
        }}
        defaultValue={new Date()}
        dateFormat="D/M/YYYY"
        timeFormat="HH:mm"
        closeOnSelect
        ref={(component) => {this.datePickerRef = component;}}
      />
    );
  }

  renderNumber(item) {
    const {key, placeholder} = item;

    return (
      <Field
        className="form-control-custom input"
        name={key}
        component={InputField}
        type="number"
        //min="0.0001"
        //step="0.0002"
        placeholder={placeholder}
        validate={[required]}
        ErrorBox={ErrorBox}
        onChange={(evt) => {
          this.changeText(key, evt.target.value)
        }}
      />
    );
  }

  renderItem(field, index) {
    const item = JSON.parse(field.replace(regexReplace, ''));
    const {key, placeholder, type, label, className} = item;
    let itemRender = this.renderInput(item, index);
    switch (type) {
      case 'date':
        itemRender = this.renderDate(item, index);
        break;
      case 'number':
        itemRender = this.renderNumber(item, index);
        break;
      default:
        itemRender = this.renderInput(item, index);
    }

    return (
      <div key={index} className={`rowWrapper ${className || ''}`}>
        <label className="label">{label || placeholder}</label>
        <div className={key === 'event_odds' ? 'oddInput' : ''}>
          {itemRender}
        </div>
      </div>
    );
  }

  renderForm() {
    const inputList = this.inputList;
    const {selectedMatch} = this.state;
    return (
      <BettingCreateForm className="wrapperBetting" onSubmit={this.onSubmit}>
        <div className="dropDown">
          <Dropdown
            placeholder="Select a match"
            source={this.matchNames}
            onItemSelected={(item) => 
              {
                const {values} = this.state;
                values["event_name"] = item.value;
                this.setState({selectedMatch: item, values});
                
              }
              }
          />
          {selectedMatch && <Dropdown
            placeholder="Select a prediction"
            source={this.matchResults}
            onItemSelected={(item) => {
              const {values} = this.state;
              values["event_predict"] = item.value;
              this.setState({selectedOutcome: item, values})
              }
            }
          />}
        </div>

        <div className="formInput">
          {inputList.map((field, index) => this.renderItem(field, index))}
        </div>

        <Button type="submit" block>Sign & Send</Button>
      </BettingCreateForm>
    );
  }

  render() {
    return (
      <div>
        {this.renderForm()}
      </div>
    );
  }

  //Service
  initHandshake(fields, fromAddress){
    const {selectedOutcome} = this.state;
    const params = {
      //to_address: toAddress ? toAddress.trim() : '',
      //public: isPublic,
      //description: content,
      // description: JSON.stringify(extraParams),
      //industries_type: industryId,
      type: HANDSHAKE_ID.BETTING,
      //type: 3,
      //extra_data: JSON.stringify(fields),
      is_private: 0,
      outcome_id: selectedOutcome.id,
      odds: fields['event_odds'],
      amount: fields['event_bet'],
      extra_data: JSON.stringify(fields),
      currency: 'ETH',
      side: SIDE.SUPPORT,
      //from_address: fromAddress,
      chain_id: chainId,
    };
    console.log(params);

    this.props.initHandshake({PATH_URL: API_URL.CRYPTOSIGN.INIT_HANDSHAKE, METHOD:'POST', data: params,
    successFn: this.initHandshakeSuccess,
    errorFn: this.handleGetCryptoPriceFailed
  });

  }
   initHandshakeSuccess = async (successData)=>{
    console.log('initHandshakeSuccess', successData);
    
    const {status, data} = successData
    const {values, selectedOutcome} = this.state;
    const stake = values['event_bet'];
    const event_odds = 1/parseInt(values['event_odds']);
    const payout = stake * event_odds;
    const hid = selectedOutcome.id;
    const side = SIDE.SUPPORT;

    if(status){
      const {id} = data;
      const offchain = id;
      const result = await bettinghandshake.initBet(hid, side,stake, payout, offchain);
      if(result){
          //history.go(URL.HANDSHAKE_DISCOVER);
      }
    }
    

  }
  initHandshakeFailed = (error) => {
    console.log('initHandshakeFailed', error);
  }


  //Blockchain
  /*
  async initBet(escrow, odd, eventDate){

    const address = "0x54CD16578564b9952d645E92b9fa254f1feffee9";
    const privateKey = "9bf73320e0bcfd7cdb1c0e99f334d689ef2b6921794f23a5bffd2a6bb9c7a3d4";
    const acceptors = [];
    const goal = escrow*odd;
    const currentDate = new Date();
    const deadline = (eventDate.getTime() / 1000 - currentDate.getTime() / 1000);
    const offchain = 'abc1';
    const data = await neuron.bettingHandshake.initBet(address, privateKey, acceptors, goal, escrow, deadline, offchain);
    console.log('Init Betting:', data);

  }*/
}
const mapState = state => ({
  matches: state.betting.matches,
});
const mapDispatch = ({
  initHandshake,
  loadMatches,
});

export default connect(null, mapDispatch)(BettingCreate);
