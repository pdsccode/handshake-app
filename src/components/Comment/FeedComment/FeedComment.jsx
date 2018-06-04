import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';
import { URL } from '@/config';

// style
import addAComment from '@/assets/images/icon/comment/add-a-comment.svg';
import './FeedComment.scss';

class FeedComment extends React.PureComponent {

  render() {
    const { numComments, objectType, objectId } = this.props;
    const commentLink = `${URL.COMMENTS_BY_SHAKE_INDEX}?objectType=${objectType}&objectId=${objectId}`;
    return (
      <div className="feedComment">
        <Link className="addAComment" to={commentLink} title="add a comment">
          <img src={addAComment} alt="add a comment" /> <span>Add a comment</span>
        </Link>
        <Link className="numComments" to={commentLink} title="numComments">
          {numComments} {numComments > 1 ? 'comments' : 'comment'}
        </Link>
      </div>
    );
  }
}

export default FeedComment;
