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
          matchs: []
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
    render(){
        return (
            <div className="wrapperBettingFilter">
            <div className="dropDown">
                <Dropdown placeholder="Select a match" source={[
                    {id: 1, value: 'aaaaa'},
                    {id: 2, value: 'bbbbb'},
                    {id: 3, value: 'ccccc'},
                ]} onItemSelected={(item) => console.log(1111, item)} />
            </div>
            <div className="dropDown">
                <Dropdown placeholder="Select a outcome" source={[
                    {id: 1, value: 'aaaaa'},
                    {id: 2, value: 'bbbbb'},
                    {id: 3, value: 'ccccc'},
                ]} onItemSelected={(item) => console.log(1111, item)} />
            </div>
            
                <div className="wrapperContainer">
                    <div className="item">
                    <GroupBook amountColor="#FA6B49" />
                    <GroupBook amountColor="#8BF275" />
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

