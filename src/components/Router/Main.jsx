import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';
import Layout from '@/components/Layout/Main';
import DynamicImport from '@/components/App/DynamicImport';
import Loading from '@/pages/Loading';
import { URL } from '@/config';

const Me = (props) => (<DynamicImport loading={Loading} load={() => import('@/pages/Discover')}>{(Component) => <Component {...props} />}</DynamicImport>);
const Discover = (props) => (<DynamicImport loading={Loading} load={() => import('@/pages/Discover')}>{(Component) => <Component {...props} />}</DynamicImport>);
const Chat = (props) => (<DynamicImport loading={Loading} load={() => import('@/pages/Discover')}>{(Component) => <Component {...props} />}</DynamicImport>);
const Wallet = (props) => (<DynamicImport loading={Loading} load={() => import('@/pages/Discover')}>{(Component) => <Component {...props} />}</DynamicImport>);
const Create = (props) => (<DynamicImport loading={Loading} load={() => import('@/pages/Discover')}>{(Component) => <Component {...props} />}</DynamicImport>);
const Exchange = (props) => (<DynamicImport loading={Loading} load={() => import('@/pages/Discover')}>{(Component) => <Component {...props} />}</DynamicImport>);
const Page404 = (props) => (<DynamicImport loading={Loading} load={() => import('@/pages/Error/Page404')}>{(Component) => <Component {...props} />}</DynamicImport>);

const routerMap = [
  { path: URL.HANDSHAKE_ME, component: Me },
  { path: URL.HANDSHAKE_DISCOVER, component: Discover },
  { path: URL.HANDSHAKE_CHAT, component: Chat },
  { path: URL.HANDSHAKE_WALLET, component: Wallet },
  { path: URL.HANDSHAKE_CREATE, component: Create },
  { path: URL.HANDSHAKE_EXCHANGE, component: Exchange },
];

class Router extends React.Component {
  static propTypes = {
    location: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.Layout = Layout;
  }

  render() {
    const Layout = this.Layout;
    if (routerMap.filter((route) => route.path === this.props?.location?.pathname).length) {
      return (
        <Layout {...this.props}>
          <Switch>
            {routerMap.map((route) => <Route key={route.path} exact path={route.path} component={route.component} />)}
          </Switch>
        </Layout>
      );
    } else {
      if (this.props?.location?.pathname == '/') {
        return <Redirect to={{ pathname: URL.HANDSHAKE_DISCOVER }} />;
      }
      return <Page404 />;
    }
  }
}

export default Router;
