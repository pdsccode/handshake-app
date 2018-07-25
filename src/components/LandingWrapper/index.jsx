import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl'

import { setLanguage } from '@/reducers/app/action';
// import VideoYoutube from '@/components/core/controls/VideoYoutube';
import { Link } from 'react-router-dom';

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
    const { children } = this.props;
    return (
      <div className="landing-page">
        <div className="container">
          <div className="row">
            <div className="col">
              <img src={imgNinja} width="100" />
              <button className="btn btn-join float-right"><FormattedMessage id="landing_page.btn.joinOurTeam" /></button>
            </div>
          </div>

          {children}

          <hr className="landing-hr" />

          <div className="row landing-footer">
            <div className="col">
              <div className="d-table w-100">
                <div className="d-table-cell align-middle p-2">
                  <img src={imgLogo} width="100" />
                </div>
                <div className="d-table-cell align-middle">
                  <div><FormattedHTMLMessage id="landing_page.label.onlyMobile" /></div>
                  <div><FormattedHTMLMessage id="landing_page.label.openOn" /></div>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="d-table w-100">
                <div className="d-table-cell align-middle">
                  <div><FormattedHTMLMessage id="landing_page.label.joinTelegram" /></div>
                  <div><FormattedHTMLMessage id="landing_page.label.airdrop" /></div>
                </div>
                <div className="d-table-cell align-middle">
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
