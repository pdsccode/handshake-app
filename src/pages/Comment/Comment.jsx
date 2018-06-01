import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// services, constants
import { loadCommentList } from '@/reducers/comment/action';
import { API_URL } from '@/constants';
import qs from 'qs';

// components
import { Grid, Row, Col } from 'react-bootstrap';
import CreateComment from '@/components/Comment/CreateComment';
import CommentItem from '@/components/Comment/CommentItem';

// self
import './Comment.scss';

class Comment extends React.PureComponent {
  constructor(props) {
    super(props);
    this.scrollToBottom = ::this.scrollToBottom;
  }

  componentDidMount() {
    const { router, loadCommentList } = this.props;
     const queryObject = qs.parse(router.location.search.slice(1));
    if(queryObject.object_id && queryObject.object_type) {
      loadCommentList({
        PATH_URL: API_URL.COMMENT.LIST,
        qs: { object_type: queryObject.object_type, object_id: queryObject.object_id, page_size: 10 }
      });
    }
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    if(this.commentsRef) {
      this.commentsRef.scrollIntoView(false);
      // this.commentsRef.scrollTop = this.commentsRef.scrollHeight;
      // console.log(this.commentsRef.scrollHeight, this.commentsRef.scrollTop);
    }
  }

  render() {
    const { list } = this.props.comment;
    return (
      <Grid>
        <Row>
          <Col md={12} xs={12}>
            {
              list.length > 0 && (
                <div className="comments" ref={element => this.commentsRef = element}>
                  {list.map((item) => <CommentItem key={item.id} {...item} />)}
                </div>
              )
            }
            <CreateComment onCreateCb={this.scrollToBottom} />
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
};

const mapState = state => ({
  comment: state.comment,
  router: state.router,
});

const mapDispatch = ({
  loadCommentList,
});

export default connect(mapState, mapDispatch)(Comment);
