import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';

import CreateComment from '@/components/Comment/CreateComment';
import ListComents from '@/components/Comment/ListComments';

class Comment extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <Grid>
        <Row>
          <Col md={12} xs={12}>
            <ListComents />
            <CreateComment />
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default Comment;
