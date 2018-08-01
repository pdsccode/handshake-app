import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { reduxForm, Field, FieldArray } from 'redux-form';
import IconPlus from '@/assets/images/icon/icon-plus.svg';
import IconTrash from '@/assets/images/icon/icon-trash.svg';
import moment from 'moment';
import DatePicker from '@/components/handshakes/betting-event/Create/DatePicker/DatePicker';
import { renderField } from './form';
import { required, allFieldHasData } from './validate';
import { createEvent } from './action';
import ShareMarket from './ShareMarket';

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
      shareLink: null,
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

  // handleAddOutcomeSuccess = (data) => {
  //   console.log('handleAddOutcomeSuccess', data);
  //   const { dispatch } = this.props;
  //   dispatch(generateShareLink({
  //     outcomeId: data.data[0].id,
  //     successFn: this.handleGenerateShareLink,
  //   }));
  // }

  handleGenerateShareLink = (respond) => {
    this.setState({
      shareLink: `${window.location.origin}/${respond.data.slug_short}`,
    });
  }

  addMoreOutcomes = (fields) => {
    if (fields.getAll().every(i => Object.keys(i).length > 0)) {
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
          type="text"
          className="form-group"
          fieldClass="form-control"
          component={renderField}
          validate={[required]}
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
        <Field name="reports" component="select" onChange={(e, newValue) => this.setFieldValueToState('selectedReportSource', newValue)}>
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
    const { shareLink } = state;
    if (shareLink) {
      return (<ShareMarket shareURL={shareLink} />);
    }
    return (
      <form className={cls} onSubmit={props.handleSubmit(this.onCreateNewEvent)}>
        {this.renderEvent(props)}
        <FieldArray
          name="outcomes"
          isNew={props.isNew}
          component={this.renderOutComes}
          validate={allFieldHasData}
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
