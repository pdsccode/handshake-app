import React from 'react';
import { connect } from 'react-redux';
import LandingWrapper from '@/components/LandingWrapper';
import axios from 'axios';
// import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { URL } from '@/constants';
import ButtonApplyNow from '../Components/ButtonApplyNow'
import SocialButtons from '../Components/SocialButtons'

import './styles.scss';
import '../styles.scss'

const BackToListing = (
  <div className="row mt-5">
    <div className="col">
      <Link to={URL.RECRUITING}>
        <img src="https://d2q7nqismduvva.cloudfront.net/static/images/icon-svg/common/back.svg" />
        &nbsp;<FormattedMessage id="landing_page.recruiting.label.backToListing" />
      </Link>
    </div>
  </div>
)

class JobDetail extends React.Component {
  state = {
    job: {}
  }
  componentDidMount() {
    const { match: { params: { slug } } } = this.props;
    axios
      .get(`https://www.autonomous.ai/api-v2/job-api/job/${slug}`)
      .then(res => {
        this.setState({ job: res.data.data || {} });
      })
      .catch(err => console.log('err get job detail', err));
  }
  render() {
    const { job } = this.state;
    console.log('jobbbb', job)
    const { name, project, skill, summary, image, content } = job;
    return (
      <LandingWrapper>
        <div className="job-detail">
          {BackToListing}
          <div className="row mt-3">
            <div className="col-12 col-md-9">
              <div className="jd-name">{name}</div>
              <div className="job-text-pr mt-2">
                <span className="mr-2"><FormattedMessage id="landing_page.recruiting.label.getTheWordOut" /></span>
                <SocialButtons />
              </div>
            </div>
            <div className="col-12 text-right col-md-3 mt-2">
              <ButtonApplyNow className="btn-block" />
              <button className="btn btn-outline-primary btn-lg btn-block mt-2"><FormattedMessage id="landing_page.recruiting.button.referFriend" /></button>
            </div>
          </div>

          <hr />

          <div className="row">
            <div className="col">
              <img className="img-fluid" src={image} />
            </div>
          </div>
          <div className="row mt-4">
            <div className="col">
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
          </div>
          <div className="row">
            <div className="col">
              <ButtonApplyNow className="btn-block" />
            </div>
          </div>
          {BackToListing}
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
