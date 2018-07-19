import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// service, constant
import { required } from '@/components/core/form/validation';
import { initHandshake } from '@/reducers/handshake/action';
import { HANDSHAKE_ID, API_URL, URL } from '@/constants';
import { MESSAGE } from '@/components/handshakes/betting/message.js';
import { BetHandshakeHandler } from '@/components/handshakes/betting/Feed/BetHandshakeHandler';
import { SIDE } from '@/components/handshakes/betting/constants.js';
import { validateBet } from '@/components/handshakes/betting/validation.js';

import GA from '@/services/googleAnalytics';

// components
import Button from '@/components/core/controls/Button';
import { showAlert } from '@/reducers/app/action';
import {
  getChainIdDefaultWallet,
  isExistMatchBet, getAddress, parseBigNumber,
  calculateBetDefault,
  formatAmount,
} from '@/components/handshakes/betting/utils.js';

import { getKeyByValue } from '@/utils/object';

// self
import { InputField } from '../form/customField';
import './Create.scss';

const betHandshakeHandler = BetHandshakeHandler.getShareManager();

const regex = /\[.*?\]/g;
const regexReplace = /\[|\]/g;

const TAG = 'BETTING_CREATE';

const item = {
  desc: '[{"key": "event_bet","suffix": "ETH","label": "Amount", "placeholder": "0.00", "type": "number", "className": "amount"}] [{"key": "event_odds", "label": "Odds", "placeholder": "2.0","prefix": "1 -", "className": "atOdds", "type": "number"}]',
};

class BettingCreate extends React.Component {
  static propTypes = {
    industryId: PropTypes.number.isRequired,
    onClickSend: PropTypes.func,
    initHandshake: PropTypes.func.isRequired,
  }

  static defaultProps = {

  }

  constructor(props) {
    super(props);

    const { bettingShake } = props;
    const { side, amountSupport, amountAgainst, marketSupportOdds, marketAgainstOdds } = bettingShake;

    const values = {};
    const defaultValue = calculateBetDefault(side, marketSupportOdds, marketAgainstOdds, amountSupport, amountAgainst);

    values.event_odds = defaultValue.marketOdds;
    values.event_bet = defaultValue.marketAmount;

    this.state = {
      values,
      isChangeOdds: false,
      winValue: defaultValue.winValue,
    };
    this.onSubmit = ::this.onSubmit;
    this.renderInput = ::this.renderInput;
    this.renderForm = ::this.renderForm;
    this.renderNumber = ::this.renderNumber;

    console.log(TAG, 'constructor', 'bettingShake', bettingShake);

  }
  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {

    const { bettingShake } = nextProps;
    console.log(TAG, 'componentWillReceiveProps', 'bettingShake', bettingShake);
    this.updateDefaultValues(bettingShake);
  }


  async onSubmit(e) {
    e.preventDefault();
    const {
      values
    } = this.state;

    const { bettingShake } = this.props;
    const { closingDate, matchName, matchOutcome } = bettingShake;
    const amount = parseBigNumber(values.event_bet);
    const odds = parseBigNumber(values.event_odds);
    const fromAddress = getAddress();


    const validate = await validateBet(amount, odds, closingDate, matchName, matchOutcome);
    const { status, message } = validate;
    if (status) {
      this.initHandshake(values, fromAddress);

    } else {
      if (message){
        this.props.showAlert({
          message: <div className="text-center">{message}</div>,
          timeOut: 3000,
          type: 'danger',
          callBack: () => {
          }
        });
      }
    }

  }

  get inputList() {
    const { content } = this;
    return content ? content.match(regex) : [];
  }

  get content() {
    const { desc } = item;
    return desc || '';
  }

  changeText(key, text) {
    const { values } = this.state;
    values[key] = text;
    this.setState({ values });
    if (key === 'event_odds') {
      console.log('Change Odds');
      this.setState({
        isChangeOdds: true,
      });
    }
    const amountBN = parseBigNumber(values.event_bet);
    const oddsBN = parseBigNumber(values.event_odds);
    const total = amountBN.times(oddsBN).toNumber();
    this.setState({
      winValue: formatAmount(total) || 0,
    });
  }

  updateDefaultValues = (bettingShake) => {
    const { values } = this.state;
    const { side, amountSupport, amountAgainst, marketSupportOdds, marketAgainstOdds } = bettingShake;

    const defaultValue = calculateBetDefault(side, marketSupportOdds, marketAgainstOdds, amountSupport, amountAgainst);

    values.event_odds = defaultValue.marketOdds;
    values.event_bet = defaultValue.marketAmount;

    const { winValue } = defaultValue;

    this.setState({ values, winValue });
  }


