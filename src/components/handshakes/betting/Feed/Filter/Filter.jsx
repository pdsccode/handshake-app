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
import { loadMatches, loadHandshakes } from '@/reducers/betting/action';
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
            selectedMatch:null,
            selectedOutcome: null,
            support: null,
            against: null,
        };
    
        
      }
    componentWillReceiveProps(nextProps){

        const {matches, support, against} = nextProps;
        console.log(`${TAG} Matches:`, matches);
        const selectedMatch = this.defaultMatch;
        const selectedOutcome = this.defaultOutcome;
        this.setState({
            matches,
            selectedMatch,
            selectedOutcome,
            support,
            against
        })
    }
    componentDidMount(){
        this.props.loadMatches({PATH_URL: API_URL.CRYPTOSIGN.LOAD_MATCHES});
    }

    get defaultMatch(){
        const matchNames = this.matchNames;
        return matchNames && matchNames.length > 0 ? matchNames[0] : null;
    }

    get defaultOutcome(){
        const matchOutcomes = this.matchOutcomes;
        return matchOutcomes && matchOutcomes.length > 0 ? matchOutcomes[0] : null;
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
        if(matches){
            return matches.map((item) => ({ id: item.id, value: `${item.awayTeamName} - ${item.homeTeamName}` }));
        }
        return null;
    }
    get matchOutcomes(){
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
        const {support} = this.state;
        /*
        const foundOutcome = this.foundOutcome;
        console.log('Found Outcome:', foundOutcome);
        if(foundOutcome){
            const {handshakes} = this.foundOutcome;
            console.log('support Handshakes:', handshakes);
            if(handshakes){
                return handshakes.filter(item=>(item.side === SIDE.SUPPORT && item.status === 0));
            }
        }
        return [];
        */
       return support;
    }
    get bookListAgainst(){
        const {against} = this.state;
        /*
        const foundOutcome = this.foundOutcome;
        if(foundOutcome){
            const {handshakes} = this.foundOutcome;
            console.log('against Handshakes:', handshakes);
            if(handshakes){
                return handshakes.filter(item=>(item.side === SIDE.AGAINST));
            }
        }
        return [];
        */
       return against;
    }
    render(){
        const {matches, selectedMatch, selectedOutcome} = this.state;
        const outcomeId = (selectedOutcome && selectedOutcome.id) ? selectedOutcome.id : null;

        const defaultMatchId = this.defaultMatch ? this.defaultMatch.id : null;
        console.log("Default Match:", defaultMatchId);
        console.log('Default Outcome:', defaultOutcome);
        const defaultOutcome = this.defaultOutcome;
        return (
            <div className="wrapperBettingFilter">
            <div className="dropDown">
                <Dropdown placeholder="Select a match" 
                defaultId={defaultMatchId}
                source={this.matchNames}
                onItemSelected={(item) => this.setState({selectedMatch: item})} />
            </div>
            {selectedMatch && <div className="dropDown">
                <Dropdown placeholder="Select a prediction" 
                //defaultId={this.defaultOutcomeId}
                source={this.matchOutcomes} 
                onItemSelected={(item) => {
                    /*this.callGetHandshakes(item)*/
                    this.setState({
                        selectedOutcome: item
                    },() => this.callGetHandshakes(item))
                } 
                }/>
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
    callGetHandshakes(item){
        
        const params = {
            outcome_id: item.id,
        }
        this.props.loadHandshakes({PATH_URL: API_URL.CRYPTOSIGN.LOAD_HANDSHAKES, METHOD:'POST', data: params,
        successFn: this.getHandshakeSuccess,
        errorFn: this.getHandshakeFailed});
    }
    getHandshakeSuccess = async (successData)=>{
        console.log('getHandshakeSuccess', successData);
        const {status, data} = successData;
        if(status && data){
            const {support, against} = data;
            this.setState({
                support,
                against
            })
        }

    }
    getHandshakeFailed = (error) => {
        console.log('getHandshakeFailed', error);
      }
}
const mapState = state => ({
  matches: state.betting.matches,
  supports: state.betting.supports,
  against: state.betting.against,
});
const mapDispatch = ({
    loadMatches,
    loadHandshakes,
  });
export default connect(mapState, mapDispatch)(BettingFilter);

