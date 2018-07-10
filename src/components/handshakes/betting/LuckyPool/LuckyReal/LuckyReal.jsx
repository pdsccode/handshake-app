import React from 'react';
import Button from '@/components/core/controls/Button';
import PropTypes from 'prop-types';
import Image from '@/components/core/presentation/Image';
import LuckyReallSVG from '@/assets/images/luckypool/lucky-real.svg';

import './LuckyReal.scss';

class LuckyReal extends React.Component {
  static propTypes = {
    onButtonClick: PropTypes.func,

  }

  render() {
    return (
      <div className="wrapperLuckyReal">
        <Image className="luckyImage" src={LuckyReallSVG} alt="luckyreal" />
        <div className="luckySmallDes">Nice. You've been entered <br />in the Ninja Lucky Dip to win 10 ETH!</div>
        <div className="luckyDes">Increase your chances</div>
        <Button
          className="luckyButton"
          onClick={() => this.props.onButtonClick()}

        >
            Place another bet
        </Button>
      </div>
    );
  }
}
export default LuckyReal;
