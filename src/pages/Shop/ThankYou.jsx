import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { URL } from '@/constants';
import { withRouter } from 'react-router-dom';
import $http from '@/services/api';
// style
import './ThankYou.scss';
// const EthSVG = 'https://d2q7nqismduvva.cloudfront.net/static/images/icon-svg/common/eth-sign.svg';

class ThankYou extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      products: [],
    };
  }
  
  componentDidMount() {
    // get check status
  }

  render() {
    return (
      <div className="ThankYou">
        <h1>thanks for your order!</h1>
      </div>
    );
  }
}

const mapState = state => ({
  // discover: state.discover,
});

const mapDispatch = dispatch => ({
  // rfChange: bindActionCreators(change, dispatch),
});

export default injectIntl(connect(null, null)(withRouter(ThankYou)));
