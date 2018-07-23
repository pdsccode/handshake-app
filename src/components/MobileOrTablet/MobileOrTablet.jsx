import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl'

import { setLanguage } from '@/reducers/app/action';
import VideoYoutube from '@/components/core/controls/VideoYoutube';

// style
import onlyMobileTabletSVG from '@/assets/images/ninja/ninja-header.svg';
import shurikenIcon from '@/assets/images/ninja/shuriken-icon.svg';
import playVideoButton from '@/assets/images/ninja/play-video-button.svg';
import videoLeftCover from '@/assets/images/ninja/video-left-cover.jpg';
import videoRightCover from '@/assets/images/ninja/video-right-cover.jpg';
import phoneIcon from '@/assets/images/ninja/phone-icon.svg';
import './MobileOrTablet.scss';

class MobileOrTablet extends React.PureComponent {
  static propTypes = {
    setLanguage: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  }
  constructor(props) {
    super(props);
    this.changeCountry = ::this.changeCountry;
  }

  componentDidMount() {
    const appContainer = document.getElementById('app');
    appContainer.classList.add('mobileTabletApp');
  }

  changeCountry(countryCode) {
    this.props.setLanguage(countryCode);
  }

  render() {
    const { messages, locale } = this.props.intl;
    return (
      <div className="landing-page">
        <div className="container">
          <div className="row">
            <div className="col">
              <img src={onlyMobileTabletSVG} width="100" />
              <button className="btn btn-join float-right"><FormattedMessage id="landing_page.btn.joinOurTeam" /></button>
            </div>
          </div>

          <div className="row mt-5">
            <div className="col">
              <div className="landing-header">Product</div>
              <div className="landing-sub-header">Produfeafewct</div>
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

export default injectIntl(connect(null, mapDispatch)(MobileOrTablet));
