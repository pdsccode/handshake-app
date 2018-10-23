import './TraderDetail.scss';
import React from 'react';
import ProfileSumary from './ProfileSumary';
import FundingItem from './FundingItem';
import CompletedItem from './CompletedItem';
import { date_diff_indays } from '@/reducers/invest/action';

const TraderDetailBlock = (props) => (
    <div key={'addlater'} style={{ marginTop: '1em' }} >
        <ProfileSumary {...props} />
        <div className="funding">
            <div className="funding-title">
                <label>CURRENTLY FUNDING</label>
            </div>
            <div className="funding-body">
                {props.project.filter(p => date_diff_indays(new Date(), new Date(p.deadline)) > 0).map((e, i) => <FundingItem index={i+1} {...e} key={i} />)}
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