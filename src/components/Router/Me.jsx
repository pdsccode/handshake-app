import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import DynamicImport from '@/components/App/DynamicImport';
import Loading from '@/pages/Loading';
import { URL } from '@/config';

const Me = (props) => (<DynamicImport loading={Loading} load={() => import('@/pages/Me/Me')}>{(Component) => <Component {...props} />}</DynamicImport>);
const Page404 = (props) => (<DynamicImport loading={Loading} load={() => import('@/pages/Error/Page404')}>{(Component) => <Component {...props} />}</DynamicImport>);

const routerMap = [
  { path: URL.HANDSHAKE_ME_INDEX, component: Me },
];

class MeRouter extends React.Component {
  static propTypes = {
    location: PropTypes.object,
  }

  constructor(props) {
    super(props);
  }

  render() {
    if (routerMap.filter((route) => route.path === this.props?.location?.pathname).length) {
      return (
        <Switch>
          {routerMap.map((route) => <Route key={route.path} exact path={route.path} component={route.component} />)}
        </Switch>
      );
    } else {
      return <Page404 />;
    }
  }
}

export default MeRouter;
