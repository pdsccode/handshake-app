import React from 'react';
import PropTypes from 'prop-types';

class Label extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { className, children, ...props } = this.props;
    return (
      <label className={`custom-control-label ${className || ''}`} {...props}>
        {children}
      </label>
    );
  }
}

Label.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Label;
