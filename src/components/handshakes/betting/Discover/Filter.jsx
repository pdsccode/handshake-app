import React from 'react';
import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
import Dropdown from '@/components/core/controls/Dropdown';

class DiscoverTabPredictionFilter extends React.Component {
  static propTypes = {
    events: PropTypes.array.isRequired,
    detectOutcome: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      selectedEvent: this.props.events[0],
      selectedOutcome: null,
      placeholder: 'Loading...',
      eventsEmpty: false,
    };

    this.events = ::this.events;
    this.outcomes = ::this.outcomes;
    this.selectEvent = ::this.selectEvent;
    this.selectOutcome = ::this.selectOutcome;
  }

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.eventsLoaded && !nextProps.events.length) {
      return { placeholder: 'Empty', eventsEmpty: true };
    }
    return null;
  }

  getStringDate() {

  }

  selectEvent(event) {
    this.setState({ selectedEvent: event });
  }

  selectOutcome(outcome) {
    this.setState({ selectedOutcome: outcome });
    this.props.detectOutcome(this.state.selectedOutcome);
  }

  events() {
    const source = [
      ...this.props.events.map(event => ({
        ...event,
        value: `Event: ${event.name} (${this.getStringDate(event.date)})`,
        marketFee: event.market_fee,
      })),
    ];

    const defaultEventId = this.props.events[0]?.id || 0;

    if (source.length) {
      source.push({
        id: -1,
        value: 'COMING SOON: Create your own event',
        className: 'disable',
        disableClick: true,
      });
    }

    console.log(defaultEventId);

    return (
      <Dropdown
        placeholder={this.state.placeholder}
        defaultId={defaultEventId}
        source={source}
        afterSetDefault={item => this.selectEvent(item)}
        onItemSelected={item => this.selectEvent(item)}
        hasSearch={!this.state.eventsEmpty}
      />
    );
  }

  outcomes() {
    let outcomes = this.state.selectedEvent?.outcomes;
    if (!outcomes?.length) outcomes = [];

    const defaultId = outcomes[0]?.id || 0;

    return (
      <Dropdown
        placeholder={this.state.placeholder}
        defaultId={defaultId}
        source={outcomes.filter(outcome => outcome.public).map(outcome => ({
          ...outcome,
          value: `Outcome: ${outcome.name}`,
          marketOdds: outcome.market_odds,
        }))}
        afterSetDefault={item => this.selectOutcome(item)}
        onItemSelected={item => this.selectOutcome(item)}
        hasSearch={!this.state.eventsEmpty}
      />
    );
  }

  render() {
    return (
      <>
        {this.events()}
        {this.outcomes()}
      </>
    );
  }
}

export default DiscoverTabPredictionFilter;
