import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import createForm from '@/components/core/form/createForm';
import { eventSelector } from './selector';
import MarketForm from './MarketForm';

const EventForm = createForm({
  propsReduxForm: {
    form: 'eventForm',
    enableReinitialize: true,
    clearSubmitErrors: true,
  },
});

class CreateEventForm extends React.Component {
  static displayName = 'CreateEventForm';
  static propTypes = {
    eventList: PropTypes.instanceOf(Array),
    onSubmit: PropTypes.func,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    eventList: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      isCreate: false,
    };
  }

  handleEventChange = (event) => {
    const value = event.target.value;
  }

  handleCreateClick = () => {
    this.setState({ isCreate: true });
  }

  handleSubmit = () => {

  }

  renderUpdateOption = (props) => {
    const { onSubmit } = props;
    return (
      <EventForm className="EventForm" onSubmit={onSubmit}>
        <Field name="event" component="select" onChange={this.handleEventChange}>
          <option value="">Select an event</option>
          {props.eventList.map((event) => {
            return (<option key={event.id} value={event.name}>{event.name}</option>);
          })}
        </Field>
      </EventForm>
    );
  }

  renderCreateOption = () => {
    const { handleCreateClick } = this;
    const buttonText = 'Create a new event';
    return (<button className="btn btn-primary btn-block" onClick={handleCreateClick}>{buttonText}</button>);
  }

  renderOptions = (props) => (
    <React.Fragment>
      {this.renderUpdateOption(props)}
      <span className="CreateEventOption">Or</span>
      {this.renderCreateOption()}
    </React.Fragment>
  );

  renderTitle = () => (<div className="CreateEventTitle">Event</div>);

  renderForm = (props) => {
    const { handleSubmit } = this;
    return (
      <MarketForm handleSubmit={handleSubmit} />
    );
  }

  renderComponent = (props, state) => {
    const { isCreate } = state;
    const renderComponent = isCreate ? this.renderForm(props) : this.renderOptions(props);
    return (
      <div className="CreatEventContainer">
        <div className="CreateEventBlock">
          {this.renderTitle()}
          {renderComponent}
        </div>
      </div>
    );
  };
}

export default CreateEventForm;
