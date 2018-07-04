import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Filter from '@/components/handshakes/betting/Discover/Filter';
import { loadEvents } from '@/reducers/prediction/action';

class Prediction extends React.Component {
  static propTypes = {
    setLoading: PropTypes.func.isRequired,
    loadEvents: PropTypes.func.isRequired,
    prediction: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.props.loadEvents();

    this.state = {
      events: [],
      eventsUpdatedAt: this.props.prediction.eventsUpdatedAt,
      outcome: null,
    };

    this.table = ::this.table;
    this.topTable = ::this.topTable;
    this.detectOutcome = ::this.detectOutcome;
  }

  componentDidMount() {
    this.props.setLoading(false);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.prediction.eventsUpdatedAt !== prevState.eventsUpdatedAt) {
      return { events: nextProps.prediction.events };
    }
    return null;
  }

  detectOutcome(outcome) {
    this.setState({ outcome });
  }

  topTable() {
    if (!this.state.outcome) return null;
    return (
      <div />
    );
  }

  table() {
    if (!this.state.outcome) return null;
    return null;
  }

  render() {
    return (
      <>
        <Filter events={this.state.events} detectOutcome={this.detectOutcome} />
        {this.topTable()}
        {this.table()}
      </>
    );
  }
}

export default connect(store => ({ prediction: store.prediction }), { loadEvents })(Prediction);
