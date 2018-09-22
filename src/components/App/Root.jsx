import React from 'react';
import { connect } from 'react-redux';
import qs from 'querystring';
// import { URL } from '@/constants';
import { initApp } from '@/reducers/app/action';
import I18n from '@/components/App/I18n';
// import Splash from '@/components/App/Splash';
import Handle from '@/components/App/Handle';
// styles
import '@/styles/main';
import '@/styles/custom-icons/styles.css';
// import { createDynamicImport } from '@/services/app';
// import BrowserDetect from '@/services/browser-detect';

// pages
// const LandingPage = createDynamicImport(() => import('@/pages/LandingPage/LandingPage'), Splash);
// // const LandingPageCash = createDynamicImport(() => import('@/pages/LandingPage/Cash'), Splash);
// const LandingPageWhitePaper = createDynamicImport(() => import('@/pages/LandingPage/WhitePaper'), Splash);
// const IntroNjnjaCash = createDynamicImport(() => import('@/pages/LandingPage/IntroducingNinjaCash'), Splash);
// const AboutNjnjaCash = createDynamicImport(() => import('@/pages/LandingPage/AboutNinjaCash'), Splash);
// const LandingPageMain = createDynamicImport(() => import('@/pages/LandingPage/Main'), Splash);
//
// const ProjectDetail = createDynamicImport(() => import('@/components/ProjectDetail'), Splash);
//
// import imgCash from '@/assets/images/landing/home/cash.jpg';
// import imgCashContent from '@/assets/images/landing/cash/fake-content.svg';
// import imgDadContent from '@/assets/images/landing/dad/fake-content.svg';
// // import imgBlockchainPrivacy from '@/assets/images/landing/home/blockchain-privacy.jpg';
// import imgDad from '@/assets/images/landing/home/dad.jpg';
// // import imgDao from '@/assets/images/landing/home/dao.jpg';
// import imgInternetCash from '@/assets/images/landing/home/internet-cash.jpg';
// import imgPrediction from '@/assets/images/landing/home/prediction.jpg';
// import imgWallet from '@/assets/images/landing/home/wallet.jpg';
// import imgWhisper from '@/assets/images/landing/home/whisper.jpg';
// import imgUncommons from '@/assets/images/landing/home/uncommons.jpg';
// const ProjectInternetCash = createDynamicImport(() => import('@/components/MobileOrTablet/ProjectInternetCash'), Splash);
// const ProjectCash = createDynamicImport(() => import('@/components/MobileOrTablet/ProjectCash'), Splash);
// const ProjectOddBall = createDynamicImport(() => import('@/components/MobileOrTablet/ProjectOddBall'), Splash);

class Root extends React.Component {
  // static propTypes = {
  //   app: PropTypes.object.isRequired,
  //   initApp: PropTypes.func.isRequired,
  // }

  // constructor(props) {
  //   super(props);
  //
  //   this.state = {
  //     rootLoading: this.props.app.rootLoading,
  //   };
  // }

  componentDidMount() {
    const querystring = window.location.search.replace('?', '');
    const querystringParsed = qs.parse(querystring);
    const { language, ref } = querystringParsed;
    this.props.initApp(language, ref);
  }

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   if (nextProps.app.rootLoading !== prevState.rootLoading) {
  //     return { rootLoading: nextProps.rootLoading };
  //   }
  //   return null;
  // }

  // preRender() {
  //   if (BrowserDetect.isBot) {
  //     return <LandingPageMain />;
  //   }
  //   if (BrowserDetect.isDesktop) {
  //     switch (window.location.pathname) {
  //       // case URL.HANDSHAKE_CASH:
  //       //   return <LandingPageCash />;
  //       case URL.PRODUCT_URL:
  //         return <LandingPageMain type="product" />;
  //       case URL.RESEARCH_URL:
  //         return <LandingPageMain type="research" />;
  //
  //       case URL.PRODUCT_CASH_URL:
  //         return <ProjectDetail name="cash" img={imgCash} imgContent={imgCashContent} />;
  //       case URL.PRODUCT_PREDICTION_URL:
  //         return <ProjectDetail name="prediction" img={imgPrediction} />;
  //       case URL.PRODUCT_WALLET_URL:
  //         return <ProjectDetail name="wallet" img={imgWallet} />;
  //       case URL.PRODUCT_HIVEPAY_OFFLINE_URL:
  //         return <ProjectDetail name="hivepay-offline" img={imgInternetCash} />;
  //       case URL.PRODUCT_HIVEPAY_ONLINE_URL:
  //         return <ProjectDetail name="hivepay-online" img={imgCash} />;
  //       case URL.RESEARCH_INTERNET_CASH_URL:
  //         return <ProjectDetail name="internet-cash" img={imgInternetCash} />;
  //       case URL.PRODUCT_DAD_URL:
  //         return <ProjectDetail name="dad" img={imgDad} imgContent={imgDadContent} />;
  //       case URL.RESEARCH_UNCOMMONS_URL:
  //         return <ProjectDetail name="uncommons" img={imgUncommons} />;
  //       case URL.PRODUCT_WHISPER_URL:
  //         return <ProjectDetail name="whisper" img={imgDad} />;
  //       default:
  //     }
  //     return <LandingPageMain />;
  //   }
  //   switch (window.location.pathname) {
  //     case URL.LANDING_PAGE_SHURIKEN:
  //       return <LandingPage />;
  //     case URL.WHITE_PAPER:
  //       return <LandingPageWhitePaper />;
  //     case URL.INTRODUCING_NINJA_CASH:
  //       return <IntroNjnjaCash />;
  //     case URL.ABOUT_NINJA_CASH:
  //       return <AboutNjnjaCash />;
  //     // case URL.PROJECT_CASH:
  //     //   return <ProjectCash />;
  //     // case URL.PROJECT_ODD_BALL:
  //     //   return <ProjectOddBall />;
  //     default:
  //       // code
  //   }
  //   return <Handle setLanguage={this.setLanguage} refer={this.refer} />;
  // }

  render() {
    if (this.props.app.rootLoading) return null;
    return (
      <I18n>
        <div className="root">
          <Handle setLanguage={this.setLanguage} refer={this.refer} />
        </div>
      </I18n>
    );
    // return (
    //   <I18n>
    //     <div className="root">
    //       {
    //         this.state.rootLoading
    //         ? <Splash />
    //         : null
    //       }
    //       {
    //         !this.state.rootLoading
    //         ? this.preRender()
    //         : null
    //       }
    //     </div>
    //   </I18n>
    // );
  }
}

export default connect(state => ({ app: state.app }), { initApp })(Root);
