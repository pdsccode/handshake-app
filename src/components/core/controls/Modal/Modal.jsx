import React from 'react';
import PropTypes from 'prop-types';
// component
import Image from '@/components/core/presentation/Image';
// style
import './Modal.scss';
import BackChevronSVG from '@/assets/images/icon/back-chevron.svg';
import BackChevronSVGWhite from '@/assets/images/icon/back-chevron-white.svg';

class Modal extends React.Component {
  constructor(props) {
    super(props);
    // bind
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
  }

  componentDidMount() {
    this.props.hasOwnProperty('onRef') && this.props.onRef(this);
  }

  componentWillUnmount() {
    this.props.hasOwnProperty('onRef') && this.props.onRef(undefined);
  }

  open() {
    this.modalRef && this.modalRef.classList.add('modal-custom-show');
  }

  close() {
    this.modalRef && this.modalRef.classList.remove('modal-custom-show');
    if (this.props.hasOwnProperty('onClose')) this.props.onClose();
  }

  render() {
    const iconGray = this.props.iconGray ? BackChevronSVG : BackChevronSVGWhite;
    let styleHeader = {};
    if (this.props.textColor){
      styleHeader.color = this.props.textColor;
    }
    if (this.props.backgroundColor){
      styleHeader.background = this.props.backgroundColor;
    }
    
    const { title, children, hideBackButton } = this.props;
    return (
      <div className="modal" ref={modal => this.modalRef = modal}>
        <div className="modal-custom-header" style={styleHeader}>
          {
            !hideBackButton && <Image src={iconGray} onClick={this.close} alt="back"/>
          }
          {
            title && (<p className="modal-custom-title">{title}</p>)
          }
        </div>
        <div className="modal-custom-body">
          {children}
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  onRef: PropTypes.func,
  onClose: PropTypes.func,
  hideBackButton: PropTypes.bool,
  iconGray: PropTypes.bool,//default icon gray (gray, white)
  backgroundColor: PropTypes.string,
  textColor: PropTypes.string,
};

export default Modal;
