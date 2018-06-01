import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// service, constant
import { API_URL } from '@/constants';

// components
import Dropdown from '@/components/core/controls/Dropdown';
import BettingShake from './../Shake';
import GroupBook from './../GroupBook';

import './Filter.scss';
import { loadMatches } from '@/reducers/betting/action';
import {BetHandshakeHandler, SIDE} from '@/components/handshakes/betting/Feed/BetHandshakeHandler';

const TAG = "BETTING_FILTER";
class BettingFilter extends React.Component {
    static propTypes = {
        
      }

    static defaultProps = {
    }

    constructor(props) {
        super(props);
        const {odd} = props;
        this.state = {
            matches: [],
            /*
          matches: [
            {
                "awayTeamCode": "",
                "awayTeamFlag": "https://upload.wikimedia.org/wikipedia/commons/0/0d/Flag_of_Saudi_Arabia.svg",
                "awayTeamName": "Saudi Arabia",
                "date": 1528963200,
                "homeTeamCode": "RUS",
                "homeTeamFlag": "https://upload.wikimedia.org/wikipedia/commons/f/f3/Flag_of_Russia.svg",
                "homeTeamName": "Russia",
                "id": 1,
                "outcomes": [
                    {
                        "handshakes": [{
                            id: 1,
                            support: 1,
                            odd: 2.3,
                            amount: 0.1528
                        },
                        {
                            id: 2,
                            support: 1,
                            odd: 2.3,
                            amount: 0.1528
                        },
                        {
                            id: 3,
                            support: 1,
                            odd: 2.3,
                            amount: 0.1528
                        },
                        {
                            id: 4,
                            support: 1,
                            odd: 2.3,
                            amount: 0.1528
                        },
                        {
                            id: 5,
                            support: 1,
                            odd: 2.3,
                            amount: 0.1528
                        },
                        {
                            id: 6,
                            support: 2,
                            odd: 2.3,
                            amount: 0.1528
                        },
                        {
                            id: 7,
                            support: 2,
                            odd: 2.3,
                            amount: 0.1528
                        },
                        {
                            id: 8,
                            support: 2,
                            odd: 2.3,
                            amount: 0.1528
                        },
                        {
                            id: 9,
                            support: 2,
                            odd: 2.3,
                            amount: 0.1528
                        },
                        {
                            id: 10,
                            support: 2,
                            odd: 2.3,
                            amount: 0.1528
                        }],
                        "id": 1,
                        "name": "Russia wins"
                    },
                    {
                        "handshakes": [],
                        "id": 2,
                        "name": "Saudi Arabia wins"
                    },
                    {
                        "handshakes": [],
                        "id": 3,
                        "name": "Russia draws Saudi Arabia"
                    }
                ]
            },
            {
                "awayTeamCode": "",
                "awayTeamFlag": "https://upload.wikimedia.org/wikipedia/commons/f/fe/Flag_of_Uruguay.svg",
                "awayTeamName": "Uruguay",
                "date": 1529038800,
                "homeTeamCode": "",
                "homeTeamFlag": "https://upload.wikimedia.org/wikipedia/commons/f/fe/Flag_of_Egypt.svg",
                "homeTeamName": "Egypt",
                "id": 2,
                "outcomes": [
                    {
                        "handshakes": [],
                        "id": 7,
                        "name": "Uruguay wins"
                    },
                    {
                        "handshakes": [],
                        "id": 8,
                        "name": "Egypt wins"
                    },
                    {
                        "handshakes": [],
                        "id": 9,
                        "name": "Uruguay draws Egypt"
                    }
                ]
            }
        ],*/
        selectedMatch:null,
        selectedOutcome: null,
        };
    
        
      }
    componentWillReceiveProps(nextProps){

        const {matches} = nextProps;
        console.log(`${TAG} Matches:`, matches);
        const selectedMatch = this.defaultMatch;
        const selectedOutcome = this.defaultOutcome;
        this.setState({
            matches,
            selectedMatch,
            selectedOutcome
        })
    }
    componentDidMount(){
        this.props.loadMatches({PATH_URL: API_URL.CRYPTOSIGN.LOAD_MATCHES});
    }

