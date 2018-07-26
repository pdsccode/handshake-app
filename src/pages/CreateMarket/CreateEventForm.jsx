import React from 'react';
import PropTypes from 'prop-types';

class CreateEventForm extends React.Component {
  static displayName = 'CreateEventForm';
  static propTypes = {
    dispatch: PropTypes.func,
  };

  renderComponent = (props, state) => {
    return (
      <div>CreateEventForm form</div>
    );
  };

  render() {
    return (
      <div className={CreateEventForm.displayName}>
        {this.renderComponent(this.props, this.state)}
      </div>
    );
  }
}

export default CreateEventForm;
