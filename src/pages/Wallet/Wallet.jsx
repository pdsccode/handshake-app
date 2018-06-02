import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// components
import { Grid, Row } from 'react-bootstrap';

import Header from './Header';
import WalletItem from './WalletItem';

// style
import './Wallet.scss';

class WalletPage extends React.Component {
  static propTypes = {
    wallet: PropTypes.object.isRequired,
  }

  static getDerivedStateFromProps(nextProps, prevStates) {
    if (nextProps.wallet.isUpdated !== prevStates.isUpdated) {
      return { wallet: nextProps.wallet };
    }
    return null;
  }

  constructor(props) {
    super(props);

    this.state = {
      wallet: this.props.wallet,
    };
  }

  render() {
    return (
      <Grid>
        <Row className="list">
          <Header title="main net wallets" />
        </Row>
        <Row className="list">
          {
            this.state.wallet.powerful.mainnetList.map(wallet => (
              <WalletItem key={wallet.action.getAppKed()} wallet={wallet} />
            ))
          }
        </Row>
        <Row className="list">
          <Header title="Reward wallets" />
        </Row>
        <Row className="list">
          {
            this.state.wallet.powerful.rewardList.map(wallet => (
              <WalletItem key={wallet.action.getAppKed()} wallet={wallet} />
            ))
          }
        </Row>
        <Row className="list">
          <Header title="Test net wallets" />
        </Row>
        <Row className="list">
          {
            this.state.wallet.powerful.testnetList.map(wallet => (
              <WalletItem key={wallet.action.getAppKed()} wallet={wallet} />
            ))
          }
        </Row>
      </Grid>
    );
  }
}

export default connect(state => ({ wallet: state.wallet }))(WalletPage);
