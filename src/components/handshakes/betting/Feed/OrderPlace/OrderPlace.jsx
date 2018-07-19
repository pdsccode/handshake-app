import React from 'react';
import PropTypes from 'prop-types';

import { SIDE } from '@/components/handshakes/betting/constants.js';
import GA from '@/services/googleAnalytics';

import Tabs from './../Tabs';
import OrderMode from './OrderMode';

import './OrderPlace.scss';

const TAG = 'ORDER_PLACE';
class OrderPlace extends React.Component {
  static propTypes = {
    render: PropTypes.bool,
    bettingShake: PropTypes.object,
    orderBook: PropTypes.object,
  };

  static defaultProps = {
    render: false,
    bettingShake: null,
    orderBook: null,
  };

  state = {
    side: SIDE.SUPPORT,
  };

  afterTabChanges = (tab) => {
    const tabType = tab.toUpperCase();
    console.log(TAG, 'afterTabChanges', 'tabType:', tabType);
    this.setState({
      side: SIDE[`${tabType}`],
    });
    // Event tracking
    GA.clickChooseASideCreatePage(tab);
  }

  render() {
    const { bettingShake, orderBook } = this.props;
    console.log(TAG, 'render', 'side: ', this.state.side);
    const orderMode = {
      bettingShake: {
        ...bettingShake,
        side: this.state.side,
      },
      orderBook,
    };
    return (
      <React.Fragment>
        <Tabs htmlClassName="OrderPlace" afterClick={this.afterTabChanges}>
          <div className="OrderPlaceType Green" label="Support">
            <OrderMode {...orderMode} theme="Green" />
          </div>
          <div className="OrderPlaceType Orange" label="Against">
            <OrderMode {...orderMode} theme="Orange" />
          </div>
        </Tabs>
      </React.Fragment>
    );
  }
}

export default OrderPlace;
