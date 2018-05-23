import React from 'react';
import PropTypes from 'prop-types';
// import cn from 'classnames';
// style
import './Modal.scss';
import BackChevronSVG from '@/assets/images/icon/back-chevron.svg';

class Modal extends React.Component {

  render() {
    const { children } = this.props;
    return (
      <div className="modal fade show">
        <div className="header">
          <img src={BackChevronSVG} alt="back"/>
          <p>Initiate handshake</p>
        </div>
        {children}
      </div>
    );
  }
}

Modal.propTypes = {
  children: PropTypes.node.isRequired
};

export default Modal;
