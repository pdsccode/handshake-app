import React from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl'
// import PropTypes from 'prop-types';

class Recruiting extends React.Component {
  render() {
    return (
      <div>
        Ahihi
      </div>
    );
  }
}

const mapState = state => ({});

const mapDispatch = dispatch => ({
  // rfChange: bindActionCreators(change, dispatch),
});

export default injectIntl(connect(mapState, mapDispatch)(Recruiting));
