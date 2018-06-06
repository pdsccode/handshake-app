import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// service, constant
import { loadDiscoverList } from '@/reducers/discover/action';
import { API_URL, DISCOVER_GET_HANDSHAKE_RADIUS, EXCHANGE_ACTION, EXCHANGE_ACTION_NAME, HANDSHAKE_ID } from '@/constants';
import { URL } from '@/config';
// components
import { Col, Grid, Row } from 'react-bootstrap';
import SearchBar from '@/components/core/controls/SearchBar';
import Category from '@/components/core/controls/Category';
import FeedPromise from '@/components/handshakes/promise/Feed';
// import FeedBetting from '@/components/handshakes/betting/Feed';
import FeedExchange from '@/components/handshakes/exchange/Feed/FeedExchange';
import FeedSeed from '@/components/handshakes/seed/Feed';
import FeedCreditCard from '@/components/handshakes/exchange/Feed/FeedCreditCard';
import Tabs from '@/components/handshakes/exchange/components/Tabs';
import NoData from '@/components/core/presentation/NoData';
import BettingFilter from '@/components/handshakes/betting/Feed/Filter';
import { getListOfferPrice } from '@/reducers/exchange/action';
// style
import './Discover.scss';

const maps = {
  [HANDSHAKE_ID.PROMISE]: FeedPromise,
  //[HANDSHAKE_ID.BETTING]: FeedBetting,
  [HANDSHAKE_ID.EXCHANGE]: FeedExchange,
  [HANDSHAKE_ID.SEED]: FeedSeed,
};

class DiscoverPage extends React.Component {
  static propTypes = {
    discover: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    loadDiscoverList: PropTypes.func.isRequired,
    getListOfferPrice: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      handshakeIdActive: -1,
      tabIndexActive: '',
      query: '',
    };
    // this.loadDiscoverList();
    // bind
    this.clickCategoryItem = this.clickCategoryItem.bind(this);
    this.clickTabItem = this.clickTabItem.bind(this);
    this.searchChange = this.searchChange.bind(this);
  }

  componentDidMount() {
    this.getListOfferPrice();
  }

  componentWillReceiveProps(nextProps) {
    console.log('firebase', nextProps.firebaseUser);
    // set active betting
    // if (this.state.handshakeIdActive === -1) {
    //   if (this.props.discover.list.length < 1) {
    //     this.setState({
    //       handshakeIdActive: HANDSHAKE_ID.BETTING
    //     });
    //     this.categoryRef.idActive = HANDSHAKE_ID.BETTING;
    //   }
    // }
  }

  get getHandshakeList() {
    const { list } = this.props.discover;
    if (list && list.length > 0) {
      return list.map((handshake) => {
        const FeedComponent = maps[handshake.type];
        if (FeedComponent) {
          return (
            <Col key={handshake.id} md={12} className="feed-wrapper">
              <FeedComponent {...handshake} history={this.props.history} onFeedClick={() => this.clickFeedDetail(handshake.id)}
                             refreshPage={this.loadDiscoverList}
              />
            </Col>
          );
        }
        return null;
      });
    }
    return <NoData style={{ height: '50vh' }} />;
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
    this.loadDiscoverList();
  }

  handleGetPriceFailed = () => {
    this.loadDiscoverList();
  }

  searchChange(query) {
    clearTimeout(this.searchTimeOut);
    this.searchTimeOut = setTimeout(() => {
      this.setState({ query: query }, () => {
        this.loadDiscoverList();
      });
    }, 500);
  }

  clickFeedDetail(id) {
    this.props.history.push(`${URL.HANDSHAKE_DISCOVER}/${id || ''}`);
  }

  clickCategoryItem(category) {
    const { id } = category;
    let tabIndexActive = '';
    switch (id) {
      case HANDSHAKE_ID.BETTING:
        // do something
        break;
      case HANDSHAKE_ID.SEED:
        // do something
        break;
      case HANDSHAKE_ID.EXCHANGE:
        // do something
        tabIndexActive = 1;
        break;
      default:
        // is promise
    }
    // set feed type activate
    this.setState({
      handshakeIdActive: id,
      tabIndexActive: tabIndexActive,
    }, () => {
      this.loadDiscoverList();
    });
  }

  clickTabItem(index) {
    this.setState({ tabIndexActive: index }, () => {
      this.loadDiscoverList();
    });
  }

  loadDiscoverList = () => {
    const { handshakeIdActive, tabIndexActive, query } = this.state;
    let qs = { };

    const pt = this.props?.app?.ipInfo?.latitude + ',' + this.props?.app?.ipInfo?.longitude;
    qs.location_p = { pt: pt , d: DISCOVER_GET_HANDSHAKE_RADIUS };
    if (handshakeIdActive) {
      qs.type = handshakeIdActive;
    }

    if (tabIndexActive) {
      qs.custom_query = `offer_feed_type_s:exchange AND offer_type_s:${tabIndexActive === 1 ? EXCHANGE_ACTION.SELL : EXCHANGE_ACTION.BUY}`;
    }

    if (query) {
      qs.query = query;
    }

    this.props.loadDiscoverList({ PATH_URL: API_URL.DISCOVER.BASE, qs: qs });
  }

  render() {
    const { handshakeIdActive, tabIndexActive } = this.state;

    return (
      <Grid className="discover">
        <Row>
          <Col md={12} xs={12}>
            <SearchBar onSuggestionSelected={() => {}} onInputSearchChange={this.searchChange} />
          </Col>
        </Row>
        <Row>
          <Col md={12} xs={6}>
            <Category 
              className="category-wrapper"
              onRef={category => this.categoryRef = category}
              onItemClick={this.clickCategoryItem}
            />
          </Col>
        </Row>
        {
          handshakeIdActive === HANDSHAKE_ID.EXCHANGE && (
            <div>
              <Row>
                <Col md={12}>
                  <Tabs
                    activeId={this.state.tabIndexActive}
                    onClickTab={this.clickTabItem}
                    list={[
                      { id: 1, text: EXCHANGE_ACTION_NAME[EXCHANGE_ACTION.BUY] },
                      { id: 2, text: EXCHANGE_ACTION_NAME[EXCHANGE_ACTION.SELL] },
                    ]}
                  />
                </Col>
              </Row>
              {
                tabIndexActive === 1 && (
                  <Row>
                    <Col md={12} className="feed-wrapper">
                      <FeedCreditCard history={this.props.history} />
                    </Col>
                  </Row>
                )
              }
            </div>
          )
        }
        {handshakeIdActive === HANDSHAKE_ID.BETTING &&
          <BettingFilter />
        }
        <Row>
          {handshakeIdActive !== HANDSHAKE_ID.BETTING && this.getHandshakeList}
        </Row>
      </Grid>
    );
  }
}

const mapState = state => ({
  discover: state.discover,
  firebaseUser: state.firebase.data,
  app: state.app,
});

const mapDispatch = ({
  loadDiscoverList,
  getListOfferPrice,
});

export default connect(mapState, mapDispatch)(DiscoverPage);
