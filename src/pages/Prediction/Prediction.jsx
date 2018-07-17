import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import NavigationBar from '@/modules/NavigationBar/NavigationBar';
import { eventSelector } from './selector';
import { loadMatches } from './action';
import EventItem from './EventItem';

import './Prediction.scss';

class Prediction extends React.Component {
  static displayName = 'Prediction';
  static propTypes = {
    eventList: PropTypes.array,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    eventList: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(loadMatches());
  }

  renderEventList = (props) => {
    if (!props.eventList || !props.eventList.length) return null;
    return (
      <div className="EventList">
        {props.eventList.map((event) => {
          return <EventItem key={event.id} event={event} />;
        })}
      </div>
    );
  }

  renderComponent = (props) => {
    return (
      <div className={Prediction.displayName}>
        <NavigationBar />
        {this.renderEventList(props)}
      </div>
    );
  }

  render() {
    return this.renderComponent(this.props);
  }
}

export default connect(
  (state) => {
    return {
      eventList: eventSelector(state),
    };
  },
)(Prediction);
