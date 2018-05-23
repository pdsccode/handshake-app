import React from 'react';
import { URL } from '@/config';
import { Grid, Row, Col } from 'react-bootstrap';

class SeedDetail extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { match } = this.props;
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            Seed detail: {match.params.slug}
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default SeedDetail;
