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
        commentNo: 3
      };
    constructor(props) {
        super(props);
        this.state = {
        };
        
    }
    render() {
        const {marketTotal, percentFee, commentNo} = this.props;
        console.log(this.props);
        return (
            <div className="wrapperTopInfoContainer">
                <div className="boxInfo">
                    <div className="number">{marketTotal} ETH</div>
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
