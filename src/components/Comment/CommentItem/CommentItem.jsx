import React from 'react';

// components
import Avatar from './../Avatar';

// style
import './CommentItem.scss';

class CommentItem extends React.PureComponent {

  render() {
    const {
      comment,
      userName = 'Peter Parker',
      image,
    } = this.props;
    return (
      <div className="commentItem">
        <div className="userInfo">
          <Avatar />
          <span className="userName">{userName}</span>
        </div>
        <p className="comment">{comment}</p>
        {
          image && <img src={image} alt={comment} className="imageComment" />
        }
      </div>
    );
  }
}

export default CommentItem;
