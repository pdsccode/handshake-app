import React from 'react';
const etherScanTxUrl = 'https://rinkeby.etherscan.io/tx';
const linkToEtherScan = (tx) => `${etherScanTxUrl}/${tx}`;
const transformString = str => str.substring(0, 2) + '..'+ str.substring(str.length-2, str.length);
import TransactionStorage from '../../../reducers/invest/transactions';

export default class OrderHistory extends React.Component {
    constructor(props) {
        super(props);
        this.trxStorage = new TransactionStorage(props.pid);
        this.state = {
            trxs: []
        }
    }

    fetchTrxs = () => this.setState({ trxs: this.trxStorage.getTransactions() })

    componentDidMount() {
        this.fetchTrxs();
    }
    render() {
        if (this.state.trxs.length === 0) return null;
        return (<React.Fragment>
            <div style={{ marginLeft: '20px' }}><label htmlFor="amountfield" className="fund-label">Order History</label></div>
            <div className="trxHistory">
                <div className="trxHistory-row">
                <div className="trxHistory-row-left fund-label-row-header">Trx</div>
                <div className="trxHistory-row-mid fund-label-row-header">Type</div>
                <div className="trxHistory-row-mid fund-label-row-header">Amount</div>
                <div className="trxHistory-row-right fund-label-row-header">Status</div>
                </div>
                {this.state.trxs.map((e, i) => (
                <div key={i} className="trxHistory-row">
                    <div className="trxHistory-row-left">
                    <a target='_blank' href={linkToEtherScan(e.hash)}>{transformString(e.hash)}</a>
                    </div>
                    <div className="trxHistory-row-mid fund-label-row">{e.type|| ''}</div>
                    <div className="trxHistory-row-mid fund-label-row">{e.amount || ''}</div>
                    <div className="trxHistory-row-right fund-label-row" style={{ color: e.status==='PENDING' ? 'red' : 'green' }}>{e.status}</div>
                </div>
                ))}
            </div>
        </React.Fragment>)
    }
}