import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './ConfirmPopup.scss';

class ConfirmPopup extends Component {
  static propTypes = {
    cancelButtonClick: PropTypes.func,
    okButtonClick: PropTypes.func,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
  }
  static defaultProps = {
  }
  render() {
    const { title, content } = this.props;
    return (
      <div className="wrapperConfirm">
        <div className="title">{title}</div>
        <div className="content">{content}</div>
        <div className="wrapperButton">
          <button
            className="btn cancelButton"
            onClick={() => this.props.cancelButtonClick()}
          >
              Cancel
          </button>
          <button
            className="btn okButton"
            onClick={() => this.props.okButtonClick()}
          >
              OK
          </button>
        </div>
      </div>
    );
  }
}
export default ConfirmPopup;

