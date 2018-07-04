import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Col, Row } from 'react-bootstrap';

import BlockCountry from '@/components/core/presentation/BlockCountry';
import Maintain from '@/components/core/presentation/Maintain';
import BettingFilter from '@/components/handshakes/betting/Feed/Filter';
import FAQBetting from '@/components/core/presentation/FAQBetting';

class DiscoverBetting extends React.Component {
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
      <React.Fragment>
        <BettingFilter setLoading={this.props.setLoading} />
        <Row>
          <Col md={12} className="faq-block">
            <FAQBetting />
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default connect(state => ({
  app: state.app,
  firebaseApp: state.firebase.data,
}))(DiscoverBetting);
