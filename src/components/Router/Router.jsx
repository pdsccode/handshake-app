import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { Switch, BrowserRouter, Route, Redirect } from 'react-router-dom';
import DynamicImport from '@/components/App/DynamicImport';
import Loading from '@/components/core/presentation/Loading';
import { APP, FIREBASE_PATH, API_URL, URL } from '@/constants';

import local from '@/services/localStore';
import { setIpInfo, showAlert, changeLocale } from '@/reducers/app/action';
import { signUp, fetchProfile, authUpdate, getFreeETH } from '@/reducers/auth/action';

import ScrollToTop from '@/components/App/ScrollToTop';
import Layout from '@/components/Layout/Main';

import { addLocaleData, IntlProvider } from 'react-intl';
// languages
import en from 'react-intl/locale-data/en';
import fr from 'react-intl/locale-data/fr';
import zh from 'react-intl/locale-data/zh';
import de from 'react-intl/locale-data/de';
import ja from 'react-intl/locale-data/ja';
import ko from 'react-intl/locale-data/ko';
import ru from 'react-intl/locale-data/ru';
import es from 'react-intl/locale-data/es';

import { withFirebase } from 'react-redux-firebase';
import messages from '@/locals';
import COUNTRIES_BLACKLIST from '@/data/country-blacklist';
import axios from 'axios';
import { getUserProfile, getListOfferPrice } from '@/reducers/exchange/action';
import { MasterWallet } from '@/models/MasterWallet';
import { createMasterWallets } from '@/reducers/wallet/action';
import MobileOrTablet from '@/components/MobileOrTablet';
import BrowserDetect from '@/services/browser-detect';
import NetworkError from '@/components/Router/NetworkError';
import BlockCountry from '@/components/core/presentation/BlockCountry';
import qs from 'querystring';

addLocaleData([...en, ...fr, ...zh, ...de, ...ja, ...ko, ...ru, ...es ]);

const MeRootRouter = props => (
  <DynamicImport
    loading={Loading}
    load={() => import('@/components/Router/Me')}
  >
    {Component => <Component {...props} />}
  </DynamicImport>
);
const DiscoverRootRouter = props => (
  <DynamicImport
    loading={Loading}
    load={() => import('@/components/Router/Discover')}
  >
    {Component => <Component {...props} />}
  </DynamicImport>
);
const ChatRootRouter = props => (
  <DynamicImport
    loading={Loading}
    load={() => import('@/components/Router/Chat')}
  >
    {Component => <Component {...props} />}
  </DynamicImport>
);
const WalletRootRouter = props => (
  <DynamicImport
    loading={Loading}
    load={() => import('@/components/Router/Wallet')}
  >
    {Component => <Component {...props} />}
  </DynamicImport>
);
const CreateRootRouter = props => (
  <DynamicImport
    loading={Loading}
    load={() => import('@/components/Router/Create')}
  >
    {Component => <Component {...props} />}
  </DynamicImport>
);
const ExchangeRootRouter = props => (
  <DynamicImport
    loading={Loading}
    load={() => import('@/components/Router/Exchange')}
  >
    {Component => <Component {...props} />}
  </DynamicImport>
);
const TransactionRootRouter = props => (
  <DynamicImport
    loading={Loading}
    load={() => import('@/components/Router/Transaction')}
  >
    {Component => <Component {...props} />}
  </DynamicImport>
);
const CommentRootRouter = props => (
  <DynamicImport
    loading={Loading}
    load={() => import('@/components/Router/Comment')}
  >
    {Component => <Component {...props} />}
  </DynamicImport>
);
const LandingPageRootRouter = props => (
  <DynamicImport
    loading={Loading}
    load={() => import('@/components/Router/LandingPage')}
  >
    {Component => <Component {...props} />}
  </DynamicImport>
);
const LandingTradeRootRouter = props => (
  <DynamicImport
    loading={Loading}
    load={() => import('@/components/Router/LandingTrade')}
  >
    {Component => <Component {...props} />}
  </DynamicImport>
);
const FAQRootRouter = props => (
  <DynamicImport
    loading={Loading}
    load={() => import('@/components/Router/FAQ')}
  >
    {Component => <Component {...props} />}
  </DynamicImport>
);
const LiveStreamingRootRouter = props => (
  <DynamicImport
    loading={Loading}
    load={() => import('@/components/Router/LiveStreaming')}
  >
    {Component => <Component {...props} />}
  </DynamicImport>
);
const PredictionRootRouter = props => (
  <DynamicImport
    loading={Loading}
    load={() => import('@/components/Router/Prediction')}
  >
    {Component => <Component {...props} />}
  </DynamicImport>
);
const Page404 = props => (
  <DynamicImport
    isNotFound
    loading={Loading}
    load={() => import('@/pages/Error/Page404')}
  >
    {Component => <Component {...props} />}
  </DynamicImport>
);

class Router extends React.Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    signUp: PropTypes.func.isRequired,
    fetchProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    authUpdate: PropTypes.func.isRequired,
    setIpInfo: PropTypes.func.isRequired,
    getUserProfile: PropTypes.func.isRequired,
    firebase: PropTypes.object.isRequired,
    getListOfferPrice: PropTypes.func.isRequired,
    getFreeETH: PropTypes.func.isRequired,
    changeLocale: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    // State
    this.state = {
      currentLocale: 'en',
      isLoading: true,
      isLogged: this.props.auth.isLogged,
      profile: this.props.auth.profile,
      updatedAt: this.props.auth.updatedAt,
      loadingText: 'Loading application',
      isNetworkError: false,
      isCountryBlackList: false,
    };
  }

  render() {
    return (
      <IntlProvider
        locale={this.state.currentLocale}
        messages={messages[this.state.currentLocale]}
      >
        <BrowserRouter>
          <Route
            path={URL.INDEX}
            render={props =>
              (
                <ScrollToTop>
                  <Switch>
                    {
                      window.location.hostname !== 'ninjaprediction.org' ? (
                        [
                          <Route
                            exact
                            path={URL.INDEX}
                            render={() => (
                              <Redirect to={{pathname: URL.LIVE_STREAMING}}/>
                            )}
                            key={0}
                          />,
                          <Route path={URL.LIVE_STREAMING} component={LiveStreamingRootRouter} key={1} />
                        ]
                      ) : (
                        <Route exact path={URL.INDEX} component={PredictionRootRouter} />
                      )
                    }
                    <Route component={Page404} />
                  </Switch>
                </ScrollToTop>
              )
            }
          />
        </BrowserRouter>
      </IntlProvider>
    );
  }
}

export default compose(
  withFirebase,
  connect(state => ({ auth: state.auth, app: state.app }), {
    signUp,
    fetchProfile,
    setIpInfo,
    getUserProfile,
    authUpdate,
    getListOfferPrice,
    getFreeETH,
    showAlert,
    changeLocale,
  }),
)(Router);
