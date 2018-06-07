import React from 'react';
import PropTypes from 'prop-types';

import './TopInfo.scss';

class TopInfo extends React.Component {
    static propTypes = {
        marketTotal: PropTypes.number,
        percentFee: PropTypes.number,
        commentNo: PropTypes.number
      }
    
      static defaultProps = {
        marketFee: 512,
        percentFee: 2,
        commentNo: 3
      };
    constructor(props) {
        super(props);
        this.state = {
        };
        
    }
    render() {
        const {marketFee, percentFee, commentNo} = this.props;
        return (
            <div className="wrapperTopInfoContainer">
                <div className="boxInfo">
                    <div className="number">{marketFee} ETH</div>
                    <div className="des">Traded volume</div>
                </div>
                <div className="boxInfo">
                    <div className="number">{percentFee}%</div>
                    <div className="des">Wining fee</div>
                </div>
                <div className="boxInfo">
                    <div className="number">{commentNo}</div>
                    <div className="des">comments</div>
                </div>
            </div>
        );
    }

}
export default TopInfo;
