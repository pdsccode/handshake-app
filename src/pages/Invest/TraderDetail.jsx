import React, { Component } from 'react';
import InvestNavigation from './InvestNavigation';
import './TraderDetail.scss';
import ProfileSumary from './TraderDetail/ProfileSumary';
import FundingItem from './TraderDetail/FundingItem';
import CompletedItem from './TraderDetail/CompletedItem';

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

export default class TraderDetail extends Component {
    render(){
        const item = {
            rating: 1,
            avatarUrl: 'https://randomuser.me/api/portraits/men/9.jpg',
            name: 'Quang Vo',
            activeProjects: 115,
            managedFunds: '200,000,000',
            averageReturn: 0.32,
            cumEarning: '15,000',
            currentlyFundings: [],
            completedProjects: []
        };
        
        return (
            <div style={{ backgroundColor: '#fafbff', minHeight: '100vh' }}>
                <InvestNavigation header="Trader" history={this.props.history} />
                <TraderDetailBlock {...item} />
            </div>
        )
    }
}