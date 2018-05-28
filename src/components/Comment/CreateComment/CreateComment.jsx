import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// services, constants
import { createComment, loadCommentList } from '@/reducers/comment/action';
import { API_URL } from '@/constants';

// style
import './CreateComment.scss';

class CreateComment extends React.PureComponent {
  constructor(props) {
    super(props);
    this.createComment = ::this.createComment;
  }

  createComment() {
    const data = { comment: this.inputRef.value, object_type: 'test', object_id: 1 };
    this.props.createComment({
      PATH_URL: API_URL.COMMENT.CREATE,
      METHOD: 'post',
      data,
    });
  }

  render() {
    return (
      <div className="createComment">
        <input type="text" placeholder="Aa" ref={(component) => { this.inputRef = component; }} />
        <div onClick={this.createComment} role="button">create comment</div>
      </div>
    );
  }
}

CreateComment.propTypes = {
  createComment: PropTypes.func.isRequired,
};

const mapDispatch = ({
  createComment,
});

export default connect(null, mapDispatch)(CreateComment);
