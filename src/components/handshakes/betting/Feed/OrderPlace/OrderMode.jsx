import React from 'react';

import Tabs from './../Tabs';

import SimpleOrderMode from './SimpleOrderMode';
import AdvancedOrderMode from './AdvancedOrderMode';

class OrderMode extends React.PureComponent {
  render() {
    return (
      <React.Fragment>
        <Tabs htmlClassName="OrderMode">
          <div label="Simple" className="OrderModeType">
            <SimpleOrderMode {...this.props} />
          </div>
          <div label="Advanced" className="OrderModeType">
            <AdvancedOrderMode {...this.props} />
          </div>
        </Tabs>
      </React.Fragment>
    );
  }
}

export default OrderMode;
