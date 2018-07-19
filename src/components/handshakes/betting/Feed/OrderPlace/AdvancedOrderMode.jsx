import React from 'react';
import PropTypes from 'prop-types';

import { SIDE } from '@/components/handshakes/betting/constants.js';
import { getKeyByValue } from '@/utils/object';
import Button from '@/components/core/controls/Button';
import BettingShake from './../Shake';
import OrderBook from './OrderBook';

class AdvancedOrderMode extends React.Component {
  static propTypes = {
    bettingShake: PropTypes.object,
    orderBook: PropTypes.object,
    theme: PropTypes.string,
  }

  static defaultProps = {
    bettingShake: null,
    orderBook: null,
    theme: null,
  }

  state = {
    orderClick: false,
  }

  handleClick = () => {
    this.setState({
      orderClick: true,
    });
  }

  render() {
    const { bettingShake, orderBook, theme } = this.props;
    const { side } = bettingShake;
    const buttonClass = theme;
    const sideText = getKeyByValue(SIDE, side);
    return (
      <React.Fragment>
        <BettingShake {...bettingShake} orderClick={this.state.orderClick} />
        <OrderBook {...orderBook} />
        <Button block className={buttonClass} onClick={this.handleClick}>Place {sideText} Order</Button>
      </React.Fragment>
    );
  }
}

export default AdvancedOrderMode;
