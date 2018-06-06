import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// service, constant
import { API_URL } from '@/constants';
import { loadMatches, loadHandshakes } from '@/reducers/betting/action';
import { BetHandshakeHandler, SIDE } from '@/components/handshakes/betting/Feed/BetHandshakeHandler';
// components
import Dropdown from '@/components/core/controls/Dropdown';
import BettingShake from './../Shake';
import GroupBook from './../GroupBook';
import ShareSocial from '@/components/core/presentation/ShareSocial';
// style
import './Filter.scss';

const TAG = "BETTING_FILTER";
const SELECTING_DEFAULT = {
    id: '',
    value: '',
};
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
    componentWillReceiveProps(nextProps) {

        const {matches, support, against} = nextProps;
        console.log(`${TAG} Matches:`, matches);
        // const selectedMatch = this.defaultMatch;
        // const selectedOutcome = this.defaultOutcome;
        this.setState({
            matches,
            //selectedMatch,
            //selectedOutcome,
            support,
            against
        })
    }
    componentDidMount(){
        this.props.loadMatches({PATH_URL: API_URL.CRYPTOSIGN.LOAD_MATCHES});
    }

    get defaultMatch() {
        const matchNames = this.matchNames;
        const { matchId } = this.props;
        if (matchNames && matchNames.length > 0) {
            const itemDefault = matchNames.find(item => item.id === matchId);
            return itemDefault || matchNames[0];
            // if (itemDefault) {
            //     return itemDefault;
            // } else {
            //     return matchNames[0];
            // }
        }
        return null;
    }

    get defaultOutcome() {
        const matchOutcomes = this.matchOutcomes;
        //console.log('defaultOutcome matchOutcomes: ', matchOutcomes);
        const { outComeId } = this.props;
        if (matchOutcomes && matchOutcomes.length > 0) {
            const itemDefault = matchOutcomes.find(item => item.id === outComeId);
            return itemDefault || matchOutcomes[0];
        }
        return null;
        // return matchOutcomes && matchOutcomes.length > 0 ? matchOutcomes[0] : null;
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
        //console.log('matchOutcomes selectedMatch:', selectedMatch);
        if(selectedMatch){
            const foundMatch = this.foundMatch;
            if (foundMatch){
                
                const {outcomes} = foundMatch;
                if(outcomes){
                    return outcomes.map((item) => ({ id: item.id, value: item.name, hid: item.hid}));
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

    getInfoShare(selectedMatch, selectedOutcome) {
        return {
            title: `Bet against more ninjas! I put a bet on ${selectedMatch.value}. ${selectedOutcome.value}! Put your coin where your mouth is. shake.ninja`,
            shareUrl: `${location.origin}/discover/${encodeURI(selectedMatch.value)}?match=${selectedMatch.id}&out_come=${selectedOutcome.id}`,
        };
    }

    render(){
        const {matches} = this.state;
        const selectedOutcome = this.outcomeDropDown ? this.outcomeDropDown.itemSelecting : SELECTING_DEFAULT;
        const selectedMatch = this.outcomeDropDown?  this.matchDropDown.itemSelecting : SELECTING_DEFAULT;
        console.log('Selected Outcome:', selectedOutcome);
        console.log('Selected Match:', selectedOutcome);


        const outcomeId = (selectedOutcome && selectedOutcome.id >=0) ? selectedOutcome.id : null;
        const outcomeHid = (selectedOutcome && selectedOutcome.hid >=0) ? selectedOutcome.hid : null;
        const matchName = (selectedMatch && selectedMatch.value) ? selectedMatch.value : null;
        const matchOutcome = (selectedOutcome && selectedOutcome.value) ? selectedOutcome.value : null;
         
        console.log('Outcome Hid:', outcomeHid);
        const defaultMatchId = this.defaultMatch ? this.defaultMatch.id : null;
        // console.log("Default Match:", defaultMatchId);
        // console.log('Default Outcome:', defaultOutcome);
        const defaultOutcomeId = this.defaultOutcome ? this.defaultOutcome.id : null;
        const shareInfo = this.getInfoShare(selectedMatch, selectedOutcome);

        return (
            <div className="wrapperBettingFilter">
            <div className="dropDown">
                <Dropdown placeholder="Select an event"
                onRef={match => this.matchDropDown = match}
                defaultId={defaultMatchId}
                source={this.matchNames}
                afterSetDefault={(item)=>this.setState({selectedMatch: item})}
                onItemSelected={(item) => this.setState({selectedMatch: item})} />
            </div>
            <div className="dropDown">
                <Dropdown placeholder="Select an outcome"
                onRef={match => this.outcomeDropDown = match}
                defaultId={defaultOutcomeId}
                source={this.matchOutcomes}
                afterSetDefault={item =>  this.setState({
                    selectedOutcome: item
                },() => this.callGetHandshakes(item))}
                onItemSelected={(item) => {
                    /*this.callGetHandshakes(item)*/
                    this.setState({
                        selectedOutcome: item
                    },() => this.callGetHandshakes(item))
                }
                }
                />
            </div>
            <div className="share-block">
                <p className="text">The more people, the merrier</p>
                <ShareSocial
                    className="share"
                    title={shareInfo.title}
                    shareUrl={shareInfo.shareUrl}
                />
            </div>

                <div className="wrapperContainer">
                    <div className="item">
                    <GroupBook amountColor="#FA6B49" bookList={this.bookListSupport}/>
                    <GroupBook amountColor="#8BF275" bookList={this.bookListAgainst}/>
                    </div>
                    <div className="item">
                    {<BettingShake 
                        matchName={matchName}
                        matchOutcome={matchOutcome}
                        outcomeId={parseInt(outcomeId)} outcomeHid={parseInt(outcomeHid)}/>}

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

BettingFilter.propType = {
    matchId: PropTypes.number,
    outComeId: PropTypes.number,
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
