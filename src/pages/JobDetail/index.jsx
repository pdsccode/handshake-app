import React from 'react';
import { connect } from 'react-redux';
import LandingWrapper from '@/components/LandingWrapper';
import axios from 'axios';
// import PropTypes from 'prop-types';
import './styles.scss';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { URL } from '@/constants';

class JobDetail extends React.Component {
  componentDidMount() {
    const { match: { params: { slug } } } = this.props;
    console.log('slugg', slug)
  }
  render() {
    return (
      <LandingWrapper>
        <div className="job-detail">
          <div className="row mt-5">
            <div className="col">
              <Link to={URL.RECRUITING}>
                <img src="https://d2q7nqismduvva.cloudfront.net/static/images/icon-svg/common/back.svg" />
                &nbsp;<FormattedMessage id="landing_page.recruiting.label.backToListing" />
              </Link>
            </div>
          </div>
        </div>
      </LandingWrapper>
    );
  }
}

const mapState = state => ({});

const mapDispatch = dispatch => ({
  // rfChange: bindActionCreators(change, dispatch),
});

export default injectIntl(connect(mapState, mapDispatch)(JobDetail));
