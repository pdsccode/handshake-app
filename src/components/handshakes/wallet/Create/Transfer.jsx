import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import TransferCoin from '@/components/Wallet/TransferCoin';

import history from '@/services/history';
import { URL } from '@/constants';
// import ConfirmButton from '@/components/Wallet/ConfirmButton/ConfirmButton';
// import BackupWallet from '@/components/Wallet/BackupWallet/BackupWallet';
// import RestoreWallet from '@/components/Wallet/RestoreWallet/RestoreWallet';

class Transfer extends React.Component {
  render() {
    return (
      // <TransferCoin coinName="BTC" toAddress = 'ABC' amount={0.01} onFinish={() => {}} />
      <TransferCoin onFinish={() => { this.props.history.goBack(); }} />
      // <BackupWallet onFinish={() => { }}/>
      // <RestoreWallet/>
      // <ConfirmButton icon={} buttonText="Slide to Send" onConfirmed={()=> { alert("confirmed");}}/>
    );
  }
}

export default Transfer;
