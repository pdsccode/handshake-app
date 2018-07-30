import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadMatches } from '@/pages/Prediction/action';
import { eventSelector, isLoading } from '@/pages/Prediction/selector';
import Dropdown from '@/components/core/controls/Dropdown';
import CreateEventForm from './CreateEventForm';
import { loadReports } from './action';
import { reportSelector } from './selector';

class CreateEventContainer extends React.Component {
  static displayName = 'CreateEventContainer';
  static propTypes = {
    dispatch: PropTypes.func,
    eventList: PropTypes.array,
  };

  static defaultProps = {
    eventList: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedEvent: undefined,
      isCreateNew: false,
    };
  }

  componentDidMount() {
    this.props.dispatch(loadMatches());
    this.props.dispatch(loadReports());
  }

  onSelectEvent = (item) => {
    this.setState({
      selectedEvent: item.id ? item : undefined,
    });
  }

  onClickCreateNewEvent = () => {
    this.setState({
      isCreateNew: true,
    });
  }

  buildEventSelectorData = (props) => {
    return props.eventList.map((event) => {
      return {
        ...event,
        value: event.name,
      };
    }).concat({
      id: 0,
      value: 'Select an event',
    }).sort((a, b) => a.id - b.id);
  }

  renderEventDropdownList = (props, state) => {
    if (state.isCreateNew) return null;
    return (
      <React.Fragment>
        <label>EVENT</label>
        <Dropdown
          placeholder="Select an event"
          className="EventDropdown"
          defaultId={state.selectedEvent}
          source={this.buildEventSelectorData(props)}
          onItemSelected={this.onSelectEvent}
          hasSearch
        />
      </React.Fragment>
    );
  }

  renderOrCreateButton = (props, state) => {
    if (state.selectedEvent || state.isCreateNew) return null;
    return (
      <React.Fragment>
        <p className="CreateEventOption">Or</p>
        <button
          className="btn btn-primary btn-block"
          onClick={this.onClickCreateNewEvent}
        >
          Create a new event
        </button>
      </React.Fragment>
    );
  }

  renderCreateEventForm = (props, state) => {
    const { isCreateNew, selectedEvent } = state;
    if (!isCreateNew && !selectedEvent) return null;
    const initialValues = isCreateNew ? {
      outcomes: [{}],
    } : {
      eventName: selectedEvent.name,
      outcomes: selectedEvent.outcomes,
      creatorFee: selectedEvent.market_fee,
    };
    return (
      <CreateEventForm
        initialValues={initialValues}
        reportList={props.reportList || []}
        isNew={isCreateNew}
      />
    );
  }

  renderComponent = (props, state) => {
    return (
      <React.Fragment>
        {this.renderEventDropdownList(props, state)}
        {this.renderOrCreateButton(props, state)}
        {this.renderCreateEventForm(props, state)}
      </React.Fragment>
    );
  };

  render() {
    return (
      <div className={CreateEventContainer.displayName}>
        {this.renderComponent(this.props, this.state)}
      </div>
    );
  }
}

export default connect(
  (state) => {
    return {
      eventList: eventSelector(state),
      isLoading: isLoading(state),
      reportList: reportSelector(state),
    };
  },
)(CreateEventContainer);
