import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';

// style
import './SeedItem.scss';

class SeedItem extends Component {

  render() {
    const { name, shortDescription, backerNum, fundedPercent, image } = this.props;
    return (
      <Fragment>
        <img src={image} alt={name} />
        <div className="seedContent">
          <h3 className="name">{name}</h3>
          <p className="shortDescription">{shortDescription}</p>
          <div className="bottomSeed">
            <span className="backerNum">{backerNum} backers</span>
            <span className="fundedAmount">{fundedPercent}% funded</span>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default SeedItem;
