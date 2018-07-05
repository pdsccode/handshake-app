import React from 'react';
import PropTypes from 'prop-types';
// import { connect } from 'react-redux';

class ExchangeBetting extends React.Component {
  static propTypes = {
    setLoading: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.props.setLoading(false);
  }

  render() {
    return (
      <div />
    );
  }
}

// const mapState = (state) => {
//   const { auth } = state;
//   return { auth };
// };

export default ExchangeBetting;
