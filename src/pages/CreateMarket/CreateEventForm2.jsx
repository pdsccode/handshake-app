import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { renderField } from './form';
import { required } from './validate';

class CreateEventForm2 extends React.Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    dispatch: PropTypes.func.isRequired,
  };

  renderGroupTitle = (title) => (<div className="CreateEventFormGroupTitle">{title}</div>);

  renderEventGroup = () => {
    const title = 'Create an event';
    const fieldProps = {
      name: 'eventName',
      type: 'text',
      fieldClass: 'form-control',
      groupClass: 'form-group',
      errorClass: 'form-error',
      component: renderField,
      placeholder: 'Event name',
      validate: [required],
    };

    return (
      <div className="CreateEventFormGroup">
        {this.renderGroupTitle(title)}
        <Field {...fieldProps} />
      </div>
    );
  }

  renderOutComeGroup = () => {
    const title = 'Outcome';
    const buttonTxt = 'Add more outcomes';
    const fieldProps = {
      name: 'outcome',
      type: 'text',
      fieldClass: 'form-control',
      groupClass: 'form-group',
      errorClass: 'form-error',
      component: renderField,
      placeholder: 'outcome',
      validate: [required],
    };

    return (
      <div className="CreateEventFormGroup">
        {this.renderGroupTitle(title)}
        <Field {...fieldProps} />
        <button type="button">{buttonTxt}</button>
      </div>
    );
  }

  renderFeeGroup = () => {
    const title = 'Create fee';
    const note = 'The creator fee is a percentage of the total winnings of the market.';
    const fieldProps = {
      name: 'fee',
      type: 'text',
      fieldClass: 'form-control',
      groupClass: 'form-group',
      errorClass: 'form-error',
      component: renderField,
      placeholder: 'fee',
      validate: [required],
    };
    return (
      <div className="CreateEventFormGroup">
        {this.renderGroupTitle(title)}
        <Field {...fieldProps} />
        <div className="CreateEventFormGroupNote">{note}</div>
      </div>
    );
  }

  renderReportGroup = () => {
    const title = 'Report';
    const note = 'We will review your source and get back to you within 24 hours.';
    return (
      <div className="CreateEventFormGroup">
        {this.renderGroupTitle(title)}
        <Field name="report" type="text" component="select" />
        <div className="CreateEventFormGroupSplit">Or</div>
        <Field name="report" type="text" component={renderField} validate={[required]} />
        <div className="CreateEventFormGroupNote">{note}</div>
      </div>
    );
  }

  renderTimeGroup = () => {
    return (
      <div className="CreateEventFormGroup">
        <Field name="eventName" type="text" component={renderField} validate={[required]} />
        <Field name="eventName" type="text" component={renderField} validate={[required]} />
        <div className="CreateEventFormGroupNotice">
          <div className="MarketFromGroupNoticeTitle">Dispute time</div>
          <div className="MarketFromGroupNoticeTimeCount">7 days after report</div>
          <div className="MarketFromGroupNoticeTime">
            <span className="TimeLabel">From</span>
            <span className="TimeUTC">23 Oct, 2:20pm +UTC</span>
            <span className="TimeLabel">To</span>
            <span className="TimeUTC">23 Oct, 4:00pm +UTC</span>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <Form className="CreateEventForm" onSubmit={this.props.handleSubmit}>
        {this.renderEventGroup()}
        {this.renderOutComeGroup()}
        {this.renderFeeGroup()}
        {this.renderReportGroup()}
        {this.renderTimeGroup()}
      </Form>
    );
  }
}

export default CreateEventForm2;
