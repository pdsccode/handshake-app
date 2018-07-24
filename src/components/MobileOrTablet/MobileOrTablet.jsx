import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl'

import { setLanguage } from '@/reducers/app/action';
// import VideoYoutube from '@/components/core/controls/VideoYoutube';

// style
import onlyMobileTabletSVG from '@/assets/images/ninja/ninja-header.svg';
import imgCash from '@/assets/images/landing/home/cash.jpg';
import imgBlockchainPrivacy from '@/assets/images/landing/home/blockchain-privacy.jpg';
import imgDad from '@/assets/images/landing/home/dad.jpg';
import imgDao from '@/assets/images/landing/home/dao.jpg';
import imgInternetCash from '@/assets/images/landing/home/internet-cash.jpg';
import imgPrediction from '@/assets/images/landing/home/prediction.jpg';
import imgWallet from '@/assets/images/landing/home/wallet.jpg';
import imgWhisper from '@/assets/images/landing/home/whisper.jpg';

const products = [
  {
    title: <FormattedMessage id="landing_page.products.cash.title" />,
    subTitle: <FormattedMessage id="landing_page.products.cash.subTitle" />,
    img: imgCash
  },
  {
    title: <FormattedMessage id="landing_page.products.prediction.title" />,
    subTitle: <FormattedMessage id="landing_page.products.prediction.subTitle" />,
    img: imgPrediction
  },
  {
    title: <FormattedMessage id="landing_page.products.dad.title" />,
    subTitle: <FormattedMessage id="landing_page.products.dad.subTitle" />,
    img: imgDad
  },
  {
    title: <FormattedMessage id="landing_page.products.wallet.title" />,
    subTitle: <FormattedMessage id="landing_page.products.wallet.subTitle" />,
    img: imgWallet
  },
  {
    title: <FormattedMessage id="landing_page.products.whisper.title" />,
    subTitle: <FormattedMessage id="landing_page.products.whisper.subTitle" />,
    img: imgWhisper
  },
  {
    title: <FormattedMessage id="landing_page.products.dao.title" />,
    subTitle: <FormattedMessage id="landing_page.products.dao.subTitle" />,
    img: imgDao
  }
]


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
            {
              products.map((product, index) => {
                const { title, subTitle, img } = product
                return (
                  <div className="col-4 product" key={index}>
                    <div><img src={img} className="img-fluid" /></div>
                    <div className="landing-header mt-1">{title}</div>
                    <div className="landing-sub-header">{subTitle}</div>
                  </div>
                )
              })
            }
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
