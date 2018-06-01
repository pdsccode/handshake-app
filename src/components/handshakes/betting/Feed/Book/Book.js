import React from 'react';
import PropTypes from 'prop-types';

import "./Book.scss";

class BetBook extends React.Component {
  constructor(props) {
    super(props);
    const {odd} = props;
    this.state = {};

  }

  render() {
    const {item} = this.props;
    const {amount, odds} = item;
    const { amountColor } = this.props;
    const amountStyle = {
      color: amountColor,
    };
    return (
      <div className="wrapperBettingBook">
        <div className="oddText">{odds}</div>
        <div className="amountText" style={amountStyle}>{amount}</div>
      </div>
    );
  }
}

BetBook.propTypes = {
  amountColor: PropTypes.string,
};

BetBook.defaultProps = {
  amountColor: '#FA6B49',
};

export default BetBook;
