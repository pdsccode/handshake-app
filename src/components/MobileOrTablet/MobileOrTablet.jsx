import React from 'react';
// style
import onlyMobileTabletSVG from '@/assets/images/ninja/only-mobile-tablet.svg';
import arrowsRightIcon from '@/assets/images/ninja/arrows-right-blue.svg';
import './MobileOrTablet.scss';

class MobileOrTablet extends React.PureComponent {
  render() {
    return (
      <div className="container mobile-tablet">
        <div className="left">
          <img className="img-fluid" src={onlyMobileTabletSVG} alt="ninja" />
        </div>
        <div className="right">
          <p className="title">Hey Ninja.</p>
          <p className="sub-title">We like to stay on the move.</p>
          <p>Ditch the desktop and check us out mobile!</p>
          <a
            className="readTheWhitePaper"
            href="https://medium.com/@ninjadotorg/shakeninja-bex-1c938f18b3e8"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Read the whitepaper</span>
            <img src={arrowsRightIcon} alt="arrow right icon" />
          </a>
          <a
            className="readTheWhitePaper"
            href="/shuriken"
          >
            <span>Learn more about the Shuri Coin</span>
            <img src={arrowsRightIcon} alt="arrow right icon" />
          </a>
        </div>
      </div>
    );
  }
}

export default MobileOrTablet;
