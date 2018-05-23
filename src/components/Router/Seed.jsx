import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Switch, Route } from 'react-router-dom';
import DynamicImport from '@/components/App/DynamicImport';
import Loading from '@/pages/Loading';
import { URL } from '@/config';
import { setHeaderTitle } from '@/reducers/app/action';

const Seed = (props) => (<DynamicImport loading={Loading} load={() => import('@/pages/Seed/Seed')}>{(Component) => <Component {...props} />}</DynamicImport>);
const SeedDetail = (props) => (<DynamicImport loading={Loading} load={() => import('@/pages/Seed/SeedDetail')}>{(Component) => <Component {...props} />}</DynamicImport>);
const Page404 = (props) => (<DynamicImport loading={Loading} load={() => import('@/pages/Error/Page404')}>{(Component) => <Component {...props} />}</DynamicImport>);

const routerMap = [
  { path: URL.HANDSHAKE_SEED_INDEX, component: Seed },
  { path: URL.HANDSHAKE_SEED_DETAIL, component: SeedDetail },
];

class SeedRouter extends React.Component {
  static propTypes = {
    setHeaderTitle: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.props.setHeaderTitle('Seed');
  }

  render() {
    return (
      <Switch>
        {routerMap.map((route) => <Route key={route.path} exact path={route.path} component={route.component}/>)}
        <Page404/>
      </Switch>
    );
  }
}

export default connect(null, ({ setHeaderTitle }))(SeedRouter);
