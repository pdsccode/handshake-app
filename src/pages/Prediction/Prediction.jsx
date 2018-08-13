import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import BetMode from '@/components/handshakes/betting/Feed/OrderPlace/BetMode';
import ModalDialog from '@/components/core/controls/ModalDialog';
import Loading from '@/components/Loading';
import LuckyReal from '@/components/handshakes/betting/LuckyPool/LuckyReal/LuckyReal';
import LuckyLanding from '@/pages/LuckyLanding/LuckyLanding';
import GA from '@/services/googleAnalytics';
import LuckyFree from '@/components/handshakes/betting/LuckyPool/LuckyFree/LuckyFree';
import ReportPopup from '@/components/handshakes/betting/Feed/ReportPopup';

import { URL } from '@/constants';
import { eventSelector, isLoading, showedLuckyPoolSelector, isSharePage, countReportSelector } from './selector';
import { loadMatches, updateShowedLuckyPool, getReportCount, removeExpiredEvent } from './action';
import EventItem from './EventItem';

import './Prediction.scss';

class Prediction extends React.Component {
  static displayName = 'Prediction';
  static propTypes = {
    eventList: PropTypes.array,
    showedLuckyPool: PropTypes.bool,
    isSharePage: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    countReport: PropTypes.number,
  };

  static defaultProps = {
    eventList: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedOutcome: null,
      isLuckyPool: true,
    };
  }

  componentDidMount() {
    this.props.dispatch(loadMatches());
    this.props.dispatch(getReportCount());
  }

  onCountdownComplete = (eventId) => {
    this.props.dispatch(removeExpiredEvent({ eventId }));
    this.closeOrderPlace();
  }

  openOrderPlace = (selectedOutcome) => {
    this.openFilter(selectedOutcome);
    this.modalOrderPlace.open();
  }

  closeOrderPlace() {
    this.modalOrderPlace.close();
  }

  showLuckyPool() {
    const { showedLuckyPool } = this.props;
    if (showedLuckyPool) return;
    console.log('Action Lucky Pool:', showedLuckyPool);
    this.props.dispatch(updateShowedLuckyPool());
    setTimeout(() => {
      this.modalLuckyPoolRef.open();
    }, 2 * 1000);
  }

  handleClickEventItem = (props, itemData) => {
    const { event } = props;
    const selectedOutcome = {
      hid: itemData.hid,
      id: itemData.id,
      marketOdds: itemData.market_odds,
      value: itemData.name,
    };
    const selectedMatch = {
      date: event.date,
      id: event.id,
      marketFee: event.market_fee,
      reportTime: event.reportTime,
      value: event.name,
    };
    this.openOrderPlace(selectedOutcome);
    this.modalOrderPlace.open();
    this.setState({
      selectedOutcome,
      selectedMatch,
    });

    // send event tracking
    try {
      GA.clickChooseAnOutcome(event.name, itemData.name);
    } catch (err) {
      console.error(err);
    }
  };

  renderEventList = (props) => {
    if (!props.eventList || !props.eventList.length) return null;
    return (
      <div className="EventList">
        {props.eventList.map((event) => {
          return (
            <EventItem
              key={event.id}
              event={event}
              onClickOutcome={this.handleClickEventItem}
              onCountdownComplete={() => this.onCountdownComplete(event.id)}
            />
          );
        })}
      </div>
    );
  };

  renderShareToWin = () => {
    return (
      <div
        className="ShareToWin"
        onClick={() => {
          GA.clickBannerWin();
        }}
      >
        <div className="ShareToWinTitle">
          PLAY TO <span>WIN 10 ETH</span>
        </div>
      </div>
    );
  }

  renderBetMode = (props, state) => {
    return (
      <ModalDialog close={true} onRef={(modal) => { this.modalOrderPlace = modal; }}>
        <BetMode
          selectedOutcome={state.selectedOutcome}
          selectedMatch={state.selectedMatch}
          openPopup={(click) => { this.openOrderPlace = click }}
          onSubmitClick={(isFree) => {
            this.closeOrderPlace();
            isFree ? this.modalLuckyFree.open() : this.modalLuckyReal.open();
          }}
          onCancelClick={() => {
            this.closeOrderPlace();
          }}
        />
      </ModalDialog>
    );
  }

  renderReportPopup = () => {
    return (
      <ReportPopup />
    );
  }

  renderComponent = (props, state) => {
    return (
      <React.Fragment>
        <ModalDialog onRef={(modal) => { this.modalLuckyReal = modal; }}>
          <LuckyReal onButtonClick={() => this.modalLuckyReal.close() } />
        </ModalDialog>
        <ModalDialog onRef={(modal) => { this.modalLuckyFree = modal; }}>
          <LuckyFree onButtonClick={() => this.modalLuckyFree.close() } />
        </ModalDialog>
        <ModalDialog className="modal" onRef={(modal) => { this.modalLuckyPoolRef = modal; return null; }}>
          <LuckyLanding onButtonClick={() => {
            this.modalLuckyPoolRef.close();
          }}
          />
        </ModalDialog>
      </React.Fragment>
    );
  }

  renderViewAllEvent = (props) => {
    if (!props.isSharePage) return null;
    return (
      <a href={URL.HANDSHAKE_PREDICTION} onClick="location.reload()" className="ViewAllEvent">
        View All Events
      </a>
    );
  }

  renderComponent = (props, state) => {
    return (
      <div className={Prediction.displayName}>
        <Loading isLoading={props.isLoading} />
        {/* {this.renderShareToWin()} */}
        {this.renderEventList(props)}
        {this.renderBetMode(props, state)}
        {this.renderViewAllEvent(props, state)}
        <ModalDialog onRef={(modal) => { this.modalLuckyReal = modal; }}>
          <LuckyReal onButtonClick={() => this.modalLuckyReal.close() } />
        </ModalDialog>
        <ModalDialog onRef={(modal) => { this.modalLuckyFree = modal; }}>
          <LuckyFree onButtonClick={() => this.modalLuckyFree.close() } />
        </ModalDialog>
        <ModalDialog className="modal" onRef={(modal) => { this.modalLuckyPoolRef = modal; return null; }}>
          <LuckyLanding onButtonClick={() => {
            this.modalLuckyPoolRef.close();
          }}
          />
        </ModalDialog>
        {props.countReport > 0 && this.renderReportPopup()}
      </div>
    );
  };

  render() {
    return this.renderComponent(this.props, this.state);
  }
}

export default connect(
  (state) => {
    return {
      countReport: countReportSelector(state),
      eventList: eventSelector(state),
      isSharePage: isSharePage(state),
      isLoading: isLoading(state),
      showedLuckyPool: showedLuckyPoolSelector(state),
    };
  },
)(Prediction);
