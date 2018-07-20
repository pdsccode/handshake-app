import React from 'react';
import PropTypes from 'prop-types';

import { formatOdds } from '@/components/handshakes/betting/utils';
import { defaultOdds } from '@/components/handshakes/betting/calculation';

import GroupBook from './../GroupBook';

const TAG = 'ORDER_BOOK';

class OrderBook extends React.Component {
  static propTypes = {
    support: PropTypes.array,
    against: PropTypes.array,
  }

  static defaultProps = {
    support: null,
    against: null,
  }


  renderTitle() {
    return (
      <div className="orderBookTitle">ORDER BOOK</div>
    );
  }
  renderSupportTable() {
    const { support, against } = this.props;
    const marketOdds = formatOdds(defaultOdds(against));
    return (
      <div className="item">
        <div className="titleBox opacity65">
          <div>Market size (ETH)</div>
          <div className="supportOdds">Support (ODDS)</div>
        </div>
        {<GroupBook amountColor="#0BDD91" bookList={support} />}
        <div className="marketBox">
          <div>Market odds</div>
          <div>{ marketOdds }</div>
        </div>
      </div>
    );
  }

  renderAgainstTable() {
    const { support, against } = this.props;
    const marketOdds = formatOdds(defaultOdds(support));
    return (
      <div className="item">
        <div className="titleBox opacity65">
          <div>Market size (ETH)</div>
          <div className="supportOdds">Oppose (ODDS)</div>
        </div>
        {<GroupBook amountColor="#FA6B49" bookList={against} />}
        <div className="titleBox">
          <div className="itemTitle">Market odds</div>
          <div className="itemTitle">{ marketOdds }</div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="orderBookContainer">
        {this.renderTitle()}
        <div className="wrapperContainer">
          { this.renderSupportTable()}
          { this.renderAgainstTable()}
        </div>
      </div>
    );
  }
}

export default OrderBook;
