import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadMatches } from '@/pages/Prediction/action';
import { eventSelector, isLoading } from '@/pages/Prediction/selector';
import Dropdown from '@/components/core/controls/Dropdown';
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

  onSelectEvent = (item) => {
    console.log('item', item);
  }

  buildEventSelectorData = (props) => {
    return props.eventList.map((event) => {
      return {
        id: event.id,
        value: event.name,
        priority: event.id,
      };
    });
  }

  onClickCreateNewEvent = () => {
    // set state isCreateNew
  }

  renderComponent = (props) => {
    return (
      <div>
        <label>EVENT</label>
        <Dropdown
          placeholder="Select an event"
          className="EventDropdown"
          source={this.buildEventSelectorData(props)}
          onItemSelected={this.onSelectEvent}
          hasSearch
        />
        <p className="CreateEventOption">Or</p>
        <button className="btn btn-primary btn-block" onClick={this.onClickCreateNewEvent}>
          Create a new event
        </button>
      </div>
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
