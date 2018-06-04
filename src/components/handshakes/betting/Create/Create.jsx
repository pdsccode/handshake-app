import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field } from 'redux-form';

import history from '@/services/history';

// service, constant
import createForm from '@/components/core/form/createForm';
import { required } from '@/components/core/form/validation';
import { initHandshake } from '@/reducers/handshake/action';
import { loadMatches } from '@/reducers/betting/action';
import { HANDSHAKE_ID, API_URL } from '@/constants';
import { SIDE } from '@/components/handshakes/betting/Feed/BetHandshakeHandler';

// components
import Button from '@/components/core/controls/Button';
import DatePicker from '@/components/handshakes/betting/Create/DatePicker';
import Dropdown from '@/components/core/controls/Dropdown';

// self
import './Create.scss';
import { InputField } from '../form/customField';
import ErrorBox from './ErrorBox';

const BettingCreateForm = createForm({
  propsReduxForm: {
    form: 'bettingCreate',
  },
});

const regex = /\[.*?\]/g;
const regexReplace = /\[|\]/g;
const regexReplacePlaceholder = /\[.*?\]/;

class BettingCreate extends React.Component {
  static propTypes = {
    item: PropTypes.object,
    toAddress: PropTypes.string,
    isPublic: PropTypes.bool,
    industryId: PropTypes.number,
    onClickSend: PropTypes.func,
    initHandshake: PropTypes.func.isRequired,
    loadMatches: PropTypes.func.isRequired,
    wallet: PropTypes.object.isRequired,
  }

