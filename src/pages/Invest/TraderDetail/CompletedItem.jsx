import React from 'react';
import '../TraderDetail.scss';
import { wrapBoundary } from '../../../components/ErrorBoundary';

const CompletedItem = wrapBoundary(() => (
    <div className="completed-body-row">
        <div className="completed-body-row-title">{'XProject'}</div>
        <div className="completed-body-row-body">
            <div className="completed-body-row-body-left">
                <label>{'Duration'}</label>
                <label>{'Deadline'}</label>
                <label>{'Requested fund'}</label>
                <label>{'Returns'}</label>
                <label>{''}</label>
            </div>
            <div className="completed-body-row-body-right">
                <label>{'3 months'}</label>
                <label>{'14 Sep 2018'}</label>
                <label>
                    {'1,000,000'}
                    <span className="colorTrader-grey">{' ETH'}</span>
                </label>
                <label>
                    {'1,200,000'}
                    <span className="colorTrader-grey">{' ETH'}</span>
                </label>
                <label className="green">{'+25%'}</label>
            </div>
        </div>
    </div>
));

export default CompletedItem;