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
    };

    this.events = ::this.events;
    this.outcomes = ::this.outcomes;
    this.selectEvent = ::this.selectEvent;
    this.selectOutcome = ::this.selectOutcome;
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
    return (
      <Dropdown
        placeholder="Loading..."
        defaultId={this.props.events[0]?.id || 0}
        source={
          [...this.props.events.map(event => ({
            ...event,
            value: `Event: ${event.name} (${this.getStringDate(event.date)})`,
            marketFee: event.market_fee,
          })),
          {
            id: -1,
            value: 'COMING SOON: Create your own event',
            className: 'disable',
            disableClick: true,
          },
        ]}
        afterSetDefault={item => this.selectEvent(item)}
        onItemSelected={item => this.selectEvent(item)}
        hasSearch
      />
    );
  }

  outcomes() {
    let outcomes = this.state.selectedEvent?.outcomes;
    if (!outcomes?.length) outcomes = [];

    return (
      <Dropdown
        placeholder="Loading..."
        defaultId={outcomes[0]?.id || 0}
        source={outcomes.filter(outcome => outcome.public).map(outcome => ({
          ...outcome,
          value: `Outcome: ${outcome.name}`,
          marketOdds: outcome.market_odds,
        }))}
        afterSetDefault={item => this.selectOutcome(item)}
        onItemSelected={item => this.selectOutcome(item)}
        hasSearch
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
