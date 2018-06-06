import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// action, mock
import { fireBaseExchangeDataChange, loadMyHandshakeList, fireBaseBettingChange } from '@/reducers/me/action';
import { API_URL, HANDSHAKE_ID } from '@/constants';
import { URL } from '@/config';
// components
import { Link } from 'react-router-dom';
import { Grid, Row, Col } from 'react-bootstrap';
import NoData from '@/components/core/presentation/NoData';
import FeedPromise from '@/components/handshakes/promise/Feed';
import FeedBetting from '@/components/handshakes/betting/Feed';
import FeedExchange from '@/components/handshakes/exchange/Feed/FeedExchange';
import FeedSeed from '@/components/handshakes/seed/Feed';
import Image from '@/components/core/presentation/Image';
// style
import AvatarSVG from '@/assets/images/icon/avatar.svg';
import ExpandArrowSVG from '@/assets/images/icon/expand-arrow.svg';
import './Me.scss';
import { getListOfferPrice } from "@/reducers/exchange/action";

const TAG = "Me";
const maps = {
  [HANDSHAKE_ID.PROMISE]: FeedPromise,
  [HANDSHAKE_ID.BETTING]: FeedBetting,
  [HANDSHAKE_ID.EXCHANGE]: FeedExchange,
  [HANDSHAKE_ID.SEED]: FeedSeed,
};

class Me extends React.Component {
  componentDidMount() {
    this.getListOfferPrice();
    // this.loadMyHandshakeList();
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

  getListOfferPrice = () => {
    this.props.getListOfferPrice({
      PATH_URL: API_URL.EXCHANGE.GET_LIST_OFFER_PRICE,
      qs: { fiat_currency: this.props?.app?.ipInfo?.currency },
      successFn: this.handleGetPriceSuccess,
      errorFn: this.handleGetPriceFailed,
    });
  }

  handleGetPriceSuccess = () => {
    this.loadMyHandshakeList();
  }

  handleGetPriceFailed = () => {
    this.loadMyHandshakeList();
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
            {
              list && list.length > 0 ? (
                list.map((handshake) => {
                  const FeedComponent = maps[handshake.type];
                  if (FeedComponent) {
                    return (
                      <Col key={handshake.id} className="feed-wrapper">
                        <FeedComponent {...handshake} history={this.props.history} onFeedClick={() => {}} mode={'me'}
                                       refreshPage={this.loadMyHandshakeList}
                        />
                      </Col>
                    );
                  }
                })
              ) : (
                <NoData message="Create a Shake to get started!" />
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
  getListOfferPrice: PropTypes.func.isRequired,
  firebaseUser: PropTypes.any.isRequired,
};

const mapState = state => ({
  me: state.me,
  app: state.app,
  auth: state.auth,
  firebaseUser: state.firebase.data,
});

const mapDispatch = ({
  loadMyHandshakeList,
  getListOfferPrice,
  fireBaseExchangeDataChange,
  fireBaseBettingChange
});

export default connect(mapState, mapDispatch)(Me);
