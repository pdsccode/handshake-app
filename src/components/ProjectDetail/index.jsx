import React from 'react';
import { connect } from 'react-redux';

import { setLanguage } from '@/reducers/app/action';

import { FormattedMessage, injectIntl } from 'react-intl';
import { Field, formValueSelector } from 'redux-form';

import LandingWrapper from '@/components/LandingWrapper';
import Collapse from '@/components/Collapse';
import createForm from '@/components/core/form/createForm';
import { fieldInput } from '@/components/core/form/customField';
import { email, required } from '@/components/core/form/validation';
import $http from '@/services/api';
import { BASE_API } from '@/constants';
import './styles.scss';

const nameFormSubscribeEmail = 'subscribeEmail';
const FormSubscribeEmail = createForm({
  propsReduxForm: {
    form: nameFormSubscribeEmail,
  },
});
const selectorFormSubscribeEmail = formValueSelector(nameFormSubscribeEmail);

class Index extends React.PureComponent {
  state = {
    hasSubscribed: false,
  };

  handleSubmit = values => {
    const { name } = this.props;
    const { email } = values;
    const formData = new FormData();
    formData.set('email', email);
    formData.set('product', name);

    $http({
      method: 'POST',
      url: `${BASE_API.BASE_URL}/user/subscribe`,
      data: formData,
    })
      .then(res => {
        this.setState({ hasSubscribed: true });
      })
      .catch(err => {
        console.log('err subscribe email', err);
      });
  };

  render() {
    const { messages, locale } = this.props.intl;
    const {
      name, img, imgContent, getEmail,
    } = this.props;
    const { hasSubscribed } = this.state;
    const cta1 = messages[`landing_page.${name}.cta1`];
    const cta2 = messages[`landing_page.${name}.cta2`];
    const textEmail = messages[`landing_page.${name}.textEmail`];
    const btnSubmitEmail =
      messages[`landing_page.${name}.btnSubmitEmail`] || 'Submit';
    const youtubeVideoId = messages[`landing_page.${name}.youtubeVideoId`];
    const faq = messages[`landing_page.${name}.faq`];
    return (
      <LandingWrapper>
        <div className="project-detail">
          <div className="row mt-5">
            <div className="col">
              <div className="pd-breadcrumb">
                <a href="/">
                  <FormattedMessage id="landing_page.breadcrumb.home" />
                </a>
                <span className="mx-2">/</span>
                <span>
                  <FormattedMessage id={`landing_page.${name}.breadcrumb`} />
                </span>
              </div>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-6">
              <div className="pd-heading">
                <FormattedMessage id={`landing_page.${name}.heading`} />
              </div>
              <div className="pd-subHeading">
                <FormattedMessage id={`landing_page.${name}.subHeading`} />
              </div>
              <div className="mt-4">
                {textEmail && (
                  <span>
                    {!hasSubscribed ? (
                      <FormSubscribeEmail onSubmit={this.handleSubmit}>
                        <div className="d-table w-100">
                          <div className="d-table-cell align-top">
                            <Field
                              name="email"
                              className="form-control control-subscribe-email"
                              placeholder="youremail@somecompany.com"
                              type="text"
                              validate={[required, email]}
                              component={fieldInput}
                            />
                          </div>
                          <div className="d-table-cell align-top">
                            <button
                              type="submit"
                              className="btn btn-primary-landing w-100 ml-1"
                            >
                              {btnSubmitEmail}
                            </button>
                          </div>
                        </div>
                      </FormSubscribeEmail>
                    ) : (
                      <h5>
                        <strong className="text-success">
                          <FormattedMessage id="landing_page.detail.thanksForSubscribing" />
                        </strong>
                      </h5>
                    )}
                  </span>
                )}
                {cta1 && (
                  <button className="btn btn-primary-landing">{cta1}</button>
                )}
                {cta2 && (
                  <button className="btn btn-secondary-landing">{cta2}</button>
                )}
              </div>
            </div>
            <div className="col-6">
              {youtubeVideoId ? (
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
              )}
            </div>
          </div>

          <div className="row mt-5">
            <div className="col">
              <div className="pd-content">
                {messages[`landing_page.${name}.content`]}
              </div>
            </div>
          </div>
          {imgContent && (
            <div className="row">
              <div className="col">
                <img src={imgContent} className="w-100" />
              </div>
            </div>
          )}

          {
            faq && (
              <div className="row">
                <div className="col">
                  <div className="pd-faq">
                    {messages.COIN_EXCHANGE_LP_FAQ_TITLE}
                  </div>
                  <div>
                    {faq.map((item, index) => (
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
            )
          }
        </div>
      </LandingWrapper>
    );
  }
}

const mapDispatch = {
  setLanguage,
};

export default injectIntl(connect(null, mapDispatch)(Index));
