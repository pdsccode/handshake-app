import React from 'react';
import { getGasPrice, formatAmount } from '@/components/handshakes/betting/utils.js';
import './EstimateGas.scss';

class EstimateGas extends React.Component {

  state = {
    estimateGas: 0,

  }

  async componentDidMount() {
    const estimateGas = getGasPrice();
    this.setState({
      estimateGas,
    });
  }

  render() {
    const { estimateGas } = this.state;

    return (
      <div className="estimateRowWrapper">
        <div className="gasPriceTitle">Current gas price per transaction (Gwei)</div>
        <div className="estimateGasValue">{formatAmount(estimateGas)}</div>
      </div>
    );
  }
}
export default EstimateGas;
