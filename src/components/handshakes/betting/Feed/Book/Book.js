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
    const { amountColor } = this.props;
    const amountStyle = {
      color: amountColor,
    };
    return (
      <div className="wrapperBettingBook">
        <div className="oddText">2.3</div>
        <div className="amountText" style={amountStyle}>0.1528</div>
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
