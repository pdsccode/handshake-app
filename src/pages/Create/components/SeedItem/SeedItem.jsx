import React from 'react';
import PropTypes from 'prop-types';

// style
import './SeedItem.scss';

class SeedItem extends React.Component {

  render() {
    return (
      <form>
        <input type="text" placeholder="ProjectName" />
        <input type="text" placeholder="crowdDate" />
        <input type="text" placeholder="crowdDate" />
      </form>
    );
  }
}

export default SeedItem;
