import React from 'react';
import { getEstimateGas, formatAmount } from '@/components/handshakes/betting/utils.js';
import './EstimateGas.scss';

class EstimateGas extends React.Component {

  state = {
    estimateGas: 0,

  }

  async componentDidMount() {
    const estimateGas = await getEstimateGas();
    this.setState({
      estimateGas,
    });
  }

  render() {
    const { estimateGas } = this.state;

    return (
      <div className="estimateRowWrapper">
        <div className="gasPriceTitle">Current gas price per transaction (ETH)</div>
        <div className="estimateGasValue">{formatAmount(estimateGas)}</div>
      </div>
    );
  }
}
export default EstimateGas;
