import React from 'react';
import PropTypes from 'prop-types';
// style
import './CreateComment.scss';

class CreateComment extends React.PureComponent {

  render() {
    return (
      <div className="createComment">
        <input type="text" placeholder="Aa" />
      </div>
    );
  }
}

CreateComment.propTypes = {
};

export default CreateComment;
