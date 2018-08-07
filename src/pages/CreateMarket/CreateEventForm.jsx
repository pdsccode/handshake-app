import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { reduxForm, Field, FieldArray } from 'redux-form';
import IconPlus from '@/assets/images/icon/icon-plus.svg';
import IconTrash from '@/assets/images/icon/icon-trash.svg';
import moment from 'moment';
import DateTimePicker from '@/components/DateTimePicker/DateTimePicker';
import { renderField } from './form';
import { required, urlValidator, intValidator } from './validate';
import { createEvent } from './action';
import ShareMarket from './ShareMarket';

class CreateEventForm extends Component {
  static displayName = 'CreateEventForm';
  static propTypes = {
    className: PropTypes.string,
    reportList: PropTypes.array,
    isNew: PropTypes.bool,
    initialValues: PropTypes.object,
    shareEvent: PropTypes.object,
  };

  static defaultProps = {
    className: '',
    reportList: undefined,
    isNew: true,
    initialValues: {},
    shareEvent: null,
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
    dispatch(createEvent({
      values,
      isNew: props.isNew,
      selectedSource: this.state.selectedReportSource,
    }));
  }

  setFieldValueToState = (fieldName, value) => {
    this.setState({
      [fieldName]: value,
    });
  }

  addMoreOutcomes = (fields) => {
    const isValid = fields.getAll().every(o => {
      return o.name && o.name.trim();
    });
    if (isValid) {
      fields.push({});
    }
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

  renderOutComes = (props) => {
    const { fields, meta: { error }, isNew } = props;
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
                  validate={[required]}
                  disabled={!isNew && fields.get(index).id}
                />
                {!fields.get(index).id && !!index &&
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
        {/*{error && <li className="ErrorMsg">{error}</li>}*/}
        <button
          className="AddMoreOutCome"
          type="button"
          disabled={error}
          onClick={() => this.addMoreOutcomes(fields)}
        >
          <img src={IconPlus} alt="" className="IconPlus" />
          <span>Add more outcomes</span>
        </button>
      </React.Fragment>
    );
  }

  renderFee = ({ isNew }) => {
    const title = 'CREATOR FEE';
    const textNote = 'The creator fee is a percentage of the total winnings of the market.';
    return (
      <div className="CreateEventFormBlock">
        {this.renderGroupTitle(title)}
        <Field
          name="creatorFee"
          type="number"
          className="form-group"
          fieldClass="form-control"
          component={renderField}
          validate={[required, (n) => intValidator(n, 0, 100)]}
          disabled={!isNew}
        />
        {this.renderGroupNote(textNote)}
      </div>
    );
  }

  renderReport = (props, state) => {
    const title = 'REPORT';
    return (
      <React.Fragment>
        {this.renderGroupTitle(title)}
        <Field
          name="reports"
          component="select"
          disabled={!props.isNew}
          onChange={(e, newValue) => this.setFieldValueToState('selectedReportSource', newValue)}
        >
          <option value="">Please select a verified source</option>
          {props.reportList.map(r => <option value={r.id} key={r.id}>{`${r.name} - ${r.url}`}</option>)}
        </Field>
        {
          props.isNew && !state.selectedReportSource &&
          <React.Fragment>
            <div className="CreateEventOption">Or</div>
            <Field
              name="ownReportName"
              type="text"
              className="form-group"
              fieldClass="form-control"
              component={renderField}
              placeholder="Enter your own source name"
              validate={[required]}
            />
            <Field
              name="ownReportUrl"
              type="text"
              className="form-group"
              fieldClass="form-control"
              component={renderField}
              placeholder="Enter your own source URL"
              validate={[required, urlValidator]}
            />
            {this.renderGroupNote('We will review your source and get back to you within 24 hours.')}
          </React.Fragment>
        }
      </React.Fragment>
    );
  }

  unixToDateFormat = (value) => {
    if (!value) return value;
    return moment.unix(value).format('DD MMMM YYYY HH:mm');
  }

  renderDateTime = ({ input, disabled, type, placeholder, startDate, meta }) => {
    const { value, name, ...onEvents } = input;
    const { touched, dirty, error, warning } = meta;
    const inputProps = {
      name,
      type,
      placeholder,
      disabled,
    };
    const cls = classNames({
      'form-error': error,
      'form-warning': warning,
    });
    return (
      <div className={cls}>
        <DateTimePicker
          onDateChange={(date) => this.setFieldValueToState(name, date)}
          value={value}
          inputProps={inputProps}
          {...onEvents}
          startDate={startDate}
          popupTriggerRenderer={this.buildPicker}
        />
        {(touched || dirty) && ((error && <span className="ErrorMsg">{error}</span>) || (warning && <span className="WarningMsg">{warning}</span>))}
      </div>
    );
  }

  renderTimeGroup = (props, state) => {
    const minStep = 30;
    const secStep = minStep * 60;
    const closingStartTime = moment().add(minStep, 'm').unix();
    // const reportingStartTime = state.closingTime ? state.closingTime + secStep : closingStartTime + secStep;
    // const disputeStartTime = state.reportingTime ? state.reportingTime + secStep : reportingStartTime + secStep;
    return (
      <React.Fragment>
        <Field
          name="closingTime"
          type="text"
          component={this.renderDateTime}
          placeholder="Closing Time"
          validate={[required]}
          disabled={!props.isNew}
          value={state.closingTime}
          startDate={closingStartTime}
        />
        <Field
          name="reportingTime"
          type="text"
          component={this.renderDateTime}
          placeholder="Reporting Time"
          validate={[required]}
          disabled={!props.isNew || !state.closingTime}
          value={state.reportingTime}
          startDate={state.closingTime + secStep}
        />
        <Field
          name="disputeTime"
          type="text"
          component={this.renderDateTime}
          placeholder="Dispute Time"
          validate={[required]}
          disabled={!props.isNew || !state.reportingTime}
          value={state.disputeTime}
          startDate={state.reportingTime + secStep}
        />
      </React.Fragment>
    );
  }

  renderComponent = (props, state) => {
    const cls = classNames(CreateEventForm.displayName, {
      [props.className]: !!props.className,
    });
    const { isNew, shareEvent } = props;
    if (shareEvent) {
      return (<ShareMarket shareEvent={shareEvent} isNew={isNew} />);
    }
    return (
      <form className={cls} onSubmit={props.handleSubmit(this.onCreateNewEvent)}>
        {this.renderEvent(props)}
        <FieldArray
          name="outcomes"
          isNew={props.isNew}
          component={this.renderOutComes}
        />
        {this.renderFee(props)}
        <div className="CreateEventFormBlock">
          {this.renderReport(props, state)}
          {this.renderTimeGroup(props, state)}
          <button type="submit" className="btn btn-primary btn-block" disabled={props.pristine || props.submitting}>
            {props.isNew ? 'Create a new event' : 'Add new outcomes'}
          </button>
        </div>
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
