import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { BigNumber } from 'bignumber.js';
// service, constant
import local from '@/services/localStore';
import { APP, API_URL } from '@/constants';
import { loadMatches, loadHandshakes, checkFreeAvailable } from '@/reducers/betting/action';
import { SIDE } from '@/components/handshakes/betting/constants.js';
import { defaultOdds, defaultAmount } from '@/components/handshakes/betting/calculation';

import { getBalance, parseBigNumber } from '@/components/handshakes/betting/utils';
import GA from '@/services/googleAnalytics';


import OrderPlace from './../OrderPlace';
// style
import './Filter.scss';

// //


const CRYPTOSIGN_MINIMUM_MONEY = 0.00002;
const freeAmount = 0.001;
const TAG = 'BETTING_FILTER';

const SELECTING_DEFAULT = {
  id: '',
  value: '',
};

class BettingFilter extends React.Component {
  static propTypes = {
    loadHandshakes: PropTypes.func.isRequired,
    checkFreeAvailable: PropTypes.func.isRequired,
    setLoading: PropTypes.func,
    bettingShakeIsOpen: PropTypes.bool,
    selectedOutcome: PropTypes.object,
    selectedMatch: PropTypes.object,
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    //const { odd, isPrivate } = props;
    this.state = {
      // selectedMatch: null,
      // selectedOutcome: null,
      support: null,
      against: null,
      isFirstFree: false,
      side: SIDE.SUPPORT,
    };

    this.callGetHandshakes = this.callGetHandshakes.bind(this);
    this.checkShowFreeBanner = this.checkShowFreeBanner.bind(this);
  }

  componentDidMount() {

    this.props.getHanshakeList(this.callGetHandshakes);
    this.props.checkFree(this.checkShowFreeBanner);
  }

  componentWillReceiveProps(nextProps) {
    const { isFirstFree, support, against } = nextProps;
    console.log(TAG, 'componentWillReceiveProps', 'support:', support, 'against:', against);
    const filterSupport = support && support.length > 0 && support.filter(item => item.amount >= CRYPTOSIGN_MINIMUM_MONEY);
    const filterAgainst = against && against.length > 0 && against.filter(item => item.amount >= CRYPTOSIGN_MINIMUM_MONEY);
    this.setState({
      support: filterSupport,
      against: filterAgainst,
      isFirstFree,
    });
    this.checkShowFreeBanner();
  }

  getInfoShare(selectedMatch, selectedOutcome) {
    const profile = local.get(APP.AUTH_PROFILE);
    const ref = profile ? `&ref=${profile.username}` : '';
    return {
      title: `I put a bet on ${selectedMatch.value}. ${selectedOutcome.value}! Put your coin where your mouth is.`,
      shareUrl: `${window.location.origin}/discover/${encodeURI(selectedMatch.value)}?match=${selectedMatch.id}&out_come=${selectedOutcome.id}${ref}?is_private=0`,
    };
  }

  callGetHandshakes(item) {
    if (item) {
      const params = {
        outcome_id: item.id,
      };
      this.props.loadHandshakes({
        PATH_URL: API_URL.CRYPTOSIGN.LOAD_HANDSHAKES,
        METHOD: 'POST',
        data: params,

      });
      if (typeof window !== 'undefined') {
        window.isGotDefaultOutCome = true;
      }
    }
  }
  callCheckFirstFree() {
    console.log(TAG, 'Call API check first free');
    this.props.checkFreeAvailable({
      PATH_URL: API_URL.CRYPTOSIGN.CHECK_FREE_AVAILABLE,
      METHOD: 'GET',
    });
  }

  /*
  refreshHanshakeTable() {
    const { selectedOutcome } = this.state;
    this.callGetHandshakes(selectedOutcome);
  }
  */

  closeShakePopup() {

    this.setState({
      bettingShakeIsOpen: false,
    });
    this.modalBetRef.close();
  }

  closeShakeFreePopup() {
    this.setState({
      isFirstFree: false,
      bettingShakeIsOpen: false,
    });
    this.modalBetFreeRef.close();
  }

  async checkShowFreeBanner() {
    const balance = await getBalance();
    console.log(TAG, 'checkShowFreeBanner', balance, typeof balance);
    if (balance === '0') {
      // Call API check if show free
      this.callCheckFirstFree();
    }
  }

  render() {
    //if (!this.props.selectedOutcome && !this.props.selectedMatch) return null;
    const { isFirstFree, support, against } = this.state;

    const selectedOutcome = this.props.selectedOutcome ? this.props.selectedOutcome : SELECTING_DEFAULT;
    const selectedMatch = this.props.selectedMatch ? this.props.selectedMatch : SELECTING_DEFAULT;

    const outcomeId = (selectedOutcome && selectedOutcome.id >= 0) ? selectedOutcome.id : null;
    const outcomeHid = (selectedOutcome && selectedOutcome.hid >= 0) ? selectedOutcome.hid : null;

    const matchName = (selectedMatch && selectedMatch.value) ? selectedMatch.value : null;
    const matchOutcome = (selectedOutcome && selectedOutcome.value) ? selectedOutcome.value : null;


    const shareInfo = this.getInfoShare(selectedMatch, selectedOutcome);

    const closingDate = (selectedMatch && selectedMatch.date) ? selectedMatch.date : null;
    const reportTime = (selectedMatch && selectedMatch.reportTime) ? selectedMatch.reportTime : null;

    // new code
    const bettingShake = {
      side: this.state.side,
      amountSupport: defaultAmount(against),
      amountAgainst: defaultAmount(support),
      matchName,
      isOpen: this.state.bettingShakeIsOpen,
      matchOutcome,
      outcomeId,
      outcomeHid,
      marketSupportOdds: defaultOdds(against),
      marketAgainstOdds: defaultOdds(support),
      closingDate,
      reportTime,
      // onSubmitClick: (() => {
      //   this.closeShakePopup();
      //   this.modalLuckyRealRef.open();
      // }),
      onSubmitClick: this.props.onSubmitClick,
      onCancelClick: this.props.onCancelClick,
    };

    const orderBook = { support, against };

    return (
      <OrderPlace
        bettingShake={bettingShake}
        orderBook={orderBook}
      />
    );
  }
}

const mapState = state => ({
  matches: state.betting.matches,
  support: state.betting.support,
  against: state.betting.against,
  tradedVolum: state.betting.tradedVolum,
  isFirstFree: state.betting.isFirstFree,
});

const mapDispatch = ({
  loadMatches,
  loadHandshakes,
  checkFreeAvailable,
});

export default connect(mapState, mapDispatch)(BettingFilter);
