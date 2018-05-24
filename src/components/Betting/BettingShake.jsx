import React from 'react';
import PropTypes from 'prop-types';
import Input from '@/components/core/forms/Input/Input';
import './css/BettingShake.scss';
class BetingShake extends React.Component {
    static propTypes = {
        remaining: PropTypes.number.isRequired,
        odd: PropTypes.number.isRequired
      }
    static defaultProps = {
        remaining: 10
    }
    constructor(props) {
        super(props);
        this.state = {
            total: 0
        };
    }
    render() {
        const {remaining} = this.props;
        const {total} = this.state;
        return(<div>
            <div className="rowWapper">You bet
            </div>
            <div className="rowWapper">Possible win
            </div>
            
            
            </div>);
    }
    updateTotal(text){
        const {odd} = this.props;
        const value = parseInt(text);
        const amount = value * odd;
        this.setState({
            total: amount
        })
    }
}
export default BetingShake;