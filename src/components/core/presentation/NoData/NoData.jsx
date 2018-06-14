import React from 'react';
import PropTypes from 'prop-types';
// style
import nodataNinjaSVG from '@/assets/images/ninja/nodata-ninja.svg';
import './NoData.scss';

class NoData extends React.PureComponent {
  render() {
    const { className, message, ...props } = this.props;
    return (
      <div className={`no-data ${className || ''}`} {...props}>
        <div>
          <img className="img-fluid img" src={nodataNinjaSVG} alt="nodata ninja" />
          <p className="text">{ message || 'No stations near you yet. Be the first.' }</p>
        </div>
      </div>
    );
  }
}

NoData.propTypes = {
  className: PropTypes.string,
  message: PropTypes.string,
};

export default NoData;
