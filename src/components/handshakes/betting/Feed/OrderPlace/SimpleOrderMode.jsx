import React from 'react';
import { connect } from 'react-redux';
import BettingCreate from '@/components/handshakes/betting/Create/CreateComponent';

class SimpleOrderMode extends React.Component {
  render() {
    return (
      <React.Fragment>
        <BettingCreate {...this.props} />
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
