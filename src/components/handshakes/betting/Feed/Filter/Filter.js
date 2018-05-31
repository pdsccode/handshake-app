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
                        "handshakes": [],
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
        ],
        selectedMatch:null,
        selectedOutcome: null,
        };
    
        
      }
    componentWillReceiveProps(nextProps){

        const {matches} = nextProps;
        console.log(`${TAG} Matches:`, matches);
        
        this.setState({
            matches
        })
    }
    componentDidMount(){
        this.props.loadMatches({PATH_URL: API_URL.CRYPTOSIGN.LOAD_MATCHES});
    }

    get matchNames() {
        const {matches} = this.state;
        return matches.map((item) => ({ id: item.id, value: `${item.awayTeamName} - ${item.homeTeamName}` }));
    }
    get matchResults(){
        const {selectedMatch, matches} = this.state;
        if(selectedMatch){
            const foundMatch = matches.find(function(element) {
                return element.id  === selectedMatch.id;
              });
            if (foundMatch){
                const {outcomes} = foundMatch;
                if(outcomes){
                    return outcomes.map((item) => ({ id: item.id, value: item.name}));
                }
            }  
        }
        
        
        return [];
    }
    get bookList(){
        const {selectedMatch, matches} = this.state;

        return [];
    }
    render(){
        const {matches, selectedMatch} = this.state;
        return (
            <div className="wrapperBettingFilter">
            <div className="dropDown">
                <Dropdown placeholder="Select a match" 
                source={this.matchNames}
                onItemSelected={(item) => this.setState({selectedMatch: item})} />
            </div>
            {selectedMatch && <div className="dropDown">
                <Dropdown placeholder="Select a outcome" 
                source={this.matchResults} 
                onItemSelected={(item) => this.setState({selectedOutcome: item})} />
            </div>}
            
                <div className="wrapperContainer">
                    <div className="item">
                    <GroupBook amountColor="#FA6B49"/>
                    <GroupBook amountColor="#8BF275"/>
                    </div>
                    <div className="item">
                    <BettingShake/>

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

