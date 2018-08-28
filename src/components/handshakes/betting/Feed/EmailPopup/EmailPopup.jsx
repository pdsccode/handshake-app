import React from 'react';
import Button from '@/components/core/controls/Button';
import PropTypes from 'prop-types';
import Image from '@/components/core/presentation/Image';
import FreeBetWinLogoSVG from '@/assets/images/luckypool/freebet_win_logo.svg';

import './FreeBetWin.scss';

class EmailPopup extends React.Component {
  static propTypes = {
    onButtonClick: PropTypes.func,

  }

  render() {
    return (
      <div className="wrapperEmailPopup">
        <div className="emailPopupBanner">
          <Image className="bannerIcon"/>
          <div>Success!</div>
          <div>Your bet has been placed.</div>
        </div>
        <div className="emailPopupDes">Check back here for the<br/>results or we can email them to you :)</div>
        <Button
          className="emailPopupButton"
          onClick={() => this.props.onButtonClick()}

        >
        Here’s a free one on us.
        </Button>
      </div>
    );
  }
}
export default EmailPopup;
