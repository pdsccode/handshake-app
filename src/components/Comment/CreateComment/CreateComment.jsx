import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// services, constants
import { createComment } from '@/reducers/comment/action';
import { API_URL } from '@/constants';

// components
import Image from '@/components/core/presentation/Image';

// style, icons
import './CreateComment.scss';
import createImageIcon from '@/assets/images/icon/comment/image.svg';
import postCommentIcon from '@/assets/images/icon/comment/post-comment.svg';

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
        <Image src={createImageIcon} alt="create image icon" onClick={this.createComment} />
        <textarea type="text" placeholder="Aa" ref={(component) => { this.inputRef = component; }} />
        <Image src={postCommentIcon} alt="post comment icon" onClick={this.createComment} />
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
