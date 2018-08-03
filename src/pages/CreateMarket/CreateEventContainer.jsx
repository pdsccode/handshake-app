import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { eventSelector } from '@/pages/Prediction/selector';
import Loading from '@/components/Loading';
import Dropdown from '@/components/core/controls/Dropdown';
import CreateEventForm from './CreateEventForm';
import { loadCreateEventData } from './action';
import { reportSelector, shareEventSelector, isLoading } from './selector';


class CreateEventContainer extends React.Component {
  static displayName = 'CreateEventContainer';
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    eventList: PropTypes.array,
  };

  static defaultProps = {
    eventList: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedEvent: 0,
    };
  }

  componentDidMount() {
    this.props.dispatch(loadCreateEventData());
  }

  onSelectEvent = (item) => {
    this.setState({
      selectedEvent: item.id ? item : 0,
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
      value: 'Create a new event',
    }).sort((a, b) => a.id - b.id);
  }

  renderGroupTitle = (title) => (<div className="CreateEventFormGroupTitle">{title}</div>);

  renderEventDropdownList = (props, state) => {
    const title = 'EVENT';
    const { shareEvent } = props;
    if (shareEvent) return null;
    return (
      <React.Fragment>
        {this.renderGroupTitle(title)}
        <Dropdown
          placeholder="Create a new event"
          className="EventDropdown"
          defaultId={state.selectedEvent}
          source={this.buildEventSelectorData(props)}
          onItemSelected={this.onSelectEvent}
          hasSearch
        />
      </React.Fragment>
    );
  }

  renderCreateEventForm = (props, state) => {
    const { selectedEvent } = state;
    const initialValues = !selectedEvent ? {
      outcomes: [{}],
    } : {
      eventId: selectedEvent.id,
      eventName: selectedEvent.name,
      outcomes: selectedEvent.outcomes,
      creatorFee: selectedEvent.market_fee,
      reports: selectedEvent.source_id,
      closingTime: selectedEvent.date,
      reportingTime: selectedEvent.reportTime,
      disputeTime: selectedEvent.disputeTime,
    };
    return (
      <CreateEventForm
        initialValues={initialValues}
        reportList={props.reportList || []}
        isNew={!selectedEvent}
        shareEvent={props.shareEvent}
        dispatch={props.dispatch}
      />
    );
  }

  renderComponent = (props, state) => {
    return (
      <React.Fragment>
        <Loading isLoading={props.isLoading} />
        {this.renderEventDropdownList(props, state)}
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
      shareEvent: shareEventSelector(state),
    };
  },
)(CreateEventContainer);
