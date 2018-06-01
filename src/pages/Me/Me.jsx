import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// action, mock
import { loadMyHandshakeList } from '@/reducers/me/action';
import { API_URL, HANDSHAKE_STATUS_NAME, HANDSHAKE_ID } from '@/constants';
// componentimport
import { Grid, Row, Col } from 'react-bootstrap';
import NoData from '@/components/core/presentation/NoData';
import FeedPromise from '@/components/handshakes/promise/Feed';
import FeedBetting from '@/components/handshakes/betting/Feed';
import FeedExchange from '@/components/handshakes/exchange/Feed/FeedExchange';
import FeedSeed from '@/components/handshakes/seed/Feed';
// style
import './Me.scss';


const maps = {
  [HANDSHAKE_ID.PROMISE]: FeedPromise,
  [HANDSHAKE_ID.BETTING]: FeedBetting,
  [HANDSHAKE_ID.EXCHANGE]: FeedExchange,
  [HANDSHAKE_ID.SEED]: FeedSeed,
};

class Me extends React.Component {

  componentDidMount() {
    this.props.loadMyHandshakeList({ PATH_URL: API_URL.ME.BASE });
  }

  render() {
    const { list } = this.props.me;
    return (
      <Grid>
        <Row>
          <Col md={12}>
            {
              list && list.length > 0 ? (
                list.map((handshake) => {
                  const FeedComponent = maps[handshake.type];
                  if (FeedComponent) {
                    return (
                      <Col key={handshake.id} md={12} className="feed-wrapper">
                        <FeedComponent {...handshake} {...this.props} onFeedClick={() => this.clickFeedDetail(handshake.id)} mode={'me'} />
                      </Col>
                    );
                  }
                })
              ) : (
                <NoData />
              )
            }
          </Col>
        </Row>
      </Grid>
    );
  }
}

Me.propTypes = {
  me: PropTypes.object.isRequired,
  loadMyHandshakeList: PropTypes.func.isRequired,
};

const mapState = state => ({
  me: state.me,
});

const mapDispatch = ({
  loadMyHandshakeList,
});

export default connect(mapState, mapDispatch)(Me);
