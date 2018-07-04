import React from 'react';
import { URL } from '@/constants';
import ReceiveCoin from '@/components/Wallet/ReceiveCoin';

class Receive extends React.Component {
  render() {
    return (
      <ReceiveCoin onFinish={() => { this.props.history.goBack();} }/>
    );
  }
}

export default Receive;
