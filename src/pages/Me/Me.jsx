import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// action, mock
import { loadMyHandshakeList } from '@/reducers/me/action';
import { API_URL, HANDSHAKE_STATUS_NAME } from '@/constants';
// componentimport
import { Grid, Row, Col } from 'react-bootstrap';
import Feed from '@/components/core/presentation/Feed';
import NoData from '@/components/core/presentation/NoData';
import './Me.scss';
import {HANDSHAKE_ID} from "../../constants";
import FeedPromise from '@/components/handshakes/promise/Feed';
import FeedBetting from '@/components/handshakes/betting/Feed';
import FeedExchange from '@/components/handshakes/exchange/Feed/FeedExchange';
import FeedSeed from '@/components/handshakes/seed/Feed';


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
                        <FeedComponent {...handshake} {...this.props} onFeedClick={() => this.clickFeedDetail(handshake.id)} mode={'me'}/>
                      </Col>
                    );
                  }
                //   return (
                //   <div className="my-feed-wrapper" key={handshake.id} onClick={() => alert('show detail')}>
                //     <div className="head">
                //       <div className="from"><span className="email">From:</span>&nbsp;{handshake.fromEmail}</div>
                //       <div className="status">{HANDSHAKE_STATUS_NAME[handshake.status || -1]}</div>
                //     </div>
                //     <Feed className="my-feed">
                //       <p className="description">{handshake.description}</p>
                //     </Feed>
                //   </div>
                // )
                })
              ) : (
                <NoData message="NO DATA AVAILABLE" />
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
