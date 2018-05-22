import React from 'react';
import PropTypes from 'prop-types';
import Header from '@/components/Header/Header';
import Navigation from '@/components/Footer/Navigation';

class MainLayout extends React.Component {
  static propTypes = {
    children: PropTypes.any.isRequired,
    location: PropTypes.object,
    history: PropTypes.object,
  }

  render() {
    const { location, history } = this.props;
    return (
      <div className="app">
        <Header />
        <div className="content">
          {this.props.children}
        </div>
        <Navigation location={location} history={history} />
      </div>
    );
  }
}

export default MainLayout;
