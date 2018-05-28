import React from 'react';
import { connect } from 'react-redux';
import { URL } from '@/config';
import { Grid, Row, Col } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { setHeaderRight } from '@/reducers/app/action';

class Wallet extends React.Component {
  constructor(props) {
    super(props);

    this.props.setHeaderRight(this.headerRight());
  }

  headerRight() {
    return '+ Add new';
  }

  render() {
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

export default connect(null, ({ setHeaderRight }))(Wallet);
