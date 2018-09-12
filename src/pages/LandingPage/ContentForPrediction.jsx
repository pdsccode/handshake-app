import React from 'react'
import { injectIntl } from 'react-intl'
import { URL } from '@/constants'

import './ContentForCashBusiness.scss';
import './ContentForPrediction.scss';

import imgPredictionContent from '@/assets/images/landing/prediction/fake-content.svg'
import imgHowToPlay from '@/assets/images/landing/prediction/pex_how_to_play.png';

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
      <div className="wrapperHowToPlay">
        <img src={imgHowToPlay} width="" />
        <div className="wrapperContentHowToPlay">
          <div>
            <img src={imgPredictionContent} width="" />
            <div>Time to change the game</div>
            <div>The betting industry has a problem, it’s simply not fair. It’s exclusively run by bookmakers with almost everything stacked in their favor.</div>
          </div>
          <div>
            <img src={imgPredictionContent} width="" />
            <div>The solution</div>
            <div>The betting industry has a problem, it’s simply not fair. It’s exclusively run by bookmakers with almost everything stacked in their favor.</div>
            </div>
        </div>
      </div>
    );
  }
  render () {
    const { messages, locale } = this.props.intl
    return (
      <div className='row mt-5'>
        <div className='col'>
          <img src={imgPredictionContent} className='w-100' />
          {this.renderHowToPlay()}

          {this.renderRoadMap()}
          <div className='mt-5'>
            For instructions on how to play:{' '}
            <Link to={URL.PEX_INSTRUCTION_URL}>
              http://ninja.org/pex/prediction
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

ContentForPrediction.propTypes = {}

export default injectIntl(ContentForPrediction);
