import React from 'react';
// style
import './CommentItem.scss';

class CommentItem extends React.PureComponent {

  render() {
    const {
      comment,
      userName = 'Peter Parker',
    } = this.props;
    return (
      <div className="comment">
        <p>{userName}</p>
        <p>{comment}</p>
      </div>
    );
  }
}

export default CommentItem;
