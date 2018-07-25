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
import imgCash from '@/assets/images/landing/home/cash.jpg';
import imgBlockchainPrivacy from '@/assets/images/landing/home/blockchain-privacy.jpg';
import imgDad from '@/assets/images/landing/home/dad.jpg';
import imgDao from '@/assets/images/landing/home/dao.jpg';
import imgInternetCash from '@/assets/images/landing/home/internet-cash.jpg';
import imgPrediction from '@/assets/images/landing/home/prediction.jpg';
import imgWallet from '@/assets/images/landing/home/wallet.jpg';
import imgWhisper from '@/assets/images/landing/home/whisper.jpg';

import LandingWrapper from '@/components/LandingWrapper';

import './Dad.scss';

class Dad extends React.PureComponent {

  render() {
    const { messages, locale } = this.props.intl;
    return (
      <LandingWrapper>
        <div className="row mt-5">
          <div className="col">
            aihhiawoeifaowefi
          </div>
        </div>
      </LandingWrapper>
    )
  }
}

const mapDispatch = ({
  setLanguage,
});

export default injectIntl(connect(null, mapDispatch)(Dad));
