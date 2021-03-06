import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';
// constants
import { URL, LANDING_PAGE_TYPE } from '@/constants';
// services
import BrowserDetect from '@/services/browser-detect';
import { createDynamicImport } from '@/services/app';
// components
import Loading from '@/components/core/presentation/Loading';
import ScrollToTop from '@/components/App/ScrollToTop';
import Layout from '@/components/Layout/Main';
import { SEOPrediction, SEODad, SEOWallet, SEOPayForDevs, SEOPayForStores, SEOBecomeAtm } from '@/components/SEO';

import imgDadContent from '@/assets/images/landing/dad/fake-content.jpg';
import imgDad from '@/assets/images/landing/home/dad.jpg';
import imgInternetCash from '@/assets/images/landing/home/internet-cash.jpg';
import imgPrediction from '@/assets/images/landing/home/prediction.jpg';
import imgWallet from '@/assets/images/landing/home/wallet.jpg';
import imgUncommons from '@/assets/images/landing/home/uncommons.jpg';
import imgHivepayOffline from '@/assets/images/landing/home/hivepay-offline.jpg';

import Maintain from '@/components/Router/Maintain';
import PexExtension from '@/pages/PexExtension/PexExtension';
import TopUp from '@/pages/TopUp/TopUp';

const RouterMe = createDynamicImport(() => import('@/components/Router/Me'), Loading);
const RouterWallet = createDynamicImport(() => import('@/components/Router/Wallet'), Loading);
const RouterPaymentTransfer = createDynamicImport(() => import('@/components/Router/PaymentTransfer'), Loading);
const RouterPayment = createDynamicImport(() => import('@/components/Router/Payment'), Loading);
const RouterComment = createDynamicImport(() => import('@/components/Router/Comment'), Loading);
const RouterAdmin = createDynamicImport(() => import('@/components/Router/Admin'), Loading);
const RouterAdminIDVerification = createDynamicImport(() => import('@/components/Router/AdminIDVerification'), Loading);
const RouterReport = createDynamicImport(() => import('@/components/Router/Report'), Loading);
const RouterLuckyPool = createDynamicImport(() => import('@/pages/LuckyLanding/LuckyLanding'), Loading);
const RouterExchange = createDynamicImport(() => import('@/components/Router/Exchange'), Loading);
const CreateOwnMarket = createDynamicImport(() => import('@/pages/CreateMarket/CreateMarket'), Loading);
// const RouterExchange = createDynamicImport(() => import('@/pages/Exchange/Exchange'), Loading);
const RouterPrediction = createDynamicImport(() => import('@/pages/Prediction/Prediction'), Loading);
const RouterResolve = createDynamicImport(() => import('@/pages/Resolve/Resolve'), Loading);
const RouterLandingPageMain = createDynamicImport(() => import('@/pages/LandingPage/Main'), Loading);
const LandingPageMain = createDynamicImport(() => import('@/pages/LandingPage/Main'), Loading);
const ProjectDetail = createDynamicImport(() => import('@/components/ProjectDetail'), Loading);
const Recruiting = createDynamicImport(() => import('@/pages/Recruiting'), Loading);
const JobDetail = createDynamicImport(() => import('@/pages/Recruiting/JobDetail'), Loading);
const ContentForPayForDevs = createDynamicImport(() => import('@/pages/LandingPage/ContentForPayForDevs'), Loading);
const ContentForPayForDevsGetStarted = createDynamicImport(() => import('@/pages/LandingPage/ContentForPayForDevsGetStarted'), Loading);
const ContentForWallet = createDynamicImport(() => import('@/pages/LandingPage/ContentForWallet'), Loading);
const ContentForPrediction = createDynamicImport(() => import('@/pages/LandingPage/ContentForPrediction'), Loading);
const ContentForPexInstruction = createDynamicImport(() => import('@/pages/LandingPage/ContentForPexInstruction'), Loading);
const LuckyDrawMechanic = createDynamicImport(() => import('@/pages/LuckyDrawMechanic/LuckyDrawMechanic'), Loading);
const RouterBuyCryptoCoin = createDynamicImport(() => import('@/components/Router/BuyCryptoCoin'), Loading);
const RouterEscrowWithdrawSuccess = createDynamicImport(() => import('@/pages/Escrow/WithdrawSuccess'), Loading);
const RouterShop = createDynamicImport(() => import('@/components/Router/Shop'), Loading);
const RouterInternalAdmin = createDynamicImport(() => import('@/components/Router/InternalAdmin'), Loading);
const RouterCreateCashStore = createDynamicImport(() => import('@/components/handshakes/exchange/Create/CreateStoreATM'), Loading);
const LandingBecomeAtm = createDynamicImport(() => import('@/pages/LandingPage/BecomeAtm'), Loading);
const LandingConstant = createDynamicImport(() => import('@/pages/LandingPage/Constant/Constant'), Loading);
const InternalAdminDashboard = createDynamicImport(() => import('@/pages/InternalAdminDashboard'), Loading);

