import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { URL } from '@/constants';
import MultiLanguage from '@/components/core/controls/MultiLanguage';
import meIcon from '@/assets/images/navigation/ic_private.svg.raw';
import predictionIcon from '@/assets/images/categories/chip.svg';

function Me() {
  return (
    <Link to={URL.HANDSHAKE_ME_INDEX} className="me-icon">
      <div dangerouslySetInnerHTML={{ __html: meIcon }} />
    </Link>
  );
}

function Caption(props) {
  const { titleBar } = props;
  return (
    <div className="Caption">
      <img src={predictionIcon} alt="" />
      <span>{titleBar}</span>
    </div>
  );
}

function HeaderBar(props) {
  return (
    <div className={props.className}>
      {Me()}
      {Caption(props)}
      <MultiLanguage />
    </div>
  );
}

HeaderBar.propTypes = {
  className: PropTypes.string,
  titleBar: PropTypes.string,
};

HeaderBar.defaultProps = {
  className: '',
  titleBar: '',
};

export default HeaderBar;
