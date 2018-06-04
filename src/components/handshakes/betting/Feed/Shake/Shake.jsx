import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { connect } from 'react-redux';
import { Field } from 'redux-form';

// service, constant
import { HANDSHAKE_ID, API_URL } from '@/constants';
import createForm from '@/components/core/form/createForm';
import { required } from '@/components/core/form/validation';
import { shakeItem } from '@/reducers/handshake/action';
// import {MasterWallet} from '@/models/MasterWallet';

// components
import { InputField } from '@/components/handshakes/betting/form/customField';
import Button from '@/components/core/controls/Button';
import Toggle from './../Toggle';

import './Shake.scss';

const BettingShakeForm = createForm({
  propsReduxForm: {
    form: 'bettingShakeForm',
  },
});

const defaultAmount = 1;

class BetingShake extends React.Component {
  static propTypes = {
    outcomeId: PropTypes.number,
    onSubmitClick: PropTypes.func,
    onCancelClick: PropTypes.func,
    shakeItem: PropTypes.func.isRequired,
    wallet: PropTypes.object.isRequired,
  }

  static defaultProps = {
    outcomeId: -1,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.wallet.updatedAt !== prevState.wallet.updatedAt) {
      return { wallet: nextProps.wallet };
    }
    return null;
  }

  constructor(props) {
    super(props);
    const { odd } = props;
    this.state = {
      amount: defaultAmount,
      total: defaultAmount * odd,
      buttonClass: 'btnOK btnRed',
      wallet: this.props.wallet,
    };

    this.onSubmit = ::this.onSubmit;
    this.onCancel = ::this.onCancel;
    this.renderInputField = ::this.renderInputField;
    this.renderForm = ::this.renderForm;
    this.onToggleChange = ::this.onToggleChange;
  }

  onSubmit(values) {
    console.log('Submit');
    const { amount } = this.state;
    console.log('this.toggle', this.toggleRef.value);
    // this.props.onSubmitClick(amount);
    const side = this.toggleRef.value;
    this.shakeItem(amount, side);
  }

  onCancel() {
    console.log('Cancel');
    this.props.onCancelClick();
  }

  onToggleChange(id) {
    this.setState({ buttonClass: `btnOK ${id === 2 ? 'btnBlue' : 'btnRed'}` });
  }

  updateTotal(value) {
    console.log('value:', value);
    if (value) {
      const { odd } = this.props;
      const amount = value * odd;
      this.setState({
        amount: value,
        total: amount.toFixed(4),
      });
    }
  }

  shakeItem(amount, side) {
    const wallet = this.state.wallet.powerful.defaultWallet('ETH');
    const { outcomeId } = this.props;
    const params = {
      // to_address: toAddress ? toAddress.trim() : '',
      // public: isPublic,
      // description: content,
      // description: JSON.stringify(extraParams),
      // industries_type: industryId,
      type: HANDSHAKE_ID.BETTING,
      // type: 3,
      // extra_data: JSON.stringify(fields),
      outcome_id: outcomeId,
      amount,
      currency: 'ETH',
      side,
      chain_id: wallet.action.blockchain.chainId,
      from_address: wallet.address,
    };
    console.log(params);

    this.props.shakeItem({
      PATH_URL: API_URL.CRYPTOSIGN.SHAKE,
      METHOD: 'POST',
      data: params,
      successFn: this.shakeItemSuccess,
      errorFn: this.shakeItemFailed,
    });
  }
  shakeItemSuccess = async (successData) => {
    console.log('shakeItemSuccess', successData);
  }
  shakeItemFailed = (error) => {
    console.log('shakeItemFailed', error);
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
        <span className="label" htmlFor={id}>{label}</span>
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
    );
  }

  renderForm() {
    const { total, buttonClass } = this.state;
    const { remaining, odd } = this.props;
    const odds = `1 : ${odd}`;

    const formFieldData = [
      {
        id: 'you_bet',
        name: 'you_bet',
        label: 'You bet',
        key: 1,
        defaultValue: '1',
        onChange: evt => this.updateTotal(parseFloat(evt.target.value)),
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

    return (
      <BettingShakeForm className="wrapperBettingShake" onSubmit={this.onSubmit}>
        <p className="titleForm text-center text-capitalize">PLACE A BET</p>
        {this.renderInputField(amountField)}
        <Toggle ref={(component) => { this.toggleRef = component; }} onChange={this.onToggleChange} />

        <Button type="submit" block className={buttonClass}>
          Shake now
        </Button>
      </BettingShakeForm>
    );
  }

  render() {
    return this.renderForm();
  }
}
const mapDispatch = ({
  shakeItem,
});
export default connect((state => ({ wallet: state.wallet })), mapDispatch)(BetingShake);
