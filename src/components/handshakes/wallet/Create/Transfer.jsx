import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import TransferCoin from '@/components/Wallet/TransferCoin';

class Transfer extends React.Component {
  render() {
    return (
      <TransferCoin onFinish={() => {}} />
    );
  }
}

export default Transfer;
