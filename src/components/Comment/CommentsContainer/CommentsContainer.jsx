import React from 'react';
import PropTypes from 'prop-types';

import CreateComment from './../CreateComment';
import ListComents from './../ListComents';

// style
import './CommentsContainer.scss';

class CommentsContainer extends React.PureComponent {

  render() {
    return (
      <div>
        <ListComents />
        <CreateComment />
      </div>
    );
  }
}

CommentsContainer.propTypes = {
};

export default CommentsContainer;
