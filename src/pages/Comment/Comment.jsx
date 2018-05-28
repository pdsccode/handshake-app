import React from 'react';
import { connect } from 'react-redux';

// components
import { Grid, Row, Col } from 'react-bootstrap';
import CreateComment from '@/components/Comment/CreateComment';
import ListComents from '@/components/Comment/ListComments';

class Comment extends React.PureComponent {
  constructor(props) {
    super(props);
    props.loadDiscoverList({ PATH_URL: 'handshake', qs: { public: 0, chain_id: 4 } });
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

Comment.propTypes = {
  discover: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  loadDiscoverList: PropTypes.func.isRequired,
  success: PropTypes.func.isRequired, // temp
};

const mapState = state => ({
  discover: state.discover,
  router: state.router,
});

const mapDispatch = ({
  loadDiscoverList,
  success, // temp
});

export default Comment;
