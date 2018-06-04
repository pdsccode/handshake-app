import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// service, constant
import { loadDiscoverList } from '@/reducers/discover/action';
import { HANDSHAKE_ID, API_URL } from '@/constants';
import { URL } from '@/config';
// components
import { Grid, Row, Col } from 'react-bootstrap';
import SearchBar from '@/components/core/controls/SearchBar';
import Category from '@/components/core/controls/Category';

import FeedPromise from '@/components/handshakes/promise/Feed';
import FeedBetting from '@/components/handshakes/betting/Feed';
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
  [HANDSHAKE_ID.BETTING]: FeedBetting,
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
      handshakeIdActive: '',
      tabIndexActive: 1,
    };
    this.props.loadDiscoverList({
      PATH_URL: API_URL.DISCOVER.BASE,
      qs: { location_p: { pt: '10.786391,106.700074', d: 5 }, chain_id: 4 },
    });
    // bind
    this.clickCategoryItem = this.clickCategoryItem.bind(this);
    this.clickTabItem = this.clickTabItem.bind(this);
    this.searchChange = this.searchChange.bind(this);
  }

  componentDidMount() {
    this.getListOfferPrice();
    // this.intervalCountdown = setInterval(() => {
    //   this.getListOfferPrice();
    // }, 30000);
  }

  get getHandshakeList() {
    const { list } = this.props.discover;
    if (list && list.length > 0) {
      return list.map((handshake) => {
        const FeedComponent = maps[handshake.type];
        if (FeedComponent) {
          return (
            <Col key={handshake.id} md={12} className="feed-wrapper">
              <FeedComponent
                {...handshake}
                history={this.props.history}
                onFeedClick={() => this.clickFeedDetail(handshake.id)}
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
      BASE_URL: API_URL.EXCHANGE.BASE,
      PATH_URL: API_URL.EXCHANGE.GET_LIST_OFFER_PRICE,
      qs: { fiat_currency: this.props?.app?.ipInfo?.currency },
      successFn: this.handleGetPriceSuccess,
      errorFn: this.handleGetPriceFailed,
    });
  }

  handleGetPriceSuccess = () => {
    this.props.loadDiscoverList({
      PATH_URL: API_URL.DISCOVER.BASE,
      qs: { location_p: { pt: '10.786391,106.700074', d: 5 } },
      headers: { chainId: 4 },
    });
  }

  handleGetPriceFailed = () => {
    this.props.loadDiscoverList({
      PATH_URL: API_URL.DISCOVER.BASE,
      qs: { location_p: { pt: '10.786391,106.700074', d: 5 } },
      headers: { chainId: 4 },
    });
  }

  searchChange(query) {
    clearTimeout(this.searchTimeOut);
    this.searchTimeOut = setTimeout(() => {
      this.props.loadDiscoverList({
        PATH_URL: API_URL.DISCOVER.BASE,
        qs: { query: query.trim() },
        headers: { chainId: 4 },
      });
    }, 500);
  }

  clickFeedDetail(id) {
    this.props.history.push(`${URL.HANDSHAKE_DISCOVER}/${id || ''}`);
  }

  clickCategoryItem(category) {
    // this.props.showAlert({
    //   message: <p className="text-center">aaaaaaaa</p>,
    //   timeOut: 10000000,
    //   type: 'danger',
    // });
    const { id } = category;
    switch (id) {
      case HANDSHAKE_ID.BETTING:
        // do something
        break;
      case HANDSHAKE_ID.SEED:
        // do something
        break;
      case HANDSHAKE_ID.EXCHANGE:
        // do something
        break;
      default:
        // is promise
    }
    // filter list
    this.props.loadDiscoverList({
      PATH_URL: API_URL.DISCOVER.BASE,
      qs: { type: id },
      headers: { chainId: 4 },
    });
    // set feed type activate
    this.setState({
      handshakeIdActive: id,
    });
  }

  clickTabItem(index) {
    this.setState({ tabIndexActive: index });
    this.props.loadDiscoverList({
      PATH_URL: API_URL.DISCOVER.BASE,
      qs: { public: 0 },
      headers: { chainId: 4 },
    });
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
            <Category className="category-wrapper" onItemClick={this.clickCategoryItem} />
          </Col>
        </Row>
        {
          handshakeIdActive === HANDSHAKE_ID.EXCHANGE && (
            <Row>
              <Col md={12}>
                <Tabs
                  activeId={this.state.tabIndexActive}
                  onClickTab={this.clickTabItem}
                  list={[
                    { id: 1, text: 'Buy' },
                    { id: 2, text: 'Sell' },
                  ]}
                />
                {
                  tabIndexActive === 1 && (
                    <FeedCreditCard history={this.props.history} />
                  )
                }
              </Col>
            </Row>
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
  wallet: state.wallet,
});

const mapDispatch = ({
  loadDiscoverList,
  getListOfferPrice,
});

export default connect(mapState, mapDispatch)(DiscoverPage);
