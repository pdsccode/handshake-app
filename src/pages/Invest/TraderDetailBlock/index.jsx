import './TraderDetail.scss';
import React from 'react';
import ProfileSumary from './ProfileSumary';
import FundingItem from './FundingItem';
import CompletedItem from './CompletedItem';

const TraderDetailBlock = (props) => (
    <div key={'addlater'} style={{ marginTop: '1em' }} >
        <ProfileSumary {...props} />
        <div className="funding">
            <div className="funding-title">
                <label>CURRENTLY FUNDING</label>
            </div>
            <div className="funding-body">
                {[60,80,20,10,30].map((e, i) => <FundingItem percentage={e} key={i} />)}
            </div>
        </div>
        <div className="completed">
            <div className="completed-title">
                <label>{'COMPLETED PROJECTS'}</label>
            </div>
            <div className="completed-body">
                {[1,2,3,4,5].map((e, i) => <CompletedItem key={i} />)}
            </div>
        </div>
    </div>
);

export default TraderDetailBlock;