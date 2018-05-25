import React from 'react';
import PropTypes from 'prop-types';
// style
import './ExchangeFeed.scss';
import {FormattedMessage} from 'react-intl';
import Feed from "@/components/core/presentation/Feed/Feed";
import Button from "@/components/core/controls/Button/Button";

class ExchangeFeed extends React.PureComponent {
  BACKGROUND_COLORS = ['#0064ff','#ff00a2','#ff9b00', '#00ce7d'];

  backgroundCss(background) {
    return background ? background : this.BACKGROUND_COLORS[Math.floor(Math.random() * this.BACKGROUND_COLORS.length)];
  }

  render() {
    const {type, amount, currency, fiat_amount, ...props } = this.props;
    return (
      <div>
        <Feed className="feed">
          <p className="description"><FormattedMessage id="offerHandShakeContent" values={{ offerType: type === 'buy' ? 'Buy': 'Sell',
            amount: amount, currency: currency, total: fiat_amount
          }} /></p>
          <p className="email"></p>
          <p className="email"><FormattedMessage id="offerDistanceContent" values={{ offerType: type === 'buy' ? 'Buyer': 'Seller',
            distance: 100}} /></p>
        </Feed>
        <Button block>Shake now</Button>
      </div>
    );
  }
}

ExchangeFeed.propTypes = {
  className: PropTypes.string,
  background: PropTypes.string,
};

export default ExchangeFeed;
