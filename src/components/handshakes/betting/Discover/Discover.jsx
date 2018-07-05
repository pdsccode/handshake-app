import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import BlockCountry from '@/components/core/presentation/BlockCountry';
import Maintain from '@/components/core/presentation/Maintain';
import Prediction from '@/components/handshakes/betting/Discover/Prediction';
import FAQ from '@/components/handshakes/betting/Discover/FAQ';
import Share from '@/components/handshakes/betting/Discover/Share';

class DiscoverPrediction extends React.Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    firebaseApp: PropTypes.object.isRequired,
    setLoading: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      app: props.app,
    };
  }

  render() {
    if (this.state.app.isBannedPrediction) return <BlockCountry />;
    if (this.props.firebaseApp.config?.maintainChild?.betting) return <Maintain />;
    return (
      <div className="discover-tab-prediction">
        <Share className="discover-tab-prediction-share" />
        <Prediction setLoading={this.props.setLoading} />
        <FAQ className="discover-tab-prediction-faq" />
      </div>
    );
  }
}

export default connect(state => ({
  app: state.app,
  firebaseApp: state.firebase.data,
}))(DiscoverPrediction);
