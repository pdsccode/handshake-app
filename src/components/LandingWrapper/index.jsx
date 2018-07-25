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
    return (
      <div className="landing-page">
        <div className="container">
          <div className="row">
            <div className="col">
              <a href="/"><img src={imgNinja} width="100" /></a>
              <div className="float-right">
                <span><a className={`${type === 'product' ? 'active' : ''} landing-nav-link`} href={URL.PRODUCT_URL}>Product</a></span>
                <span><a className={`${type === 'research' ? 'active' : ''} landing-nav-link`} href={URL.RESEARCH_URL}>Research</a></span>
                <button className="btn btn-primary-landing" style={{ marginLeft: '45px' }}><FormattedMessage id="landing_page.btn.joinOurTeam" /></button>
              </div>
              </div>
          </div>

          {children}

          <hr className="landing-hr" />

          <div className="row landing-footer">
            <div className="col-8">
              <div className="d-table w-100">
                <div className="d-table-cell align-middle p-2">
                  <img src={imgLogo} width="54" />
                </div>
                <div className="d-table-cell align-middle">
                  <div><FormattedHTMLMessage id="landing_page.label.onlyMobile" /></div>
                  <div><FormattedHTMLMessage id="landing_page.label.openOn" /></div>
                </div>
              </div>
            </div>
            <div className="col-4">
              <div className="d-table w-100">
                <div className="d-table-cell align-middle">
                  <div><FormattedHTMLMessage id="landing_page.label.joinTelegram" /></div>
                  <div><FormattedHTMLMessage id="landing_page.label.airdrop" /></div>
                </div>
                <div className="d-table-cell align-middle text-right">
                  <div><FormattedHTMLMessage id="landing_page.label.faq" /></div>
                  <div><FormattedHTMLMessage id="landing_page.label.whitepaper" /></div>
                </div>
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
