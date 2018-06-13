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
      creatorFee: null,
      referralFee: null,
    };
  }

  updateFormField = (event,stateName) => {
    this.setState({
      [stateName]: event.target.value,
    });
  }

  submitBettingEvent() {
    console.log('test');
  }

  changeDate(date,stateName) {
    this.setState({
      [stateName]: date,
    });
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
            onChange={evt => this.updateFormField(evt, 'eventName')}
            validate={[required]}
          />
          <Field
            name="outcome"
            type="text"
            className="form-control input-field"
            placeholder="Outcome"
            component={fieldInput}
            value={this.state.outcome}
            onChange={evt => this.updateFormField(evt, 'outcome')}
            validate={[required]}
          />
          <DatePicker onChange={(date)=>{this.changeDate(date, 'closingTime')}} className="form-control input-field" placeholder="Closing Time" />
          <Label for="reporting" className="font-weight-bold text-uppercase reporting-label">Reporting</Label>
          <Field
            name="reportingSource"
            type="text"
            className="form-control input-field"
            placeholder="Resolution source"
            component={fieldInput}
            value={this.state.resolutionSource}
            onChange={evt => this.updateFormField(evt, 'resolutionSource')}
            validate={[required]}
          />
          <DatePicker onChange={(date)=>{this.changeDate(date, 'reportingTime')}} className="form-control input-field"  placeholder="Reporting Time" />
          <Field
            name="reporting-time"
            type="text"
            className="form-control input-field"
            placeholder="Reporting Time"
            component={fieldInput}
            value={this.state.outcome}
            onChange={evt => this.updateFormField(evt, 'outcome')}
            validate={[required]}
          />
          <Label for="creatorFee" className="font-weight-bold text-uppercase fees-label">Fees</Label>
          <Field
            name="creatorFee"
            type="number"
            className="form-control input-field"
            placeholder="Creator Fee"
            component={fieldInput}
            value={this.state.creatorFee}
            onChange={evt => this.updateFormField(evt, 'creatorFee')}
            validate={[required]}
          />
          <Label for="feesDesc" className="">Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis aliquid iure illum dolor asperiores. </Label>
          <Label for="referralFee" className="font-weight-bold text-uppercase fees-label">Referral</Label>
          <Field
            name="referralFee"
            type="number"
            className="form-control input-field"
            placeholder="Creator Fee"
            component={fieldInput}
            value={this.state.referralFee}
            onChange={evt => this.updateFormField(evt, 'referralFee')}
            validate={[required]}
          />
          <Label for="reffeesDesc" className="">Lorem ipsum dolor sit amet consectetur adipisicing elit. </Label>
        </SaveBettingEventForm>
        <Button type="submit" block className="btnGreen submit-button">Submit</Button>
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
