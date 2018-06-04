import React from 'react';

// components
import Avatar from './../Avatar';

// style
import './CommentItem.scss';

class CommentItem extends React.PureComponent {

  render() {
    const {
      comment,
      userName = 'Ninja',
      image,
      userId,
    } = this.props;
    const showNinjaPosition = (index) => index >= 100 ? index : index >= 10 ? `0${index}` : `00${index}`;
    return (
      <div className="commentItem">
        <div className="userInfo">
          <Avatar />
          <span className="userName">{userName} {showNinjaPosition(userId)}</span>
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