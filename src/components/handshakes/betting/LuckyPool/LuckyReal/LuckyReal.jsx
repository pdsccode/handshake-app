import React from 'react';
import Button from '@/components/core/controls/Button';

import './LuckyReal.scss';

class LuckyReal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="wrapperLuckyReal">
        <div className="luckyImage">Image Here</div>
        <div className="luckyDes">Increase your chances</div>
        <Button className="luckyButton">
            Place another bet
        </Button>
      </div>
    );
  }
}
