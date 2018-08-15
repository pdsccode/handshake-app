import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { EXCHANGE_ACTION, EXCHANGE_ACTION_NAME } from '@/constants';
import { formatMoneyByLocale } from '@/services/offer-util';
import StarsRating from '@/components/core/presentation/StarsRating';

class AllStationDetails extends React.Component {

  componentDidMount() {
    document.addEventListener('touchstart', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('touchstart', this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    const { onChangeShowAllDetails } = this.props;
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      onChangeShowAllDetails(false);
    }
  }

  render() {
    const { messages } = this.props.intl;
    const {
      username, review, onChangeShowAllDetails,
      actionActive, price, fiatCurrency, currencyActive, maxVolume,
      authProfile, initUserId,
    } = this.props;

    return (
      <div ref={(e) => (this.wrapperRef = e)}>
        <div>
          <div className="info-div">
            <div className="s-name">{username}</div>
            <div><StarsRating className="d-inline-block" starPoint={review} startNum={5} /></div>
          </div>
          <div>
            <button
              className="btn btn-sm bg-transparent btn-close"
              onClick={() => onChangeShowAllDetails(false)}
            >&times;
            </button>
          </div>
        </div>
        <hr />
        <div>
          <div className="s-label">{messages.discover.feed.cash.marker.label.price}</div>
          <div className="s-value">
            <span
              className={`${actionActive === EXCHANGE_ACTION.BUY ? 'buy-price' : 'sell-price'}`}
            >{`${formatMoneyByLocale(price, fiatCurrency)} ${fiatCurrency}/`}
            </span>
            <span>{currencyActive}</span>
          </div>

          <div className="s-label mt-1">{messages.discover.feed.cash.marker.label.maxVolume}</div>
          <div className="s-value">
            <span>{`${maxVolume} ${currencyActive}`}</span>
          </div>
        </div>
        {initUserId !== authProfile?.id && (
          <div className="mt-2">
            <button
              className="btn btn-primary btn-block btn-sm"
              onClick={this.handleOnShake}
            >{EXCHANGE_ACTION_NAME[actionActive]}{` ${messages.discover.feed.cash.marker.label.tradeNow}`}
            </button>
          </div>
        )}
      </div>
    );
  }
}

const mapState = state => ({});

const mapDispatch = dispatch => ({
  // rfChange: bindActionCreators(change, dispatch),
});

export default injectIntl(connect(mapState, mapDispatch)(AllStationDetails));
