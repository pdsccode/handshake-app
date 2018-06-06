import React from 'react';
// style
import onlyMobileTabletSVG from '@/assets/images/only-mobile-tablet/only-mobile-tablet.svg';
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
        </div>
      </div>
    );
  }
}

export default MobileOrTablet;