  static defaultProps = {
    item: {
      backgroundColor: '#332F94',
      desc: '[{"key": "event_odds", "label": "Odds", "placeholder": "10", "className": "oddField"}] [{"key": "event_bet", "label": "Your bet", "placeholder": "", "type": "number", "className": "betField"}]',
      id: 18,
      message: null,
      name: 'Bet',
      order_id: 5,
      public: 1,
    },
    toAddress: 'sa@autonomous.nyc',
    isPublic: true,
    industryId: 18,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.matches.length !== prevState.matches.length) {
      return { matches: nextProps.matches };
    }
    if (nextProps.wallet.updatedAt !== prevState.wallet.updatedAt) {
      return { wallet: nextProps.wallet };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      values: {},
      matches: [],
      selectedMatch: null,
      selectedOutcome: null,
      wallet: this.props.wallet,
    };
    this.onSubmit = ::this.onSubmit;
    this.renderInput = ::this.renderInput;
    this.renderDate = ::this.renderDate;
    this.renderForm = ::this.renderForm;
    this.renderNumber = ::this.renderNumber;
  }
  componentDidMount() {
    console.log('Betting Create Props:', this.props, history);
    this.props.loadMatches({ PATH_URL: API_URL.CRYPTOSIGN.LOAD_MATCHES });
  }

  onSubmit() {
    const { values } = this.state;
    console.log('values', values);
    let { content } = this;
    const extraParams = values;
    console.log('Before Content:', content);

    this.inputList.forEach((element) => {
      const item = JSON.parse(element.replace(regexReplace, ''));
      console.log('Element:', item);
      const { key } = item;
      const valueInputItem = key === 'event_date' ? this.datePickerRef.value : values[key];
      content = content.replace(
        regexReplacePlaceholder,
        valueInputItem || '',
      );
    });
    console.log('After Content:', content);
    const wallet = this.state.wallet.powerful.defaultWallet('ETH');
    this.initHandshake(extraParams, wallet.address, wallet.action.blockchain.chainId);
  }

  get foundMatch() {
    const { selectedMatch, matches } = this.state;
    if (selectedMatch) {
      return matches.find(element => element.id === selectedMatch.id);
    }
    return null;
  }

  get matchNames() {
    const { matches } = this.state;
    return matches.map(item => ({ id: item.id, value: `${item.awayTeamName} - ${item.homeTeamName}` }));
  }

  get matchResults() {
    const { selectedMatch } = this.state;
    if (selectedMatch) {
      if (this.foundMatch) {
        const { outcomes } = this.foundMatch;
        if (outcomes) {
          return outcomes.map(item => ({ id: item.id, value: item.name }));
        }
      }
    }
    return [];
  }

  get inputList() {
    return this.content ? this.content.match(regex) : [];
  }

  get content() {
    const { desc } = this.props.item;
    return desc || '';
  }

  changeText(key, text) {
    const { values } = this.state;
    values[key] = text;
    this.setState({ values });
  }

  // Service
  initHandshake(fields, fromAddress, chainId) {
    const { selectedOutcome } = this.state;
    const params = {
      // to_address: toAddress ? toAddress.trim() : '',
      // public: isPublic,
      // description: content,
      // description: JSON.stringify(extraParams),
      // industries_type: industryId,
      type: HANDSHAKE_ID.BETTING,
      // type: 3,
      // extra_data: JSON.stringify(fields),
      outcome_id: selectedOutcome.id,
      odds: fields.event_odds,
      amount: fields.event_bet,
      extra_data: JSON.stringify(fields),
      currency: 'ETH',
      side: SIDE.SUPPORT,
      from_address: fromAddress,
      chain_id: chainId,
    };
    console.log(params);

    this.props.initHandshake({
      PATH_URL: API_URL.CRYPTOSIGN.INIT_HANDSHAKE,
      METHOD: 'POST',
      data: params,
      successFn: this.initHandshakeSuccess,
      errorFn: this.handleGetCryptoPriceFailed,
    });
  }

  initHandshakeSuccess = async (successData) => {
    console.log('initHandshakeSuccess', successData);

    const { status, data } = successData;
    const { values, selectedOutcome } = this.state;
    const stake = values.event_bet;
    const eventOdds = 1 / parseInt(values.event_odds, 10);
    const payout = stake * eventOdds;
    const hid = selectedOutcome.id;
    const side = SIDE.SUPPORT;

    if (status) {
      const { id } = data;
      const offchain = id;
      const result = await this.initBet(hid, side, stake, payout, offchain);
      if (result) {
        // history.go(URL.HANDSHAKE_DISCOVER);
      }
    }
  }

  initHandshakeFailed = (error) => {
    console.log('initHandshakeFailed', error);
  }

  renderInput(item) {
    const { key, placeholder } = item;
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
          this.changeText(key, evt.target.value);
        }}
      />
    );
  }

  renderDate(item) {
    const { key } = item;

    return (
      <DatePicker
        onChange={(selectedDate) => {
          console.log('SelectedDate', selectedDate);
          console.log('Key:', key);
          const { values } = this.state;
          values[key] = selectedDate.format();
          this.setState({ values }, () => console.log(values));
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
        ref={(component) => { this.datePickerRef = component; }}
      />
    );
  }

  renderNumber(item) {
    const { key, placeholder } = item;

    return (
      <Field
        className="form-control-custom input"
        name={key}
        component={InputField}
        type="number"
        // min="0.0001"
        // step="0.0002"
        placeholder={placeholder}
        validate={[required]}
        ErrorBox={ErrorBox}
        onChange={(evt) => {
          this.changeText(key, evt.target.value);
        }}
      />
    );
  }

  renderItem(field, index) {
    const item = JSON.parse(field.replace(regexReplace, ''));
    const {
      key, placeholder, type, label, className,
    } = item;
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
        <span className="label">{label || placeholder}</span>
        <div className={key === 'event_odds' ? 'oddInput' : ''}>
          {itemRender}
        </div>
      </div>
    );
  }

  renderForm() {
    const { selectedMatch } = this.state;
    return (
      <BettingCreateForm className="wrapperBetting" onSubmit={this.onSubmit}>
        <div className="dropDown">
          <Dropdown
            placeholder="Select a match"
            source={this.matchNames}
            onItemSelected={(item) => {
                const { values } = this.state;
                values.event_name = item.value;
                this.setState({ selectedMatch: item, values });
              }
              }
          />
          {selectedMatch && <Dropdown
            placeholder="Select a prediction"
            source={this.matchResults}
            onItemSelected={(item) => {
              const { values } = this.state;
              values.event_predict = item.value;
              this.setState({ selectedOutcome: item, values });
              }
            }
          />}
        </div>

        <div className="formInput">
          {this.inputList.map((field, index) => this.renderItem(field, index))}
        </div>

        <Button type="submit" block>Sign &amp; Send</Button>
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
  // Blockchain
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

  } */
}

const mapState = state => ({
  matches: state.betting.matches,
  wallet: state.wallet,
});
const mapDispatch = ({
  initHandshake,
  loadMatches,
});

export default connect(mapState, mapDispatch)(BettingCreate);
