import React from 'react';
import PropTypes from 'prop-types';
// components
import MainHeader from '@/components/Header/MainHeader';
import Navigation from '@/components/core/controls/Navigation/Navigation';
import Alert from '@/components/core/presentation/Alert';
import Loading from '@/components/core/controls/Loading';

class MainLayout extends React.Component {
  static propTypes = {
    children: PropTypes.any.isRequired,
    location: PropTypes.object.isRequired,
  }

  render() {
    return (
      <div className="app">
        <MainHeader />
        <div className="content">
          {this.props.children}
        </div>
        <Navigation location={this.props.location} />
        <Alert />
        <Loading />
      </div>
    );
  }
}

export default MainLayout;
