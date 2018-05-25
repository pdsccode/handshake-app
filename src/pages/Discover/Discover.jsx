import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// service, constant
import { load } from '@/reducers/discover/action';
// components
import { Grid, Row, Col } from 'react-bootstrap';
import Button from '@/components/core/controls/Button';
import Feed from '@/components/core/presentation/Feed';
import Category from '@/components/core/controls/Category';
import { handShakeList } from '@/data/shake.js';
import { exchangeList } from '@/data/exchange.js';
// style
import './Discover.scss';
import ExchangeFeed from "../Exchange/Feed/ExchangeFeed";


class Dashboard extends React.Component {
  constructor(props) {
    super(props);
  }

  renderItem = (handshake) => {
    let result = null;
    switch (handshake.industries_type) {
      case 5: {
        result = (
          <Col md={12} xs={12} key={handshake.id} className="feed-wrapper">
            <Feed className="feed">
              <ExchangeFeed handShake={handshake}/>
            </Feed>
            <Button block>Shake now</Button>
          </Col>
        );
        break;
      }
      default: {
        result = '';
      }
    }

    return result;
  }

  get feedHtml() {
    return exchangeList.data.map(handshake => this.renderItem(handshake));
  }

  render() {
    return (
      <Grid>
        <Row>
          <Category className="category-wrapper" />
        </Row>
        <Row>
          {this.feedHtml}
        </Row>
      </Grid>
    );
  }
}

Dashboard.propTypes = {
  discover: PropTypes.object,
  load: PropTypes.func
};

const mapState = (state) => ({
  discover: state.discover,
});

const mapDispatch = ({
  load
});

export default connect(mapState, mapDispatch)(Dashboard);
