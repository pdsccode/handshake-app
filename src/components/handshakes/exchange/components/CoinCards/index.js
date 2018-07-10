import React from 'react';
import { FormattedMessage } from 'react-intl';
import './styles.scss';

export class Component extends React.Component {
  render() {
    const { coins, currency } = this.props;
    return (
      <div className="coins-wrapper">
        {coins.map((coin, index) => {
          // eslint-disable-next-line
          const { name, priceBuy, priceSell, color, icon } = coin;
          return (
            <span
              key={index}
              className="coin-item"
              style={{ background: color }}
              onClick={e => this.handleClickCoin(e, name)}
            >
              {/* <div className="icon-coin"><img src={icon}/></div> */}
              <div className="name mb-1">{name}</div>
              <div className="price-wrapper">
                <label>
                  <FormattedMessage id="ex.discover.label.priceBuy" />
                </label>&nbsp;<span className="price">
                  {priceBuy} {priceBuy !== '-' && currency}
                </span>
              </div>
              <div className="price-wrapper">
                <label>
                  <FormattedMessage id="ex.discover.label.priceSell" />
                </label>&nbsp;<span className="price">
                  {priceSell} {priceSell !== '-' && currency}
                </span>
              </div>
            </span>
          );
        })}
      </div>
    );
  }
}

Component.propTypes = {};

export default Component;
