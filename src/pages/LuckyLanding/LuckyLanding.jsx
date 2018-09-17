import React from 'react';
import { connect } from 'react-redux';
import Button from '@/components/core/controls/Button';
import PropTypes from 'prop-types';
import Image from '@/components/core/presentation/Image';
import LuckyLogoSVG from '@/assets/images/luckypool/lucky-landing-logo.svg';
import CloseIcon from '@/assets/images/icon/close.svg';
import { Link } from 'react-router-dom';
import { URL } from '@/constants';
import GA from '@/services/googleAnalytics';


import './LuckyLanding.scss';

class LuckyLanding extends React.Component {
  static propTypes = {
    onButtonClick: PropTypes.func,
  }
  render() {
    return (
      <div className="wrapperLuckyLanding">
        <div className="luckyLandingTop">
          <div
            className="luckyLandingClose"
            //to={URL.HANDSHAKE_DISCOVER}
            onClick={() => {
              GA.clickInstructionClose();
              this.props.onButtonClick();
            }}
          >
            <Image src={CloseIcon} alt="CloseIcon" />
          </div>
          <Image className="luckyLandingLogo" src={LuckyLogoSVG} alt="luckyLogo" />

        </div>
        <div className="luckyTopContent">
          <div className="luckyLandingTitle">Hey Ninja!</div>
          <div className="luckyTitleDesc">Take a look around.</div>
        </div>

          <Link
            className="btnLuckyLanding guideButton"

            to={URL.PEX_INSTRUCTION_URL}
            onClick={()=>{
              GA.clickInstructionStartGuide();

            }}
          >
              Quick start guide

          </Link>

        <Button
          className="btnLuckyLanding gotItButton"
          onClick={() => {
              GA.clickInstructionGotIt();
              this.props.onButtonClick();
          }}
        >
          Got it
        </Button>

      </div>
    );
  }
}
export default connect(state => ({ app: state.app }))(LuckyLanding);