  renderInput(item, index, style = {}) {
    const {
      key, placeholder, type, className,
    } = item;
    const { values } = this.state;
    // const className = 'amount';
    console.log('Item:', item);
    return (
      <input
        ref={key}
        component={InputField}
        type="text"
        placeholder={placeholder}
        className={cn('form-control-custom input', className || '')}
        name={key}
        value={values[key]}
        validate={[required]}
        onChange={(evt) => {
          this.changeText(key, evt.target.value);
        }}
      />
    );
  }

  renderNumber(item, style = {}) {
    const { key, placeholder } = item;
    const { values } = this.state;
    return (
      <input
        ref={key}
        id={key}
        className="form-control-custom input"
        name={key}
        style={style}
        type="text"
        placeholder={placeholder}
        value={values[key]}
        validate={[required]}
        onChange={(evt) => {
          this.changeText(key, evt.target.value);
        }}
        onClick={(event) => { event.target.setSelectionRange(0, event.target.value.length); }}
      />
    );
  }


  renderLabelForItem=(text, { marginLeft, marginRight }) => text && (<label
    className="itemLabel"
    style={{
    display: 'flex', color: 'white', fontSize: 16, marginLeft, marginRight, alignItems: 'center',
    }}>{text}
  </label>)

  renderItem(field, index) {
    const item = JSON.parse(field.replace(regexReplace, ''));
    const {
      key, placeholder, type, label, className, prefix,
    } = item;
    let itemRender = null;// this.renderInput(item, index);
    const { isChangeOdds } = this.state;
    let suffix = item.suffix;
    if (item.key === 'event_odds') {
      suffix = isChangeOdds ? 'Your Odds' : 'Market Odds';
    }

    switch (type) {
      // case 'date':
      //   itemRender = this.renderDate(item, index);
      //   break;
      case 'number':
        itemRender = this.renderNumber(item);
        break;
      default:
        itemRender = this.renderNumber(item, index);
    }
    const classNameSuffix = `cryptoCurrency${item.className} ${(isChangeOdds && item.key === 'event_odds') ? 'cryptoCurrencyYourOdds' : ''}`;
    return (
      <div className="rowWrapper" key={index + 1} >
        <label>{label || placeholder}</label>
        {itemRender}
        {suffix && <div className={classNameSuffix}>{suffix}</div>}
      </div>
    );
  }

  renderForm() {
    const { inputList } = this;
    const { theme } = this.props;
    const { side } = this.props.bettingShake;
    const buttonClass = theme;
    const sideText = getKeyByValue(SIDE, side);
    return (
      <form className="wrapperBetting" onSubmit={this.onSubmit}>
        <div className="formInput">
          {inputList.map((field, index) => this.renderItem(field, index))}
          <div className="rowWrapper">
            <span className="amountLabel">Amount you could win</span>
            <span className="amountValue">{this.state.winValue}</span>
          </div>
        </div>
        <Button type="submit" block className={buttonClass}>Place {sideText} order</Button>
      </form>
    );
  }

  render() {
    return (
      <div>
        {this.renderForm()}
      </div>
    );
  }

  // Service
  initHandshake(fields, fromAddress) {
    //const { selectedOutcome } = this.state;
    const { side, outcomeId } = this.props.bettingShake;
    //const chainId = betHandshakeHandler;
    const params = {
      type: HANDSHAKE_ID.BETTING,
      outcome_id: outcomeId,
      odds: `${fields.event_odds}`,
      amount: `${fields.event_bet}`,
      extra_data: JSON.stringify(fields),
      currency: 'ETH',
      side: parseInt(side),
      from_address: fromAddress,
      chain_id: getChainIdDefaultWallet(),
    };

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
    const { outcomeHid, matchName, matchOutcome, side } = this.props;
    const hid = outcomeHid;


    if (status && data) {
      const isExist = isExistMatchBet(data);
      let message = MESSAGE.CREATE_BET_NOT_MATCH;
      if (isExist) {
        message = MESSAGE.CREATE_BET_MATCHED;
      }
      betHandshakeHandler.controlShake(data, hid);

      this.props.showAlert({
        message: <div className="text-center">{message}</div>,
        timeOut: 3000,
        type: 'success',
        callBack: () => {
        },
      });
      // send ga event
      try {
        GA.createBetSuccessCreatePage(matchName, matchOutcome, side);
      } catch (err) {}
    }
  }
  initHandshakeFailed = (error) => {
    console.log('initHandshakeFailed', error);
  }
}
const mapState = state => ({
  //matches: state.betting.matches,
});
const mapDispatch = ({
  initHandshake,
  showAlert,

});

export default connect(mapState, mapDispatch)(BettingCreate);
