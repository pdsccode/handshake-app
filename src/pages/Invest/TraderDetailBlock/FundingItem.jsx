import React from 'react';
import { ProgressBar } from 'react-bootstrap';
import { wrapBoundary } from '../../../components/ErrorBoundary';
import './TraderDetail.scss';

const handleProgressBar = (values) => [
    { label: 'success', value: 80 },
    { label: 'info', value: 30 },
    { label: 'danger', value: 0 }
].find(e => values >= e.value).label;

const FundingItem = wrapBoundary(({ percentage }) => (
    <div className="funding-body-row">
        <div className="funding-body-row-left">
            <label>1. TraderId</label>
            <ProgressBar className="progress" bsStyle={handleProgressBar(percentage)} now={percentage} />
            <label className="progress-title">
                {'150,000'}
                <span className="colorTrader-grey">{' of 150,000 ETH'}</span>
            </label>
        </div>
        <div className="funding-body-row-right">
            <label className="colorTrader-grey">{'5 days left'}</label>
            <label className="colorTrader-green">{'55%'}</label>
        </div>
    </div>
));

export default FundingItem;
