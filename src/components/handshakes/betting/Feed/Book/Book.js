import React from 'react';
import PropTypes from 'prop-types';

import "./Book.scss";
class BetBook extends React.Component {
    static propTypes = {
        
    }

    static defaultProps = {
    }

    constructor(props) {
        super(props);
        const {odd} = props;
        this.state = {
          
        };
    
      }
    render(){
        return (
            <div className="wrapperBettingBook">
            <div className="oddText">2.3</div>
            <div className="amountText">0.1528</div>
            </div>
        );
    }

}
export default BetBook;
