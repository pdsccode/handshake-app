import React from 'react';
import Button from '@/components/core/controls/Button';
import './Banner.scss';

class Banner extends React.Component {

  render() {
    const text = `Let's get this crystal ball`;
    return (
      <div
        className="ShareToWin"
        onClick={() => {
        }}
      >
        <div className="ShareToWinTitle">
          <div >
            {text}
          </div>
          <div className="RollingText">
            ROLLING!
          </div>
          <Button block className="FollowButton">Follow quick start guide</Button>
        </div>
      </div>
    );
  }
}
export default Banner;
