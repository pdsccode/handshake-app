import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import CreditCard from './components/CreditCard'

class Exchange extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <CreditCard />
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default Exchange;
