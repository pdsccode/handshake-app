import React from 'react'
import { injectIntl } from 'react-intl'
import { URL } from '@/constants'

import './ContentForCashBusiness.scss';
import './ContentForPrediction.scss';

import imgPredictionContent from '@/assets/images/landing/prediction/fake-content.svg'
import imgHowToPlay from '@/assets/images/landing/prediction/pex_how_to_play.png';
import imgExtension from '@/assets/images/landing/prediction/pex_extension.png';
import imgMobileIcon from '@/assets/images/landing/prediction/pex_mobile_icon.png';
import imgMobileGuide1 from '@/assets/images/landing/prediction/pex_mobile_guide1.png';
import imgMobileGuide2 from '@/assets/images/landing/prediction/pex_mobile_guide2.png';
import imgMarket from '@/assets/images/landing/prediction/pex_market.png';


import icPlayTime from '@/assets/images/landing/prediction/pex_play_time.svg';
import icPlaySolution from '@/assets/images/landing/prediction/pex_play_solution.svg';

import PexRoadMap from '@/pages/LandingPage/PexRoadMap';
import { Link } from 'react-router-dom'


class ContentForPrediction extends React.Component {
  renderRoadMap() {
    return (
      <PexRoadMap />
    );
  }
  renderHowToPlay() {
    return (
      <div className="row wrapperHowToPlay">
        <div className="col-sm-6">
          <img src={imgHowToPlay} alt="imgHowToPlay" />
        </div>
        <div className="col-md-4 wrapperContentHowToPlay">
          <div>
            <img src={icPlayTime} alt="icPlayTime" />
            <div className="pexSmallTitle">Time to change the game</div>
            <div className="pexContent">The betting industry has a problem, it’s simply not fair. It’s exclusively run by bookmakers with almost everything stacked in their favor.</div>
          </div>
          <div>
            <img src={icPlaySolution} alt="icPlaySolution" />
            <div className="pexSmallTitle">The solution</div>
            <div className="pexContent">Prediction allows you to directly bet against each other without going through a bookmaker. It’s all managed by blockchain technology and secured with smart contracts.</div>
          </div>
          <button className="pexButton">Instructions on how to play</button>
        </div>
      </div>
    );
  }
  renderExtension() {
    return (
      <div className="row">
        <div className="col-sm-6">
          <div className="pexHeadLine">Extension chrome</div>
          <div className="pexContent">Our decentralized, blockchain based approach allows players to benefit from full transparency and total control over their betting experience. We remove the middleman and hand control back to the user.</div>
          <button className="pexButton">Install our extension</button>
        </div>
        <div className="col-md-4">
          <img src={imgExtension} alt="imgExtension" />
        </div>
      </div>
    );
  }
  renderMobileGuide() {
    return (
      <div className="row">
        <div className="col-md-4">
          <div className="pexHeadLine">Mobile only</div>
          <p className="pexContent">No download or signup required. </p>
          <p className="pexContent">Simply open up your browser and you’re ready to go.</p>
          <img src={imgMobileIcon} alt="imgMobileIcon" />
        </div>
        <div className="col-sm-3">
          <img src={imgMobileGuide1} alt="imgMobileGuide1" />
        </div>
        <div className="col-sm-3">
          <img src={imgMobileGuide2} alt="imgMobileGuide2" />
        </div>
      </div>
    );
  }
  renderMarket() {
    return (
      <div className="row">
        <div className="col-sm-6">
          <img src={imgMarket} alt="imgMarket" />
        </div>
        <div className="col-md-4">
          <div className="pexHeadLine">Make your market</div>
          <div className="pexContent">Prediction allows anyone to create a prediction market about any future event — be it in sports, politics, science, or literally any other aspect of modern life. You, as the market creator, can set the market fee, the market closing time, the reporter of the outcome, and the reporting deadline.</div>
          <button className="pexButton">Create your own bet</button>
        </div>
      </div>
    );
  }

  renderAnonymous() {
    return (
      <div>
        <div className="">Anonymous</div>
        <div>The entire system works without any party revealing their identities. It’s 100% anonymous.</div>
      </div>
    );
  }

  render() {
    const { messages, locale } = this.props.intl
    return (
      <div className='row mt-5'>
        <div className='col'>
          {/*<img src={imgPredictionContent} className='w-100' />*/}
          {this.renderHowToPlay()}
          {this.renderExtension()}
          {this.renderMobileGuide()}
          {this.renderMarket()}
          {this.renderRoadMap()}
          <div className='mt-5'>
            For instructions on how to play:{' '}
            <Link to={URL.PEX_INSTRUCTION_URL}>
              http://ninja.org/pex/instruction
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

ContentForPrediction.propTypes = {}

export default injectIntl(ContentForPrediction);
