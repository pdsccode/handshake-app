import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { setLanguage } from '@/reducers/app/action';

import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl';

import LandingWrapper from '@/components/LandingWrapper';
import imgDad from '@/assets/images/landing/home/dad.jpg';

import './styles.scss';

class Index extends React.PureComponent {

  render() {
    const { messages, locale } = this.props.intl;
    const { name } = this.props;
    return (
      <LandingWrapper>
        <div className="project-detail">
          <div className="row mt-5">
            <div className="col">
              <div className="pd-breadcrumb"><a href="/"><FormattedMessage id="landing_page.breadcrumb.home" /></a><span className="mx-2">/</span><span><FormattedMessage id="landing_page.dad.breadcrumb" /></span></div>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-6">
              <div className="pd-heading"><FormattedMessage id={`landing_page.${name}.heading`} /></div>
              <div className="pd-subHeading"><FormattedMessage id={`landing_page.${name}.subHeading`} /></div>
              <button className="btn btn-primary-landing" style={{ marginTop: '45px' }}><FormattedMessage id="landing_page.btn.goToLandingPage" /></button>
            </div>
            <div className="col-5 offset-1">
              <img src={imgDad} className="w-100" />
            </div>
          </div>
          <div className="row mt-5">
            <div className="col">
              <div className="pd-content"><FormattedHTMLMessage id={`landing_page.${name}.content`} /></div>
            </div>
          </div>
        </div>
      </LandingWrapper>
    )
  }
}

const mapDispatch = ({
  setLanguage,
});

export default injectIntl(connect(null, mapDispatch)(Index));
