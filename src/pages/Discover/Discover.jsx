import React from 'react';
import Button from '@/components/core/controls/Button';
import Error from '@/components/core/presentation/Error';
import { URL } from '@/config';
import { Grid, Row, Col } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <FormattedMessage id="HELLO" values={{ name: 'a' }} />
            <Button>Primary</Button>
            <Button cssType="danger">Danger</Button>
            <Button cssType="success">Success</Button>
          </Col>
        </Row>
        <Row>
          <Error isShow message="message error" />
        </Row>
      </Grid>
    );
  }
}

export default Dashboard;