    get defaultMatch(){
        const {matches} = this.state;
        if(matches && matches.length > 0){
            const firstMatch = matches[0];
            return { id: firstMatch.id, value: `${item.awayTeamName} - ${item.homeTeamName}` }

        }
        return null;
    }

    get defaultOutcome(){
        const {selectedMatch, matches} = this.state;
        const foundMatch = this.foundMatch;
        if (foundMatch){
            const {outcomes} = foundMatch;
            if(outcomes && outcomes.length > 0){
                const firstOutcome = outcomes[0];
                return { id: firstOutcome.id, value: firstOutcome.name};
            }
        } 
    }

    get foundMatch(){
        const {selectedMatch, matches} = this.state;
        if(selectedMatch){
            return matches.find(function(element) {
                return element.id  === selectedMatch.id;
              });
        }
        return null;
        
    }

    get foundOutcome(){
        const {selectedOutcome} = this.state;
        const foundMatch = this.foundMatch;
        if(foundMatch && selectedOutcome){
            const {outcomes} = foundMatch;
            return outcomes.find(function(element) {
                return element.id  === selectedOutcome.id;
              });
        }
        return null;
    }

    get matchNames() {
        const {matches} = this.state;
        return matches.map((item) => ({ id: item.id, value: `${item.awayTeamName} - ${item.homeTeamName}` }));
    }
    get matchResults(){
        const {selectedMatch, matches} = this.state;
        if(selectedMatch){
            const foundMatch = this.foundMatch;
            if (foundMatch){
                const {outcomes} = foundMatch;
                if(outcomes){
                    return outcomes.map((item) => ({ id: item.id, value: item.name}));
                }
            }  
        }
        
        
        return [];
    }
    get bookListSupport(){
        const {selectedMatch, matches, selectedOutcome} = this.state;
        const foundOutcome = this.foundOutcome;
        console.log('Found Outcome:', foundOutcome);
        if(foundOutcome){
            const {handshakes} = this.foundOutcome;
            console.log('support Handshakes:', handshakes);
            if(handshakes){
                return handshakes.filter(item=>(item.side === SIDE.SUPPORT));
            }
        }
        return [];
    }
    get bookListAgainst(){
        const {selectedMatch, matches, selectedOutcome} = this.state;
        const foundOutcome = this.foundOutcome;
        if(foundOutcome){
            const {handshakes} = this.foundOutcome;
            console.log('against Handshakes:', handshakes);
            if(handshakes){
                return handshakes.filter(item=>(item.side === SIDE.AGAINST));
            }
        }
        return [];
    }
    render(){
        const {matches, selectedMatch, selectedOutcome} = this.state;
        const outcomeId = (selectedOutcome && selectedOutcome.id) ? selectedOutcome.id : null;
        return (
            <div className="wrapperBettingFilter">
            <div className="dropDown">
                <Dropdown placeholder="Select a match" 
                source={this.matchNames}
                onItemSelected={(item) => this.setState({selectedMatch: item})} />
            </div>
            {selectedMatch && <div className="dropDown">
                <Dropdown placeholder="Select a prediction" 
                source={this.matchResults} 
                onItemSelected={(item) => this.setState({selectedOutcome: item})} />
            </div>}
            
                <div className="wrapperContainer">
                    <div className="item">
                    <GroupBook amountColor="#FA6B49" bookList={this.bookListSupport}/>
                    <GroupBook amountColor="#8BF275" bookList={this.bookListAgainst}/>
                    </div>
                    <div className="item">
                    {<BettingShake outcomeId={outcomeId}/>}

                    </div>
                </div>
            </div>

        );
    }
}
const mapState = state => ({
  matches: state.betting.matches,
});
const mapDispatch = ({
    loadMatches,
  });
export default connect(mapState, mapDispatch)(BettingFilter);

