import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import qs from 'querystring';

import { URL } from '@/constants';
import { initApp } from '@/reducers/app/action';
import I18n from '@/components/App/I18n';
import Splash from '@/components/App/Splash';
import Handle from '@/components/App/Handle';
import { createDynamicImport } from '@/services/app';
import BrowserDetect from '@/services/browser-detect';

// styles
import '@/styles/main';
import '@/styles/custom-icons/styles.css';

// pages
const LandingPage = createDynamicImport(() => import('@/pages/LandingPage/LandingPage'), Splash);
const LandingPageTrade = createDynamicImport(() => import('@/pages/LandingPage/Trade'), Splash);
const LandingPageCash = createDynamicImport(() => import('@/pages/LandingPage/Cash'), Splash);
const LandingPageWhitePaper = createDynamicImport(() => import('@/pages/LandingPage/WhitePaper'), Splash);
const IntroNjnjaCash = createDynamicImport(() => import('@/pages/LandingPage/IntroducingNinjaCash'), Splash);
const AboutNjnjaCash = createDynamicImport(() => import('@/pages/LandingPage/AboutNinjaCash'), Splash);
const LandingPageFAQ = createDynamicImport(() => import('@/pages/FAQ/FAQ'), Splash);
const LandingPageMain = createDynamicImport(() => import('@/pages/LandingPage/Main'), Splash);

const ProjectDetail = createDynamicImport(() => import('@/components/ProjectDetail'), Splash);
// const ProjectInternetCash = createDynamicImport(() => import('@/components/MobileOrTablet/ProjectInternetCash'), Splash);
// const ProjectCash = createDynamicImport(() => import('@/components/MobileOrTablet/ProjectCash'), Splash);
// const ProjectOddBall = createDynamicImport(() => import('@/components/MobileOrTablet/ProjectOddBall'), Splash);

class Root extends React.Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    initApp: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      rootLoading: this.props.app.rootLoading,
    };
  }


  componentDidMount() {
    const querystring = window.location.search.replace('?', '');
    const querystringParsed = qs.parse(querystring);
    const { language, ref } = querystringParsed;
    this.props.initApp(language, ref);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.app.rootLoading !== prevState.rootLoading) {
      return { rootLoading: nextProps.rootLoading };
    }
    return null;
  }

  preRender() {
    if (BrowserDetect.isBot) {
      return <LandingPageMain />;
    }
    switch (window.location.pathname) {
      case URL.LANDING_PAGE_SHURIKEN:
        return <LandingPage />;
      case URL.LANDING_PAGE_TRADE:
        return <LandingPageTrade />;
      case URL.FAQ:
        return <LandingPageFAQ />;
      case URL.WHITE_PAPER:
        return <LandingPageWhitePaper />;
      case URL.INTRODUCING_NINJA_CASH:
        return <IntroNjnjaCash />;
      case URL.ABOUT_NINJA_CASH:
        return <AboutNjnjaCash />;

      case URL.PRODUCT_URL:
        return <LandingPageMain type="product" />;
      case URL.RESEARCH_URL:
        return <LandingPageMain type="research" />;

      case URL.PROJECT_DAD_URL:
        return <ProjectDetail name="dad" />;
      case URL.PROJECT_INTERNET_CASH_URL:
        return <ProjectDetail name="internet_cash" />;
      // case URL.PROJECT_CASH:
      //   return <ProjectCash />;
      // case URL.PROJECT_ODD_BALL:
      //   return <ProjectOddBall />;
      default:
        // code
    }
    if (BrowserDetect.isDesktop) {
      switch (window.location.pathname) {
        case URL.HANDSHAKE_CASH:
          return <LandingPageCash />;
        default:
      }
      return <LandingPageMain />;
    }
    return <Handle setLanguage={this.setLanguage} refer={this.refer} />;
  }

  render() {
    return (
      <I18n>
        <div className="root">
          {
            this.state.rootLoading
            ? <Splash />
            : null
          }
          {
            !this.state.rootLoading
            ? this.preRender()
            : null
          }
        </div>
      </I18n>
    );
  }
}

export default connect(state => ({ app: state.app }), ({ initApp }))(Root);
