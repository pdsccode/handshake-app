import React from 'react';
import { connect } from 'react-redux';
import BettingCreate from '@/components/handshakes/betting/Create/CreateComponent';

class SimpleOrderMode extends React.Component {
  renderMarketFee = (props) => {
    const { matchMarketFee } = props.bettingShake;
    return (
      <div className="matchMarketFee">
        <span>Market Fee</span>
        <span className="feeValue">{matchMarketFee || 0}%</span>
      </div>
    );
  }
  render() {
    return (
      <React.Fragment>
        <BettingCreate {...this.props} />
        {this.renderMarketFee(this.props)}
      </React.Fragment>
    );
  }
}

export default connect(state => ({
  firebaseApp: state.firebase.data,
  isBannedCash: state.app.isBannedCash,
  isBannedPrediction: state.app.isBannedPrediction,
  isBannedChecked: state.app.isBannedChecked,
}))(SimpleOrderMode);
