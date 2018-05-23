import React from 'react';
import { URL } from '@/config';
import { Grid, Row, Col } from 'react-bootstrap';

class SeedDetail extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            Seed detail
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default SeedDetail;
