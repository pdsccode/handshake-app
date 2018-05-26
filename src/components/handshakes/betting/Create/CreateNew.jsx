import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// service, constant
import createForm from '@/components/core/form/createForm';
import { required } from '@/components/core/form/validation';
import { Field } from "redux-form";
import { initHandshake } from '@/reducers/handshake/action';

// components
import Button from '@/components/core/controls/Button';
import Input from '@/components/core/forms/Input/Input';
import DatePicker from '@/components/handshakes/betting/Create/DatePicker';
import { fieldInput, fieldCleave, fieldDropdown } from '@/components/core/form/customField';

// self
import './Create.scss';

const nameFormExchangeCreate = 'bettingCreate';
const BettingCreateForm = createForm({
  propsReduxForm: {
    form: nameFormExchangeCreate,
  },
});

const regex = /\[.*?\]/g;
const regexReplace = /\[|\]/g;
const regexReplacePlaceholder = /\[.*?\]/;

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
      "desc": "[{\"key\": \"event_name\", \"label\": \"Event\", \"placeholder\": \"event name\", \"type\": \"input\"}] [{\"key\": \"event_date\", \"label\": \"Date\", \"placeholder\": \"11/6/2018\", \"type\": \"date\"}] [{\"key\": \"event_predict\", \"label\": \"I predict\", \"placeholder\": \"Brazil will win\"}] [{\"key\": \"event_odds\", \"label\": \"Odds\", \"placeholder\": \"10\"}] [{\"key\": \"event_bet\", \"label\": \"Bet\", \"placeholder\": \"10 ETH\", \"type\": \"number\"}]",
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
      values: []
    };
    this.onSubmit = ::this.onSubmit;
    this.renderInput = ::this.renderInput;
    this.renderDate = ::this.renderDate;
    this.renderForm = ::this.renderForm;
    this.renderNumber = ::this.renderNumber;
  }

  onSubmit(values) {
    console.log("values", values);
    let content = this.content;
    const inputList = this.inputList;
    let extraParams = values;

    inputList.forEach(element => {
      const item = JSON.parse(element.replace(regexReplace, ''));
      const {key, placeholder, type} = item;
      const valueInputItem = values[key];

      content = content.replace(
        regexReplacePlaceholder,
        valueInputItem ? valueInputItem : ''
      );
    });

    const {toAddress, isPublic, industryId} = this.props;

    const params = {
      to_address: toAddress ? toAddress.trim() : '',
      public: isPublic,
      //description: content,
      // description: JSON.stringify(extraParams),
      industries_type: industryId,
      extraParams,
    };

    //Call API
    this.props.initHandshake({PATH_URL: 'handshake?public=0&chain_id=4'});

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
    let className = 'form-control-custom input';
    const plusClassName = key === 'odd' ? ' oddInput' : '';
    className += plusClassName;
    return (
      <Field
        component="input"
        type="text"
        placeholder={placeholder}
        className={className}
        name={key}
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
        onChange={(selectedDate) => console.log(selectedDate)}
        inputProps={{
          readOnly: true,
          className: 'form-control-custom input',
          ref: (component) => {
            this.datePickerRef = component;
          },
        }}
        defaultValue={new Date()}
        closeOnSelect
      />
    );
  }

  renderNumber(item) {
    const {key, placeholder} = item;

    return (
      <Field
        className="form-control-custom input"
        name={key}
        component="input"
        type="number"
        min="0.0001"
        placeholder={placeholder}
        onChange={(evt) => {
          this.changeText(key, evt.target.value)
        }}
      />
    );
  }

  renderItem(field, index) {
    const item = JSON.parse(field.replace(regexReplace, ''));
    const {key, placeholder, type, label} = item;
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
      <div key={index} className="rowWrapper">
        <label className="label">{label || placeholder}</label>
        {key === 'event_odds' && <span className="oddLabel">1 : </span>}
        {itemRender}
      </div>
    );
  }

  renderForm() {
    const inputList = this.inputList;
    return (
      <BettingCreateForm className="wrapperBetting" handleSubmit={this.onSubmit} noValidate>
        {inputList.map((field, index) =>
          this.renderItem(field, index)
        )}
        <Button type="submit" block onClick={this.onSubmit}>Sign & Send</Button>
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
}

const mapDispatch = ({
  initHandshake,
});

export default connect(null, mapDispatch)(BettingCreate);
