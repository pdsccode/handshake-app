import React from 'react';
import { connect } from 'react-redux';
import Button from '@/components/core/controls/Button';
import PropTypes from 'prop-types';
import Image from '@/components/core/presentation/Image';
import LuckyLogoSVG from '@/assets/images/luckypool/lucky-landing-logo.svg';
import { Link } from 'react-router-dom';
import { URL } from '@/constants';

import './LuckyLanding.scss';

class LuckyLanding extends React.Component {
  static propTypes = {
    onButtonClick: PropTypes.func,
  }
  render() {
    return (
      <div className="wrapperLuckyLanding">
        <div className="luckyLandingTop">
          <Image className="luckyLandingLogo" src={LuckyLogoSVG} alt="luckyfree" />
          <div className="luckyTopContent">
            <div className="luckyLandingTitle">WANNA WIN</div>
            <div className="luckyTitleEth">10 ETH?</div>
            <div className="luckyTopText">Place any bet to enter the draw.</div>
          </div>
        </div>

        <Link
          className="luckyLandingButton"
          to={URL.HANDSHAKE_DISCOVER}
        >
          Bet now
        </Link>

        <div className="luckyLandingSmallDes">*Draw closes after 1000 bets.<br />Free bets do not count.</div>

      </div>
    );
  }
}
export default connect(state => ({ app: state.app }))(LuckyLanding);
