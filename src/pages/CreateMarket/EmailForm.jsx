import React from 'react';
import PropTypes from 'prop-types';

class EmailForm extends React.Component {
  static displayName = 'EmailForm';
  static propTypes = {
    dispatch: PropTypes.func,
  };

  renderComponent = (props, state) => {
    return (
      <div>Email form</div>
    );
  };

  render() {
    return (
      <div className={EmailForm.displayName}>
        {this.renderComponent(this.props, this.state)}
      </div>
    );
  }
}

export default EmailForm;
