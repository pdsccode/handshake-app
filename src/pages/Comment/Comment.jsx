import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// services, constants
import { loadCommentList, success } from '@/reducers/comment/action';
import { API_URL } from '@/constants';

// components
import { Grid, Row, Col } from 'react-bootstrap';
import CreateComment from '@/components/Comment/CreateComment';
import CommentItem from '@/components/Comment/CommentItem';

class Comment extends React.PureComponent {
  constructor(props) {
    super(props);
    props.loadCommentList({ PATH_URL: API_URL.COMMENT.LIST, qs: { object_type: 'test', object_id: 1 } });
  }

  render() {
    console.log("this.props.comment", this.props.comment);
    const { list } = this.props.comment;
    return (
      <Grid>
        <Row>
          <Col md={12} xs={12}>
            {list.map((item) => <CommentItem key={item.id} {...item} />)}
            <CreateComment />
          </Col>
        </Row>
      </Grid>
    );
  }
}

Comment.propTypes = {
  comment: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  loadCommentList: PropTypes.func.isRequired,
  success: PropTypes.func.isRequired, // temp
};

const mapState = state => ({
  comment: state.comment,
  router: state.router,
});

const mapDispatch = ({
  loadCommentList,
  success, // temp
});

export default connect(mapState, mapDispatch)(Comment);
