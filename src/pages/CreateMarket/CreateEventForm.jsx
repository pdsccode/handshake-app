import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { reduxForm, Field, FieldArray } from 'redux-form';
import IconPlus from '@/assets/images/icon/icon-plus.svg';
import IconTrash from '@/assets/images/icon/icon-trash.svg';
import moment from 'moment';
import DatePicker from '@/components/handshakes/betting-event/Create/DatePicker/DatePicker';
import { renderField } from './form';
import { required } from './validate';
import { addOutcomes } from './action';

class CreateEventForm extends Component {
  static displayName = 'CreateEventForm';
  static propTypes = {
    className: PropTypes.string,
    reportList: PropTypes.array,
    isNew: PropTypes.bool,
    initialValues: PropTypes.object,
  };

  static defaultProps = {
    className: '',
    reportList: undefined,
    isNew: true,
    initialValues: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      closingTime: props.initialValues.closingTime,
      reportingTime: props.initialValues.reportingTime,
      disputeTime: props.initialValues.disputeTime,
      selectedReportSource: undefined,
    };
  }

  onCreateNewEvent = (values, dispatch, props) => {
    if (!props.isNew) {
      // Add new outcomes
      const newOutcomeList = values.outcomes.filter(o => !o.id).map(i => Object.assign({}, i, { public: 0 }));
      dispatch(addOutcomes({
        eventId: values.eventId,
        newOutcomeList,
        successFn: this.handleAddOutcomeSuccess,
      }));
    } else {
      // Add new event
      console.log('values', values);
    }
  }

  setFieldValueToState = (fieldName, value) => {
    this.setState({
      [fieldName]: value,
    });
  }

  handleAddOutcomeSuccess = (data) => {
    console.log('data', data);
  }

  renderGroupTitle = (title) => {
    return (<div className="CreateEventFormGroupTitle">{title}</div>);
  }

  renderGroupNote = (text) => {
    return (<div className="CreateEventFormGroupNote">{text}</div>);
  }

  renderEvent = ({ isNew }) => {
    if (!isNew) return null;
    const title = 'CREATE AN EVENT';
    return (
      <React.Fragment>
        {this.renderGroupTitle(title)}
        <Field
          name="eventName"
          type="text"
          className="form-group"
          fieldClass="form-control"
          component={renderField}
          placeholder="Event name"
          validate={[required]}
        />
        <Field name="eventId" type="hidden" component={renderField} />
      </React.Fragment>
    );
  }

  renderOutComes = ({ fields, meta: { error }, isNew }) => {
    const title = 'OUTCOME';
    const textNote = '2.0 : Bet 1 ETH, win 1 ETH. You can adjust these odds.';
    return (
      <React.Fragment>
        { this.renderGroupTitle(title) }
        { this.renderGroupNote(textNote) }
        {
          fields.map((outcome, index) => {
            return (
              <div className="form-group-custom" key={`${outcome}.id`}>
                <Field
                  name={`${outcome}.name`}
                  type="text"
                  className="form-group"
                  fieldClass="form-control"
                  component={renderField}
                  disabled={!isNew && fields.get(index).id}
                />
                {isNew && !!index &&
                <button
                  type="button"
                  className="trash"
                  onClick={() => fields.remove(index)}
                >
                  <img src={IconTrash} alt="" />
                </button>}
              </div>
            );
          })
        }
        <button className="AddMoreOutCome" type="button" onClick={() => fields.push({})}>
          <img src={IconPlus} alt="" className="IconPlus" />
          <span>Add more outcomes</span>
        </button>
        {error && <li className="error">{error}</li>}
      </React.Fragment>
    );
  }

  renderFee = ({ isNew }) => {
    const title = 'CREATOR FEE';
    const textNote = 'The creator fee is a percentage of the total winnings of the market.';
    return (
      <React.Fragment>
        {this.renderGroupTitle(title)}
        <Field
          name="creatorFee"
          type="text"
          className="form-group"
          fieldClass="form-control"
          component={renderField}
          validate={[required]}
          disabled={!isNew}
        />
        {this.renderGroupNote(textNote)}
      </React.Fragment>
    );
  }

  renderReport = (props, state) => {
    const title = 'REPORT';
    return (
      <React.Fragment>
        {this.renderGroupTitle(title)}
        <Field name="reports" component="select" onChange={(e, newValue) => this.setFieldValueToState('selectedReportSource', newValue)}>
          <option value="">Please select a verified source</option>
          {props.reportList.map(r => <option value={r.id} key={r.id}>{`${r.name} - ${r.url}`}</option>)}
        </Field>
        {
          props.isNew && !state.selectedReportSource &&
          <React.Fragment>
            <div className="CreateEventOption">Or</div>
            <Field
              name="ownReport"
              type="text"
              className="form-group"
              fieldClass="form-control"
              component={renderField}
              placeholder="Enter your own source URL"
              validate={[required]}
            />
            {this.renderGroupNote('We will review your source and get back to you within 24 hours.')}
          </React.Fragment>
        }
      </React.Fragment>
    );
  }

  renderDateTime = ({ input, isNew, label, ...props }) => {
    const { value, name, ...inputData } = input;
    const newValue = value ? { value: moment.unix(value) } : {};
    return (
      <React.Fragment>
        {this.renderGroupTitle(label)}
        <DatePicker
          onChange={(date) => { this.setFieldValueToState(name, date); }}
          className="form-control input-field"
          dateFormat="DD MMMM YYYY"
          name={name}
          required
          {...props}
          {...inputData}
          {...newValue}
          disabled={!isNew}
        />
      </React.Fragment>
    );
  }

  renderTimeGroup = (props, state) => {
    return (
      <React.Fragment>
        <Field
          name="closingTime"
          type="text"
          component={this.renderDateTime}
          label="Closing Time"
          placeholder="Closing Time"
          timePlaceholder="Local timezone"
          validate={[required]}
          isNew={props.isNew}
          value={state.closingTime}
        />
        <Field
          name="reportingTime"
          type="text"
          component={this.renderDateTime}
          label="Reporting Time"
          placeholder="Reporting Time"
          timePlaceholder="Local timezone"
          validate={[required]}
          isNew={props.isNew}
          value={state.reportingTime}
        />
        <Field
          name="disputeTime"
          type="text"
          component={this.renderDateTime}
          label="Dispute Time"
          placeholder="Dispute Time"
          timePlaceholder="Local timezone"
          validate={[required]}
          isNew={props.isNew}
          value={state.disputeTime}
        />
      </React.Fragment>
    );
  }

  renderComponent = (props, state) => {
    const cls = classNames(CreateEventForm.displayName, {
      [props.className]: !!props.className,
    });
    return (
      <form className={cls} onSubmit={props.handleSubmit(this.onCreateNewEvent)}>
        {this.renderEvent(props)}
        <FieldArray
          name="outcomes"
          isNew={props.isNew}
          component={this.renderOutComes}
        />
        {this.renderFee(props)}
        {this.renderReport(props, state)}
        {this.renderTimeGroup(props, state)}
        <button type="submit" disabled={props.pristine || props.submitting}>
          {props.isNew ? 'Create a new event' : 'Add new outcomes'}
        </button>
      </form>
    );
  };

  render() {
    return this.renderComponent(this.props, this.state);
  }
}


export default reduxForm({
  form: 'CreateEventForm',
  enableReinitialize: true,
})(CreateEventForm);
