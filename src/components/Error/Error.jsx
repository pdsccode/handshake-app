import React from 'react';
import PropTypes from 'prop-types';

class Error extends React.PureComponent {
  static propTypes = {
    error: PropTypes.string,
    className: PropTypes.string,
    show: PropTypes.bool.isRequired,
  }

  render() {
    return (
      <span className={`error ${this.props.className || ''}`}>
        {this.props.show ? this.props.error : ''}
      </span>
    );
  }
}

export default Error;
