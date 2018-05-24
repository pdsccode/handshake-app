import React from 'react';
import { URL } from '@/config';
import { Grid, Row, Col } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import {WalletModel} from '../../models/Wallet'

class Wallet extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {

    WalletModel.log(WalletModel.createMasterWallet());

    return (
      <Grid>
        <Row>
          <Col xs={12}>
            wallet
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default Wallet;
