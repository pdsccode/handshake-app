import React from 'react';
import PropTypes from 'prop-types';
// service, constant
import local from '@/services/localStore';
import { APP} from '@/constants';
import { defaultOdds, defaultAmount } from '@/components/handshakes/betting/calculation';

import GA from '@/services/googleAnalytics';
import BettingShakeFree from '@/components/handshakes/betting/Feed/ShakeFree';

import OrderPlace from './../OrderPlace';

// style
import './Filter.scss';

// //


const freeAmount = 0.001;
const TAG = 'BETTING_FILTER';

const SELECTING_DEFAULT = {
  id: '',
  value: '',
};

class BettingFilter extends React.Component {
  static propTypes = {
    //loadHandshakes: PropTypes.func.isRequired,
    //checkFreeAvailable: PropTypes.func.isRequired,
    setLoading: PropTypes.func,
    bettingShakeIsOpen: PropTypes.bool,
    selectedOutcome: PropTypes.object,
    selectedMatch: PropTypes.object,
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {

    //this.props.openPopup(this.openPopup);
  }

  componentWillReceiveProps(nextProps) {

  }

  getInfoShare(selectedMatch, selectedOutcome) {
    const profile = local.get(APP.AUTH_PROFILE);
    const ref = profile ? `&ref=${profile.username}` : '';
    return {
      title: `I put a bet on ${selectedMatch.value}. ${selectedOutcome.value}! Put your coin where your mouth is.`,
      shareUrl: `${window.location.origin}/discover/${encodeURI(selectedMatch.value)}?match=${selectedMatch.id}&out_come=${selectedOutcome.id}${ref}?is_private=0`,
    };
  }

  render() {
    const { support, against } = this.props;
    const { isFree } = this.props;

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
      amountSupport: defaultAmount(against),
      amountAgainst: defaultAmount(support),
      matchName,
      //isOpen: this.state.bettingShakeIsOpen,
      matchOutcome,
      outcomeId,
      outcomeHid,
      marketSupportOdds: defaultOdds(against),
      marketAgainstOdds: defaultOdds(support),
      closingDate,
      reportTime,
      onSubmitClick: (() => {
        this.setState({
          bettingShakeIsOpen: false,
        });
        this.props.onSubmitClick();
      }),
      onCancelClick: (() => {
        this.setState({
          bettingShakeIsOpen: false,
        });
        this.props.onCancelClick();
      }),
    };

    const orderBook = { support, against };

    return (
      <React.Fragment>
        {isFree ?
          <BettingShakeFree
            amount={freeAmount}
            {...bettingShake}
          /> :
          <OrderPlace
            bettingShake={bettingShake}
            orderBook={orderBook}
          />}
      </React.Fragment>

    );
  }
}

export default (BettingFilter);
