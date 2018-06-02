import React from 'react';
import PropTypes from 'prop-types';

// style
import addAComment from '@/assets/images/icon/comment/add_a_comment.svg';
import './FeedComment.scss';

class FeedComment extends React.PureComponent {

  render() {
    const { numComments } = this.props;
    return (
      <div className="feedComment">
        <div className="addAComment">
          <img src={addAComment} alt="add a comment" /> <span>Add a comment</span>
        </div>
        <div className="numComments">
          {numComments} {numComments > 1 ? 'comments' : 'comment'}
        </div>
      </div>
    );
  }
}

export default FeedComment;
