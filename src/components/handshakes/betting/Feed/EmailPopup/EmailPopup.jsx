import React from 'react';
import Button from '@/components/core/controls/Button';
import PropTypes from 'prop-types';
import Image from '@/components/core/presentation/Image';
import IconOKSVG from '@/assets/images/luckypool/ic_ok.svg';
import CloseIcon from '@/assets/images/icon/close.svg';

import './EmailPopup.scss';

class EmailPopup extends React.Component {
  static propTypes = {
    onButtonClick: PropTypes.func,

  }
  constructor(props) {
    super(props);

    this.state = {
      email: '',
    };
  }
  onSubmit = async (e) => {
    const {email} = e.values;
    console.log('Email:', email);
  }
  changeText(text) {
    this.setState({
      email: text,
    });
  }

  render() {
    return (
      <div className="wrapperEmailPopup">
        <div className="emailPopupContent">
          <div
          className="emailPopupClose"
          onClick={() => {
            this.props.onButtonClick();
          }}
          >
            <Image src={CloseIcon} alt="CloseIcon" />
          </div>
          <Image className="bannerIcon" src={IconOKSVG} alt="iconOK"/>
          <div className="emailPopupDes">Success!</div>
          <div className="emailPopupSmallDes">Your bet has been placed.</div>
        </div>
         <div className="contentSmallDes">Check back here for the<br/>results or we can email them to you :)</div>
        <input
            className="emailPopupInput"
            type='text'
            autoComplete="off"
            id='email'
            placeholder="Enter your email"
            onChange={(evt) => {
              this.changeText(evt.target.value);
            }}
          />
        <Button
          className="emailPopupButton"
          onClick={() => {
            console.log(this.state.email);
          }}
        >
        Notify me
          </Button>
      </div>
    );
  }
}
export default EmailPopup;
