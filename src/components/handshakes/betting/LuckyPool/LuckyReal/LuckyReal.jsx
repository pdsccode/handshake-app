import React from 'react';
import Button from '@/components/core/controls/Button';
import Image from '@/components/core/presentation/Image';
import LuckyReallSVG from '@/assets/images/luckypool/lucky-real.svg';

import './LuckyReal.scss';

class LuckyReal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="wrapperLuckyReal">
        <Image className="luckyImage" src={LuckyReallSVG} alt="luckyreal" />
        <div className="luckyDes">Increase your chances</div>
        <Button className="luckyButton">
            Place another bet
        </Button>
      </div>
    );
  }
}
export default LuckyReal;
