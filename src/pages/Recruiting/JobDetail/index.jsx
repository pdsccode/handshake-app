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
  state = {
    job: {}
  }
  componentDidMount() {
    const { match: { params: { slug } } } = this.props;
    axios
      .get(`https://www.autonomous.ai/api-v2/job-api/job/${slug}`)
      .then(res => {
        this.setState({ job: res.data.data });
      })
      .catch(err => console.log('err get job detail', err));
  }
  render() {
    const { job } = this.state;
    console.log('wefefjob', job)
    const { name, project, skill, summary, image, content } = job;
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
          <div className="row">
            <div className="col-12 col-md-10">
              <button className="btn btn-primary">Apply now</button>
            </div>
            <div className="col-12 col-md-2">
              conten
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
