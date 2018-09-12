import React from 'react';
import PropTypes from 'prop-types';
import ProjectDetail from '@/components/ProjectDetail';
import { FormattedMessage, injectIntl } from 'react-intl';

import imgUncommons from '@/assets/images/landing/home/uncommons.jpg';
import imgGivers01 from '@/assets/images/landing/uncommons/givers-01.png';
import imgGivers02 from '@/assets/images/landing/uncommons/givers-02.png';
import imgDevelopers01 from '@/assets/images/landing/uncommons/developers-01.png';
import imgUsers01 from '@/assets/images/landing/uncommons/users-01.png';
import './Uncommons.scss';

class UncommonsLandingPage extends React.Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
  }
  render() {
    const { messages } = this.props.intl;

    return (
      <ProjectDetail
        type="product"
        name="uncommons"
        img={imgUncommons}
        contentComponent={
          <React.Fragment>
            <div className="uncommons-page-block uncommons-page-block-givers">
              <div
                className="uncommons-page-block-background"
                style={{
                  backgroundImage: `url(${imgGivers01})`,
                }}
              />
              <div className="uncommons-page-block-header">
                <h2><FormattedMessage id="landing_page.uncommons.block.1.header" /></h2>
                <div><FormattedMessage id="landing_page.uncommons.block.1.subheader" /></div>
              </div>
              <div className="uncommons-page-block-content row">
                <div className="col-12 col-md-6">
                  <p><FormattedMessage id="landing_page.uncommons.block.1.content.1" /></p>
                  <p><FormattedMessage id="landing_page.uncommons.block.1.content.2" /></p>
                  <a href={messages['landing_page.uncommons.block.1.button_url']} className="btn btn-primary-landing btn-next"><FormattedMessage id="landing_page.uncommons.block.1.button" /></a>
                </div>
                <div className="col-12 col-md-6">
                  <img src={imgGivers02} alt="" />
                </div>
              </div>
            </div>
            <div className="uncommons-page-block uncommons-page-block-developers">
              <div className="uncommons-page-block-header">
                <h2><FormattedMessage id="landing_page.uncommons.block.2.header" /></h2>
                <div><FormattedMessage id="landing_page.uncommons.block.2.subheader" /></div>
              </div>
              <div className="row">
                <div className="col-12 col-md-6"><p><FormattedMessage id="landing_page.uncommons.block.2.content.1" /></p></div>
                <div className="col-12 col-md-6"><p><FormattedMessage id="landing_page.uncommons.block.2.content.2" /></p></div>
                <div className="col-12"><a href={messages['landing_page.uncommons.block.2.button_url']} className="btn btn-primary-landing btn-next"><FormattedMessage id="landing_page.uncommons.block.2.button" /></a></div>
              </div>
              <div>
                <img src={imgDevelopers01} alt="" />
              </div>
            </div>
            <div className="uncommons-page-block">
              <div className="uncommons-page-block-header uncommons-page-block-header-center">
                <h2><FormattedMessage id="landing_page.uncommons.block.3.header" /></h2>
                <div><FormattedMessage id="landing_page.uncommons.block.3.subheader" /></div>
              </div>
              <div className="row">
                <div className="col-12 col-md-6">
                  <img src={imgUsers01} alt="" />
                </div>
                <div className="col-12 col-md-6">
                  <p><FormattedMessage id="landing_page.uncommons.block.3.content.1" /></p>
                  <p><FormattedMessage id="landing_page.uncommons.block.3.content.2" /></p>
                  <a href={messages['landing_page.uncommons.block.3.button_url']} className="btn btn-primary-landing btn-next"><FormattedMessage id="landing_page.uncommons.block.3.button" /></a>
                </div>
              </div>
            </div>
            <div className="uncommons-page-block uncommons-page-block-center uncommons-page-block-last">
              <div className="uncommons-page-block-header">
                <h2><FormattedMessage id="landing_page.uncommons.block.4.header" /></h2>
              </div>
              <p><FormattedMessage id="landing_page.uncommons.block.4.content.1" /></p>
              <p><FormattedMessage id="landing_page.uncommons.block.4.content.2" /></p>
            </div>
          </React.Fragment>
        }
      />
    );
  }
}

export default injectIntl(UncommonsLandingPage);
