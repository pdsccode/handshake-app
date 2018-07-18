import React from 'react';
import PropTypes from 'prop-types';

import { parseBigNumber } from '@/components/handshakes/betting/utils';
import GroupBook from './../GroupBook';

class OrderBook extends React.Component {
  static propTypes = {
    support: PropTypes.array,
    against: PropTypes.array,
    roundOdd: PropTypes.number,
  }

  static defaultProps = {
    support: null,
    against: null,
    roundOdd: 10,
  }

  defaultOdds = (type) => {
    if (type && type.length > 0) {
      console.log('Sorted Type Odds:', type);
      const element = type[type.length - 1];
      const odds = parseBigNumber(element.odds);
      const oneBN = parseBigNumber(1);
      const typeOdds = odds.div(odds.minus(oneBN));
      console.log('TAG', ' defaultSupportOdds = ', typeOdds.toNumber());
      return typeOdds.toNumber() || 0;
    }
    return 0;
  }

  render() {
    const { support, against, roundOdd } = this.props;
    return (
      <div className="orderBookContainer">
        <div className="orderBookTitle">ORDER BOOK</div>
        <div className="wrapperContainer">
          <div className="item">
            <div className="titleBox opacity65">
              <div>Market size (ETH)</div>
              <div className="supportOdds">Support (ODDS)</div>
            </div>
            {<GroupBook amountColor="#0BDD91" bookList={support} />}
            <div className="marketBox">
              <div>Market odds</div>
              <div>{Math.floor(this.defaultOdds(support) * roundOdd) / roundOdd}</div>
            </div>
          </div>
          <div className="item">
            <div className="titleBox opacity65">
              <div>Market size (ETH)</div>
              <div className="supportOdds">Oppose (ODDS)</div>
            </div>
            {<GroupBook amountColor="#FA6B49" bookList={against} />}
            <div className="titleBox">
              <div className="itemTitle">Market odds</div>
              <div className="itemTitle">{Math.floor(this.defaultOdds(against) * roundOdd) / roundOdd}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default OrderBook;
