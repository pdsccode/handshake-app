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
        <img className="ninja img-fluid" src={nodataNinjaSVG} alt="nodata ninja" />
        <p className="text">{ message || 'NO DATA AVAILABLE' }</p>
      </div>
    );
  }
}

NoData.propTypes = {
  className: PropTypes.string,
  message: PropTypes.string,
};

export default NoData;
