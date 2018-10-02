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