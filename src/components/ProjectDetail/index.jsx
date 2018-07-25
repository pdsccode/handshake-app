import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { setLanguage } from '@/reducers/app/action';

import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl';

import LandingWrapper from '@/components/LandingWrapper';
import imgDad from '@/assets/images/landing/home/dad.jpg';

import './styles.scss';

class Index extends React.PureComponent {

  render() {
    const { messages, locale } = this.props.intl;
    const { name } = this.props;
    return (
      <LandingWrapper>
        <div className="project-detail">
          <div className="row mt-5">
            <div className="col">
              <div className="pd-breadcrumb"><a href="/"><FormattedMessage id="landing_page.breadcrumb.home" /></a><span className="mx-2">/</span><span><FormattedMessage id="landing_page.dad.breadcrumb" /></span></div>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-6">
              <div className="pd-heading"><FormattedMessage id={`landing_page.${name}.heading`} /></div>
              <div className="pd-subHeading"><FormattedMessage id={`landing_page.${name}.subHeading`} /></div>
              <div className="mt-3">
                {
                  messages[`landing_page.${name}.cta1`] && (
                    <button className="btn btn-primary-landing"><FormattedMessage id={`landing_page.${name}.cta1`} /></button>
                  )
                }
                {
                  messages[`landing_page.${name}.cta2`] && (
                    <button className="btn btn-secondary-landing"><FormattedMessage id={`landing_page.${name}.cta1`} /></button>
                  )
                }
              </div>
            </div>
            <div className="col-6">
              <img src={imgDad} className="w-100" />
              {/*<iframe*/}
                {/*width="560"*/}
                {/*height="315"*/}
                {/*src="https://www.youtube.com/embed/021EEUIfy9w?rel=0&amp;showinfo=0"*/}
                {/*frameBorder="0"*/}
                {/*allow="autoplay; encrypted-media"*/}
                {/*allowFullScreen*/}
              {/*/>*/}
            </div>
          </div>

          <div className="row mt-5">
            <div className="col">
              <div className="pd-content">{messages[`landing_page.${name}.content`]}</div>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <p className="subTitle">{messages.COIN_EXCHANGE_LP_FAQ_TITLE}</p>
              <div>
                {messages.COIN_EXCHANGE_LP_FAQ.map((item, index) => (
                  <Collapse
                    label={item.question}
                    content={item.answer}
                    isList={item.isList}
                    key={index}
                    index={index + 1}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </LandingWrapper>
    )
  }
}

const mapDispatch = ({
  setLanguage,
});

export default injectIntl(connect(null, mapDispatch)(Index));
