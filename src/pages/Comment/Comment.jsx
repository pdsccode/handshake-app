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
    const { location, loadCommentList } = this.props;
    const queryObject = qs.parse(location.search.slice(1));
    if(queryObject.objectId && queryObject.objectType) {
      loadCommentList({
        PATH_URL: API_URL.COMMENT.LIST,
        qs: { object_type: queryObject.objectType, object_id: queryObject.objectId, page_size: 10 },
      });
    }
    this.scrollToBottom();
  }

  componentDidUpdate() {
    setTimeout(this.scrollToBottom, 300);
  }

  scrollToBottom() {
    if(this.commentsRef && typeof window !== 'undefined') {
      window.scrollTo({
        top: this.commentsRef.scrollHeight,
        behavior: 'smooth',
      });
    }
  }

  render() {
    const { list } = this.props.comment;
    const queryObject = qs.parse(this.props.router.location.search.slice(1));
    return (
      <Grid>
        <Row>
          <Col md={12} xs={12}>
            {
              list.length > 0 && (
                <div className="comments" ref={element => this.commentsRef = element} id="listComments">
                  {list.map((item) => <CommentItem key={item.id} {...item} />)}
                  <div className="lastCommentItem" />
                </div>
              )
            }
            <CreateComment
              onCreateCb={this.scrollToBottom}
              {...queryObject}
            />
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