/* ======================== FOR MOBILE ======================== */
const configRoutesUsingMobileLayout = [
  { path: URL.HANDSHAKE_PREDICTION, component: RouterPrediction },
  { path: URL.HANDSHAKE_PEX, component: RouterExchange },
  { path: URL.HANDSHAKE_PEX_UPDATER, component: CreateOwnMarket },
  { path: URL.PEX_INSTRUCTION_URL, component: ContentForPexInstruction },

  { path: URL.HANDSHAKE_ME, component: RouterMe },
  { path: URL.HANDSHAKE_CASH, render: () => <Redirect to={{ pathname: URL.BUY_COIN_URL }} /> },
  { path: URL.HANDSHAKE_ATM, render: () => <Redirect to={{ pathname: URL.BUY_COIN_URL }} /> },
  { path: URL.HANDSHAKE_WALLET, component: RouterWallet },
  { path: URL.HANDSHAKE_PAYMENT_TRANSFER, component: RouterPaymentTransfer },
  { path: URL.HANDSHAKE_PAYMENT, component: RouterPayment },
  // { path: URL.HANDSHAKE_CREATE, component: RouterCreate },
  { path: URL.COMMENTS_BY_SHAKE, component: RouterComment },
  { path: URL.ADMIN, component: RouterAdmin },
  { path: URL.REPORT, component: RouterReport },
  // { path: URL.CC_PAYMENT_URL, component: RouterCCConfirm },
  // { path: URL.BUY_BY_CC_URL, component: RouterBuyCC },
  { path: URL.BUY_COIN_URL, component: RouterBuyCryptoCoin },

  { path: URL.ESCROW_WITHDRAW_SUCCESS, component: RouterEscrowWithdrawSuccess },
  {
    path: URL.PRODUCT_DAD_URL,
    render: () => {
      window.location.href = URL.PRODUCT_DAD_URL_SUBDOMAIN;
      return null;
    },
  },
  { path: URL.RESOLVE, component: RouterResolve },
  { path: URL.SHOP_URL, component: RouterShop },
  { path: URL.CASH_STORE_URL, component: RouterCreateCashStore },

  { path: URL.LANDING_BECOME_ATM, render: () => <LandingBecomeAtm reactHelmetElement={SEOBecomeAtm} /> },
  { path: URL.LANDING_PAGE_CONSTANT, render: () => <LandingConstant /> },
  { path: URL.LANDING_PAGE_SHURIKEN, render: () => <Redirect to={URL.LANDING_PAGE_CONSTANT} /> },
  { path: URL.PEX_EXTENSION, component: PexExtension },
  { path: URL.WALLET_EXTENSION, component: TopUp },
];
const routesUsingMobileLayout = configRoutesUsingMobileLayout.map(route => (
  <Route
    key={Date.now()}
    {...route}
  />
));


/* ======================== FOR DESKTOP ======================== */
const PageMobileOnly = createDynamicImport(() => import('@/pages/Error/MobileOnly'), Loading, true);

let routesUsingDesktopLayout = null;
if (BrowserDetect.isDesktop) {
  const configRoutesUsingDesktopLayout = [
    { path: URL.LUCKY_POOL, component: RouterLuckyPool },
    { path: URL.PRODUCT_CASH_URL, render: () => <Redirect to={{ pathname: URL.BUY_COIN_URL }} />, exact: true },
    { path: URL.PRODUCT_ATM_URL, render: () => <Redirect to={{ pathname: URL.BUY_COIN_URL }} /> },
    // { path: URL.BUY_BY_CC_URL, render: () => <ProjectDetail type="product" name="cash" img={imgCash} imgContent={imgCashContent} reactHelmetElement={SEOCash} /> },
    { path: URL.PRODUCT_PREDICTION_URL, render: () => <ProjectDetail type="product" name="prediction" img={imgPrediction} entireContentComponent={<ContentForPrediction />} reactHelmetElement={SEOPrediction} /> },
    { path: URL.HANDSHAKE_PEX, render: () => <ProjectDetail type="product" name="prediction" img={imgPrediction} entireContentComponent={<ContentForPrediction />} reactHelmetElement={SEOPrediction} /> },
    { path: URL.PRODUCT_WALLET_URL, render: () => <ProjectDetail type="product" name="wallet" img={imgWallet} reactHelmetElement={SEOWallet} entireContentComponent={<ContentForWallet />} /> },
    { path: URL.PEX_EXTENSION, render: () => <PexExtension reactHelmetElement={SEOPrediction} /> },
    { path: URL.HANDSHAKE_PEX_CREATOR, render: () => <ProjectDetail type="product" name="wallet" img={imgWallet} reactHelmetElement={SEOWallet} entireContentComponent={<PageMobileOnly />} /> },
    { path: URL.HANDSHAKE_EXCHANGE, render: () => <ProjectDetail type="product" name="prediction" img={imgPrediction} entireContentComponent={<ContentForPrediction />} reactHelmetElement={SEOPrediction} /> },
    { path: URL.PRODUCT_PAYFORSTORES_URL, render: () => <ProjectDetail type="product" name="pay-for-stores" img={imgHivepayOffline} reactHelmetElement={SEOPayForStores} /> },
    { path: URL.PRODUCT_PAYFORDEVS_URL, render: () => <ProjectDetail type="product" name="pay-for-devs" reactHelmetElement={SEOPayForDevs} entireContentComponent={<ContentForPayForDevs />} /> },
    { path: URL.PRODUCT_PAYFORDEVS_GETSTARTED_URL, render: () => <ProjectDetail type="product" name="pay-for-devs-get-started" reactHelmetElement={SEOPayForDevs} fullWidthContent={true} entireContentComponent={<ContentForPayForDevsGetStarted />} /> },
    { path: URL.RESEARCH_INTERNET_CASH_URL, render: () => <ProjectDetail type="research" name="internet-cash" img={imgInternetCash} /> },
    { path: URL.PRODUCT_DAD_URL, render: () => <ProjectDetail type="product" name="dad" img={imgDad} imgContent={imgDadContent} reactHelmetElement={SEODad} /> },
    { path: URL.RESEARCH_UNCOMMONS_URL, render: () => <ProjectDetail type="research" name="uncommons" img={imgUncommons} /> },
    // { path: URL.INTERNAL_WITHDRAW_URL, component: RouterInternalWithdraw },
    { path: URL.INTERNAL_ADMIN_URL, component: RouterInternalAdmin },
    { path: URL.ADMIN_ID_VERIFICATION, component: RouterAdminIDVerification },
    { path: URL.PEX_LUCKY_DRAW_MECHANIC_URL, component: LuckyDrawMechanic },
    { path: URL.INTERNAL_ADMIN_DASHBOARD_URL, component: InternalAdminDashboard },
  ];

  routesUsingDesktopLayout = configRoutesUsingDesktopLayout.map(route => (
    <Route
      key={Date.now()}
      {...route}
    />
  ));
}

