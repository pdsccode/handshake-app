import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class WalletPage extends React.Component {
  static propTypes = {
    wallet: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    console.log(this.props.wallet);
  }

  render() {
    return (
      <div />
    );
  }
}

export default connect(state => ({ wallet: state.wallet }))(WalletPage);
