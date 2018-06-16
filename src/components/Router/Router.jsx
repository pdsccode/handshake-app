import React from 'react';
import { Switch, BrowserRouter, Route, Redirect } from 'react-router-dom';
// constants
import { URL } from '@/constants';
// services
import { createDynamicImport } from '@/services/app';
// components
import Loading from '@/components/core/presentation/Loading';
import ScrollToTop from '@/components/App/ScrollToTop';
import Layout from '@/components/Layout/Main';

const RouterMe = createDynamicImport(() => import('@/components/Router/Me'), Loading);
const RouterDiscover = createDynamicImport(() => import('@/components/Router/Discover'), Loading);
const RouterChat = createDynamicImport(() => import('@/components/Router/Chat'), Loading);
const RouterCreate = createDynamicImport(() => import('@/components/Router/Create'), Loading);
const RouterWallet = createDynamicImport(() => import('@/components/Router/Wallet'), Loading);
const RouterExchange = createDynamicImport(() => import('@/components/Router/Exchange'), Loading);
const RouterTransaction = createDynamicImport(() => import('@/components/Router/Transaction'), Loading);
const RouterComment = createDynamicImport(() => import('@/components/Router/Comment'), Loading);

const rootRouterMap = [
  { path: URL.HANDSHAKE_ME, component: RouterMe },
  { path: URL.HANDSHAKE_DISCOVER, component: RouterDiscover },
  { path: URL.HANDSHAKE_CHAT, component: RouterChat },
  { path: URL.HANDSHAKE_WALLET, component: RouterWallet },
  { path: URL.HANDSHAKE_CREATE, component: RouterCreate },
  { path: URL.HANDSHAKE_EXCHANGE, component: RouterExchange },
  { path: URL.TRANSACTION_LIST, component: RouterTransaction },
  { path: URL.COMMENTS_BY_SHAKE, component: RouterComment },
];

const Page404 = createDynamicImport(() => import('@/pages/Error/Page404'), Loading, true);

class Router extends React.Component {
  routers() {
    return rootRouterMap.map(router => (
      <Route
        key={router.path}
        path={router.path}
        component={router.component}
      />
    ));
  }

  render() {
    console.log(this.state);
    return (
      <BrowserRouter>
        <Route
          path={URL.INDEX}
          render={props =>
            (
              <Layout {...props}>
                <ScrollToTop>
                  <Switch>
                    <Route
                      exact
                      path={URL.INDEX}
                      render={() => (
                        <Redirect to={{ pathname: URL.HANDSHAKE_DISCOVER }} />
                      )}
                    />
                    {this.routers()}
                    <Route component={Page404} />
                  </Switch>
                </ScrollToTop>
              </Layout>
            )
          }
        />
      </BrowserRouter>
    );
  }
}

export default Router;
