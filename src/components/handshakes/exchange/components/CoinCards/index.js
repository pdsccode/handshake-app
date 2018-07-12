import React from 'react';
import { FormattedMessage } from 'react-intl';
import './styles.scss';

export class Component extends React.Component {
  render() {
    const { coins, handleClickCoin } = this.props;
    return (
      <div className="coins-wrapper">
        {coins.map((coin, index) => {
          // eslint-disable-next-line
          const { name, txtBuy, txtSell, color, icon, onClose } = coin;
          return (
            <span
              key={index}
              className="coin-item"
              style={{ background: color }}
              onClick={e => handleClickCoin && handleClickCoin(e, name)}
            >
              {onClose && <button className="btn-close-card" onClick={(e) => { e.stopPropagation(); onClose(name); }}>&times;</button>}
              {/* <div className="icon-coin"><img src={icon}/></div> */}
              <div className="name mb-1">{name}</div>
              <div className="price-wrapper">
                <label>
                  <FormattedMessage id="ex.discover.label.priceBuy" />
                </label>&nbsp;<span className="price">
                  {txtBuy}
                </span>
              </div>
              <div className="price-wrapper">
                <label>
                  <FormattedMessage id="ex.discover.label.priceSell" />
                </label>&nbsp;<span className="price">
                  {txtSell}
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