const Page404 = createDynamicImport(() => import('@/pages/Error/Page404'), Loading, true);

class Router extends React.Component {
  static propTypes = {
    firebaseApp: PropTypes.object.isRequired,
  }
  constructor(props) {
    super(props);

    const initFirebaseApp = this.props.firebaseApp;
    if (!initFirebaseApp.config) initFirebaseApp.config = {};

    this.state = {
      firebaseApp: initFirebaseApp,
    };

  }
  componentDidMount() {
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.firebaseApp.config) {
      if (nextProps.firebaseApp.config.isMaintain !== prevState.firebaseApp.config.isMaintain) {
        return { firebaseApp: nextProps.firebaseApp };
      }
      if (nextProps.firebaseApp.config.version !== prevState.firebaseApp.config.version) {
        window.location.reload();
      }
    }
    return null;
  }

  render() {
    return (
      <Switch>
        {
          BrowserDetect.isDesktop && <Route exact path={URL.INDEX} component={RouterLandingPageMain} />
        }

        <Route path={LANDING_PAGE_TYPE.product.url} render={() => <LandingPageMain type="product" />} />
        <Route path={LANDING_PAGE_TYPE.research.url} render={() => <LandingPageMain type="research" />} />
        <Route exact path={URL.RECRUITING} component={Recruiting} />
        <Route path={URL.RECRUITING_JOB_DETAIL} component={JobDetail} />
        <Route path={URL.PEX_INSTRUCTION_URL} render={() => <ProjectDetail type="landing" name="pex-instruction" entireContentComponent={<ContentForPexInstruction />} />} />
        <Route path={URL.PEX_LUCKY_DRAW_MECHANIC_URL} render={() => <ProjectDetail type="landing" name="pex-instruction" entireContentComponent={<LuckyDrawMechanic />} />} />
        <Route path={URL.BUY_COIN_FAQ_URL} render={() => <ProjectDetail type="product" name="coin" />} />
        {routesUsingDesktopLayout}

        {/* Cash on mobile uses a completely different layout! */}
        {/* <Route path={URL.HANDSHAKE_CASH} component={Discover} /> */}
        <Route
          path={URL.INDEX}
          render={props => {
            return (
              <Layout {...props}>
                {
                  this.state.firebaseApp.config.isMaintain
                    ? <Maintain />
                    : (
                      <ScrollToTop>
                        <Switch>
                          <Route exact path={URL.INDEX} render={() => {
                            return <Redirect to={{ pathname: URL.PRODUCT_PREDICTION_URL }} />
                          }}
                          />
                          {/*<Route*/}
                          {/*exact*/}
                          {/*path={URL.INDEX}*/}
                          {/*render={() => {*/}
                          {/*if (process.env.isDojo) {*/}
                          {/*return <Redirect to={{ pathname: URL.HANDSHAKE_CASH }} />*/}
                          {/*}*/}
                          {/*return <Redirect to={{ pathname: URL.HANDSHAKE_PREDICTION }} />*/}
                          {/*}}*/}
                          {/*/>*/}
                          {routesUsingMobileLayout}
                          <Route component={Page404} />
                        </Switch>
                      </ScrollToTop>
                    )
                }
              </Layout>
            )
          }}
        />
      </Switch>
    );
  }
}

export default connect(state => ({
  firebaseApp: state.firebase.data,
  router: state.router,
}))(Router);
