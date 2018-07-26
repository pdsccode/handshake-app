import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl'

import { setLanguage } from '@/reducers/app/action';
// import VideoYoutube from '@/components/core/controls/VideoYoutube';
import { Link } from 'react-router-dom';
import { URL } from '@/constants';

// style
import imgNinja from '@/assets/images/ninja/ninja-header-black.svg';
import imgLogo from '@/assets/images/logo.png';


import './styles.scss';

class Index extends React.PureComponent {
  static propTypes = {
    setLanguage: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  }
  constructor(props) {
    super(props);
    this.changeCountry = ::this.changeCountry;
  }

  componentDidMount() {
    console.log('mobile', this.props)
    const appContainer = document.getElementById('app');
    appContainer.classList.add('mobileTabletApp');
  }

  changeCountry(countryCode) {
    this.props.setLanguage(countryCode);
  }

  render() {
    const { messages, locale } = this.props.intl;
    const { children, type } = this.props;
    const logo = <a href="/" className="d-inline-block mt-1"><img src={imgNinja} width="100" /></a>;
    const navLinks = (
      <span>
        <span><a className={`${type === 'product' ? 'active' : ''} landing-nav-link`} href={URL.PRODUCT_URL}>Product</a></span>
        <span><a className={`${type === 'research' ? 'active' : ''} landing-nav-link`} href={URL.RESEARCH_URL}>Research</a></span>
      </span>
    )
    const btnJoin = <a className="btn btn-primary-landing" href="https://www.autonomous.ai/talents"><FormattedMessage id="landing_page.btn.joinOurTeam" /></a>

    return (
      <div className="landing-page">
        <div className="container">
          {/* mobile */}
          <div className="row d-md-none">
            <div className="col-5">
              {logo}
            </div>
            <div className="col-7">
              <div className="text-right">
                {btnJoin}
              </div>
            </div>
          </div>
          <div className="row d-md-none">
            <div className="col">{navLinks}</div>
          </div>

          {/* desktop */}
          <div className="row d-none d-md-flex">
            <div className="col-2">
              {logo}
            </div>
            <div className="col-10">
              <div className="text-right">
                {navLinks}
                {btnJoin}
              </div>
             </div>
          </div>


          {children}

          <hr className="landing-hr" />

          <div className="row landing-footer no-gutters">
            <div className="col-12 col-md-1">
              <img src={imgLogo} width="54" />
            </div>
            <div className="col-12 col-md-5">
              <div className="align-middle">
                <div><FormattedHTMLMessage id="landing_page.label.onlyMobile" /></div>
                <div><FormattedHTMLMessage id="landing_page.label.openOn" /></div>
              </div>
            </div>
            <div className="col-12 col-md-6 text-left text-md-right">
              <div>
                <div><FormattedHTMLMessage id="landing_page.label.joinTelegram" /></div>
                <div><FormattedHTMLMessage id="landing_page.label.whitepaper" /></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }
}

const mapDispatch = ({
  setLanguage,
});

export default injectIntl(connect(null, mapDispatch)(Index));
