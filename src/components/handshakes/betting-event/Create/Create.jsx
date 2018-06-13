import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, formValueSelector, clearFields } from 'redux-form';
import Button from '@/components/core/controls/Button';
import { fieldDropdown, fieldInput, fieldRadioButton } from '@/components/core/form/customField';
import createForm from '@/components/core/form/createForm';
import { required } from '@/components/core/form/validation';
import { Label } from 'reactstrap';
import DatePicker from './DatePicker';
import './Create.scss';

const SaveBettingEventForm = createForm({ propsReduxForm: { form: 'saveBettingEvent', enableReinitialize: true, clearSubmitErrors: true } });

class CreateBettingEvent extends React.Component {
  static propTypes = {
    // children: PropTypes.any.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      eventName: '',
      outcome: '',
      closingTime: '',
      resolutionSource: '',
      reportingTime: '',
      fees: null,
      referralFees: '',
    };
  }

  submitBettingEvent() {
    console.log('test');
  }

  changeClosingTime() {
    console.log('t1');
  }

  render() {
    return (
      <div>
        <SaveBettingEventForm className="save-betting-event" onSubmit={this.submitBettingEvent}>
          <Label for="eventName" className="font-weight-bold text-uppercase event-label">Event</Label>
          <Field
            name="eventName"
            type="text"
            className="form-control input-event-name input-field"
            placeholder="Event name"
            component={fieldInput}
            value={this.state.eventName}
            onChange={evt => this.updateFormField(evt, this.state.eventName)}
            validate={[required]}
          />
          <Field
            name="outcome"
            type="text"
            className="form-control input-field"
            placeholder="Outcome"
            component={fieldInput}
            value={this.state.outcome}
            onChange={evt => this.updateFormField(evt, this.state.outcome)}
            validate={[required]}
          />
          <DatePicker onChange={this.changeClosingTime} className="form-control input-field" placeholder="Closing Time" />
          <Label for="reporting" className="font-weight-bold text-uppercase reporting-label">Reporting</Label>
          <Field
            name="reportingSource"
            type="text"
            className="form-control input-field"
            placeholder="Resolution source"
            component={fieldInput}
            value={this.state.resolutionSource}
            onChange={evt => this.updateFormField(evt, this.state.resolutionSource)}
            validate={[required]}
          />
          <DatePicker onChange={this.changeClosingTime} className="form-control input-field"  placeholder="Reporting Time" />
          <Field
            name="outcome"
            type="text"
            className="form-control input-field"
            placeholder="Outcome"
            component={fieldInput}
            value={this.state.outcome}
            onChange={evt => this.updateFormField(evt, this.state.outcome)}
            validate={[required]}
          />
        </SaveBettingEventForm>
      </div>
    );
  }
}

// const mapState = (state) => {
//   const { auth } = state;
//   return { auth };
// };

export default CreateBettingEvent;

// export default connect(mapState)(NewComponent);
