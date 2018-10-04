import React, { Component } from 'react';
import InvestNavigation from './InvestNavigation';
import TraderDetailBlock from './TraderDetailBlock';

export default class TraderDetail extends Component {
    render(){
        const item = {
            rating: 1,
            avatarUrl: 'https://randomuser.me/api/portraits/men/9.jpg',
            name: 'Quang Vo',
            activeProjects: 115,
            managedFunds: 200000000,
            averageReturn: 0.32,
            cumEarning: 15000,
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