import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// action, mock
import { fireBaseExchangeDataChange, loadMyHandshakeList, fireBaseBettingChange } from '@/reducers/me/action';
import { API_URL, HANDSHAKE_ID, URL } from '@/constants';
// components
import { Link } from 'react-router-dom';
import { Grid, Row, Col } from 'react-bootstrap';
import NoData from '@/components/core/presentation/NoData';
import { getListOfferPrice } from '@/reducers/exchange/action';
import FeedPromise from '@/components/handshakes/promise/Feed';
import FeedBetting from '@/components/handshakes/betting/Feed';
import FeedExchange from '@/components/handshakes/exchange/Feed/FeedMe';
import FeedSeed from '@/components/handshakes/seed/Feed';
import Image from '@/components/core/presentation/Image';

import ToggleSwitch from '@/components/core/presentation/ToggleSwitch';

// style
import AvatarSVG from '@/assets/images/icon/avatar.svg';
import ShopSVG from '@/assets/images/icon/icons8-shop_filled.svg';
import ExpandArrowSVG from '@/assets/images/icon/expand-arrow.svg';
import './Me.scss';

const maps = {
  [HANDSHAKE_ID.PROMISE]: FeedPromise,
  [HANDSHAKE_ID.BETTING]: FeedBetting,
  [HANDSHAKE_ID.EXCHANGE]: FeedExchange,
  [HANDSHAKE_ID.SEED]: FeedSeed,
};

class Me extends React.Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    me: PropTypes.object.isRequired,
    loadMyHandshakeList: PropTypes.func.isRequired,
    getListOfferPrice: PropTypes.func.isRequired,
    firebaseUser: PropTypes.any.isRequired,
    history: PropTypes.object.isRequired,
    fireBaseExchangeDataChange: PropTypes.func.isRequired,
    fireBaseBettingChange: PropTypes.func.isRequired,
    exchange: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      exchange: this.props.exchange,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.exchange.listOfferPrice.updatedAt !== prevState.exchange.listOfferPrice.updatedAt) {
      nextProps.loadMyHandshakeList({ PATH_URL: API_URL.ME.BASE });
      return { exchange: nextProps.exchange };
    }
    return null;
  }

  componentDidMount() {
    this.loadMyHandshakeList();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.firebaseUser) {
      if (JSON.stringify(nextProps.firebaseUser) !== JSON.stringify(this.props.firebaseUser)) {
        const nextUser = nextProps.firebaseUser.users?.[this.props.auth?.profile?.id];
        const prevUser = this.props?.firebaseUser.users?.[this.props.auth?.profile?.id];
        if (JSON.stringify(nextUser?.offers) !== JSON.stringify(prevUser?.offers)) {
          this.props.fireBaseExchangeDataChange(nextUser?.offers);
        } else if (nextUser?.betting && JSON.stringify(nextUser?.betting) !== JSON.stringify(prevUser?.betting)) {
          this.props.fireBaseBettingChange(nextUser?.betting);
        }
      }
    }
  }

  loadMyHandshakeList = () => {
    this.props.loadMyHandshakeList({ PATH_URL: API_URL.ME.BASE });
  }

  render() {
    const { list } = this.props.me;
    return (
      <Grid className="me">
        <Row>
          <Col md={12}>
            <Link className="update-profile" to={URL.HANDSHAKE_ME_PROFILE} title="profile">
              <Image className="avatar" src={AvatarSVG} alt="avatar" />
              <div className="text">
                <strong>The face behind the mask</strong>
                <p>You, glorious you</p>
              </div>
              <div className="arrow">
                <Image src={ExpandArrowSVG} alt="arrow" />
              </div>
            </Link>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <div className="update-profile pt-2">
              <Image className="avatar" src={ShopSVG} alt="shop" />
              <div className="text" style={{ width: '69%'}}>
                <strong>Your station</strong>
                <p>Open for business</p>
              </div>
              <div className="arrow">
                <ToggleSwitch onChange={flag => console.log(flag)} />
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            {
              list && list.length > 0 ? (
                list.map((handshake) => {
                  const FeedComponent = maps[handshake.type];
                  if (FeedComponent) {
                    return (
                      <Col key={handshake.id} className="feed-wrapper">
                        <FeedComponent
                          {...handshake}
                          history={this.props.history}
                          onFeedClick={() => {}}
                          mode="me"
                          refreshPage={this.loadMyHandshakeList}
                        />
                      </Col>
                    );
                  }
                  return null;
                })
              ) : (
                <NoData message="Start a mission." />
              )
            }
          </Col>
        </Row>
      </Grid>
    );
  }
}

const mapState = state => ({
  me: state.me,
  app: state.app,
  auth: state.auth,
  firebaseUser: state.firebase.data,
  exchange: state.exchange,
});

const mapDispatch = ({
  loadMyHandshakeList,
  getListOfferPrice,
  fireBaseExchangeDataChange,
  fireBaseBettingChange,
});

export default connect(mapState, mapDispatch)(Me);
