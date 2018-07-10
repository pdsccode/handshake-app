import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import DynamicImport from '@/components/App/DynamicImport';
import Loading from '@/components/core/presentation/Loading';
import { URL } from '@/constants';
import { setHeaderTitle, clearHeaderRight, clearHeaderLeft, showHeader } from '@/reducers/app/action';

const LuckyPool = props => (<DynamicImport loading={Loading} load={() => import('@/pages/LuckyLanding/LuckyLanding')}>{Component => <Component {...props} />}</DynamicImport>);

const routerMap = [
  { path: URL.LUCKY_POOL, component: LuckyPool },
];

class LuckyPoolRouter extends React.Component {

  render() {
    return (
      <Switch>
        {routerMap.map(route => <Route key={route.path} exact path={route.path} component={route.component} />)}
      </Switch>
    );
  }
}

export default connect(null, ({
  setHeaderTitle, clearHeaderRight, clearHeaderLeft, showHeader,
}))(LuckyPoolRouter);
