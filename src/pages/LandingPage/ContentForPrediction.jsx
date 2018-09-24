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
import imgAnonymous from '@/assets/images/landing/prediction/pex_anonymous.png';
import imgBottomMenu from '@/assets/images/landing/prediction/pex_bottom_menu.png';
import imgTransparent from '@/assets/images/landing/prediction/pex_transparent.png';
import imgFeature from '@/assets/images/landing/prediction/pex_feature.png';
import imgMobileShape1 from '@/assets/images/landing/prediction/pex_mobile_shape1.svg';
import imgMobileShape2 from '@/assets/images/landing/prediction/pex_mobile_shape2.svg';
import imgAnonymousShape1 from '@/assets/images/landing/prediction/pex_anonymous_shape1.svg';
import imgAnonymousShape2 from '@/assets/images/landing/prediction/pex_anonymous_shape2.svg';
import imgAnonymousShape3 from '@/assets/images/landing/prediction/pex_anonymous_shape3.svg';

import icPlayTime from '@/assets/images/landing/prediction/pex_play_time.svg';
import icPlaySolution from '@/assets/images/landing/prediction/pex_play_solution.svg';

import PexRoadMap from '@/pages/LandingPage/PexRoadMap';
import { Link } from 'react-router-dom'



// renderRoadMap() {
//   return (

//   );
//}

class ContentForPrediction extends React.Component {
  openExtension() {
    window.open('https://chrome.google.com/webstore/detail/pheabihpgpobcfkhkndnpkaencnjjfof', '_blank');
  }
  /*
  renderIntroduce(){
    return (

    );
  }
  */

  renderRoadMap() {
    return (
      <PexRoadMap className="wrapperBlock" />
    );
  }
  renderHowToPlay() {
    return (
      <section className="section wrapperHowToPlay">
        <div className="wrapperBlock">
          <div className="column">
            <img className="imageLeft" src={imgHowToPlay} alt="imgHowToPlay" width="350" />
          </div>
          <div className="column wrapperContentHowToPlay">
            <div className="wrapperSmallBlock">
              <img src={icPlayTime} alt="icPlayTime" width="40" />
              <div className="pexSmallTitle">Time to change the game</div>
              <div className="pexContent">The betting industry has a problem, it’s simply not fair. It’s exclusively run by bookmakers with almost everything stacked in their favor.</div>
            </div>
            <div className="wrapperSmallBlock">
              <img src={icPlaySolution} alt="icPlaySolution" width="40" />
              <div className="pexSmallTitle">The solution</div>
              <div className="pexContent">Prediction allows you to directly bet against each other without going through a bookmaker. It’s all managed by blockchain technology and secured with smart contracts.</div>
            </div>
            <Link to={URL.PEX_INSTRUCTION_URL}>
              <button className="pexButton">Instructions on how to play</button>
            </Link>
          </div>
        </div>
      </section>
    );
  }
  renderExtension() {
    return (
      <section className="section">
        <div className="wrapperExtentsion wrapperBlock">
          <div className="column">
            <img src={imgExtension} alt="imgExtension" width="600" />
          </div>
          <div className="column">
            <div className="wrappeContent">
              <div className="pexHeadLine">Extension chrome</div>
              <div className="pexContent">Use Ninja Prediction on your desktop, you can browse the web, predict and win ETH with the Chrome Extension.</div>
              <div className="pexContent">With just a click, you can create bets from (almost) anything you read & see online.</div>
            </div>
            {/*<button className="pexButton"
              onClick={() => this.openExtension()}
            >Install our extension
      </button>*/}
          </div>

        </div>
      </section>
    );
  }
  renderMobileGuide() {
    return (
      <section className="section bg-gradient-mobile">
        <span className="mobile_recDown" />
        <span className="mobile_recUp" />
        <img className="mobile_shape1" src={imgMobileShape1} alt="imgMobileShape1" width="160" />
        <img className="mobile_shape2" src={imgMobileShape2} alt="imgMobileShape2" width="400" />

        <div className="wrapperMobile wrapperBlock">
          <div className="contentBlock column ">
            <div className="pexHeadLine">Mobile only</div>
            <div className="pexContent">No download or signup required. <br/> Simply open up your browser and you’re ready to go.</div>
            <img className="imageContent" src={imgMobileIcon} alt="imgMobileIcon" width="400" />
          </div>
          <div className="column">
            <img className="rightImageFirst" src={imgMobileGuide1} alt="imgMobileGuide1" width="350" />
            <img className="rightImageSecond" src={imgMobileGuide2} alt="imgMobileGuide2" width="350" />
          </div>
        </div>
      </section>
    );
  }
  renderMarket() {
    return (
      <section className="section">
        <div className="wrapperBlock">
          <div className="column">
            <img src={imgMarket} alt="imgMarket" width="500" />
          </div>
          <div className="column">
            <div className="wrapperSmallBlock">
              <div className="pexHeadLine">Make your market</div>
              <div className="pexContent">Prediction allows anyone to create a prediction market about any future event — be it in sports, politics, science, or literally any other aspect of modern life. You, as the market creator, can set the market fee, the market closing time, the reporter of the outcome, and the reporting deadline.</div>
              <div className="pexContent">Create your own market, please open {' '}
              <Link to={URL.HANDSHAKE_PEX_CREATOR}>
              https://ninja.org/create-pex
              </Link>
              {' '}on your mobile browser.
              </div>
            </div>
            {/*<button className="pexButton">Create your own bet</button>*/}
          </div>
        </div>
      </section>
    );
  }

  renderAnonymous() {
    return (
      <section className="section bg-gradient-anonymous">
        <span className="anonymous_recUp" />
        <span className="anonymous_recDown" />
        <img className="anonymous_shape1" src={imgAnonymousShape1} alt="imgAnonymousShape1" width="30" />
        <img className="anonymous_shape2" src={imgAnonymousShape2} alt="imgAnonymousShape2" width="50" />
        <img className="anonymous_shape3" src={imgAnonymousShape3} alt="imgAnonymousShape3" width="350" />

        <div className="wrapperAnonymous wrapperVerticalBlock">
          <div className="contentBlock">
            <div className="pexHeadLine">Anonymous</div>
            <div className="pexContent">The entire system works without any party revealing their identities. It’s 100% anonymous.</div>
            <img src={imgAnonymous} alt="imgAnonymous" width="800" />
          </div>
        </div>
      </section>
    );
  }
  renderTransparency() {
    return (
      <div className="wrapperBlock">
        <div className="column">
          <div className="pexHeadLine" >Transparency</div>
          <div className="pexContent">Our decentralized, blockchain based approach allows players to benefit from full transparency and total control over their betting experience. We remove the middleman and hand control back to the user.</div>
        </div>
        <div className="column">
          <img src={imgTransparent} alt="imgTransparent" width="350" />
        </div>
      </div>
    );
  }
  renderFeature() {
    return (
      <div className="wrapperVerticalBlock">
        <img src={imgFeature} alt="imgFeature" width="100%" />
      </div>
    );
  }

  render() {
    const { messages, locale } = this.props.intl
    return (
      <div className=''>
        {/*<img src={imgPredictionContent} className='w-100' />*/}
          {this.renderHowToPlay()}
          {this.renderExtension()}
          {this.renderMobileGuide()}
          {/*this.renderExample()*/}
          {this.renderMarket()}
          {this.renderAnonymous()}
          {this.renderTransparency()}
          {/*this.renderFeature()*/}
          {this.renderRoadMap()}
      </div>
    );
  }
}

ContentForPrediction.propTypes = {}

export default injectIntl(ContentForPrediction);
