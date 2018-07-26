import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { setLanguage } from '@/reducers/app/action';

import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl';

import LandingWrapper from '@/components/LandingWrapper';
import imgDad from '@/assets/images/landing/home/dad.jpg';
import Collapse from '@/components/Collapse';

import './styles.scss';

class Index extends React.PureComponent {

  render() {
    const { messages, locale } = this.props.intl;
    const { name, img, imgContent } = this.props;
    const cta1 = messages[`landing_page.${name}.cta1`];
    const cta2 = messages[`landing_page.${name}.cta2`];
    const youtubeVideoId = messages[`landing_page.${name}.youtubeVideoId`];
    return (
      <LandingWrapper>
        <div className="project-detail">
          <div className="row mt-5">
            <div className="col">
              <div className="pd-breadcrumb"><a href="/"><FormattedMessage id="landing_page.breadcrumb.home" /></a><span className="mx-2">/</span><span><FormattedMessage id={`landing_page.${name}.breadcrumb`} /></span></div>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-6">
              <div className="pd-heading"><FormattedMessage id={`landing_page.${name}.heading`} /></div>
              <div className="pd-subHeading"><FormattedMessage id={`landing_page.${name}.subHeading`} /></div>
              <div className="mt-5">
                {
                  cta1 && (
                    <button className="btn btn-primary-landing">{cta1}</button>
                  )
                }
                {
                  cta2 && (
                    <button className="btn btn-secondary-landing">{cta2}</button>
                  )
                }
              </div>
            </div>
            <div className="col-6">
              {
                youtubeVideoId ? (
                  <iframe
                    width="100%"
                    height="315"
                    src={`https://www.youtube.com/embed/${youtubeVideoId}?rel=0&amp;showinfo=0`}
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                ) : (
                  <img src={img} className="w-100" />
                )
              }
            </div>
          </div>

          <div className="row mt-5">
            <div className="col">
              <div className="pd-content">{messages[`landing_page.${name}.content`]}</div>
            </div>
          </div>
          {
            imgContent && (
              <div className="row">
                <div className="col">
                  <img src={imgContent} className="w-100" />
                </div>
              </div>
            )
          }

          <div className="row">
            <div className="col">
              <div className="pd-faq">{messages.COIN_EXCHANGE_LP_FAQ_TITLE}</div>
              <div>
                {messages.COIN_EXCHANGE_LP_FAQ.map((item, index) => (
                  <Collapse
                    label={item.question}
                    content={item.answer}
                    isList={item.isList}
                    theme="white"
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
