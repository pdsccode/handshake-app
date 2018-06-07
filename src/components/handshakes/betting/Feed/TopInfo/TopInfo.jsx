import React from 'react';
import PropTypes from 'prop-types';

import './TopInfo.scss';

class TopInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        
    }
    render() {
        return (
            <div className="wrapperTopInfoContainer">
                <div className="boxInfo">
                    <label>156ETH</label>
                    <label>Traded volume</label>
                </div>
                <div className="boxInfo">
                    <label>2%</label>
                    <label>Wining fee</label>
                </div>
                <div className="boxInfo">
                    <label>5</label>
                    <label>comments</label>
                </div>
            </div>
        );
    }

}
export default TopInfo;
