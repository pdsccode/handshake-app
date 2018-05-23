import React from 'react';
import { URL } from '@/config';
import { Grid, Row, Col } from 'react-bootstrap';

class Seed extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            Seed
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default Seed;
