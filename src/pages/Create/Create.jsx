import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import CreateSeedItem from '../../components/SeedAndBazaar/forms/CreateSeedItem';

class Create extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            create
            <CreateSeedItem />
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default Create;
