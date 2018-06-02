import React from 'react';
import PropTypes from 'prop-types';
// style
import './ModalDialog.scss';

class ModalDialog extends React.Component {
  constructor(props) {
    super(props);
    // bind
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
  }

  open() {
    this.modalRef && this.modalRef.classList.add('modal-custom-show');
    this.contentRef && this.contentRef.classList.add('zoomIn');
  }

  close() {
    this.modalRef && this.modalRef.classList.remove('modal-custom-show');
    this.contentRef && this.contentRef.classList.remove('zoomIn');
  }

  componentDidMount() {
    this.props.hasOwnProperty('onRef') && this.props.onRef(this);
  }

  componentWillUnmount() {
    this.props.hasOwnProperty('onRef') && this.props.onRef(undefined);
  }


  render() {
    const { title, children } = this.props;
    return (
      <div className="modal" ref={modal => this.modalRef = modal}>
        <div className="modal-backdrop show"/>
        <div className="position" onClick={this.close}>
          <div 
            className="modal-dialog-content animated"
            onClick={e => e.stopPropagation()}
            ref={content => this.contentRef = content}
          >
            {
              title && (
              <div className="modal-custom-header">
                <p className="modal-custom-title">{title}</p>
              </div>
              )
            }
            <div className="modal-custom-body">
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ModalDialog.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  onRef: PropTypes.func
};

export default ModalDialog;
