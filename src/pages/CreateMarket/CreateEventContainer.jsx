import React from 'react';
import PropTypes from 'prop-types';
import { loadMatches } from '@/pages/Prediction/action';
import { eventSelector, isLoading } from '@/pages/Prediction/selector';
import { connect } from 'react-redux';
import CreateEventForm from './CreateEventForm';

class CreateEventContainer extends React.Component {
  static displayName = 'CreateEventContainer';
  static propTypes = {
    dispatch: PropTypes.func,
    eventList: PropTypes.array,
  };

  static defaultProps = {
    eventList: [],
  };

  componentDidMount() {
    this.props.dispatch(loadMatches());
  }

  renderComponent = (props) => {
    return (
      <CreateEventForm />
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
    };
  },
)(CreateEventContainer);
