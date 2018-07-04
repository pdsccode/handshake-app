import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ShareSocial from '@/components/core/presentation/ShareSocial';

class DiscoverPredictionShare extends React.Component {
  static propTypes = {
    className: PropTypes.string.isRequired,
  }


  render() {
    return (
      <div className={this.props.className}>
        <p className="text">Share to get 20 free coins</p>
        <ShareSocial
          className="share"
          title=""
          shareUrl=""
        />
      </div>
    );
  }
}

export default DiscoverPredictionShare;
