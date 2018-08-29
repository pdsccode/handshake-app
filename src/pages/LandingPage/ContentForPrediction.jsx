import React from 'react';
import { injectIntl } from 'react-intl';

import './ContentForCashBusiness.scss';

import imgPredictionContent from '@/assets/images/landing/prediction/fake-content.svg';

class ContentForPrediction extends React.Component {
  render() {
    const { messages, locale } = this.props.intl;
    return (
      <div className="row mt-5">
        <div className="col">
          <img src={imgPredictionContent} className="w-100" />
          <div className="mt-5">For instructions on how to play: <a target="__blank" href="https://medium.com/@cian_36990/7657761ea2bd">https://medium.com/@cian_36990/7657761ea2bd</a></div>
        </div>
      </div>
    );
  }
}

ContentForPrediction.propTypes = {};

export default injectIntl(ContentForPrediction);
