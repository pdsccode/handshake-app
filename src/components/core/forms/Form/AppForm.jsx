import React from 'react';
import PropTypes from 'prop-types';

class AppForm extends React.PureComponent {
  static propTypes = {
    children: PropTypes.any.isRequired,
    handleSubmit: PropTypes.func.isRequired,
  }
  render() {
    return (
      <form
        className="form"
        onSubmit={this.props.handleSubmit}
        noValidate
      >
        {this.props.children}
      </form>
    );
  }
}

export default AppForm;
