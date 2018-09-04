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
import OuttaMoney from '@/assets/images/modal/outtamoney.png';
import Modal from '@/components/core/controls/Modal';
import * as gtag from '@/services/ga-utils';
import taggingConfig from '@/services/tagging-config';
import FeedCreditCard from '@/components/handshakes/exchange/Feed/FeedCreditCard';
import ReportPopup from '@/components/handshakes/betting/Feed/ReportPopup';
import { URL } from '@/constants';
import { injectIntl } from 'react-intl';
import { eventSelector, isLoading, showedLuckyPoolSelector, isSharePage, countReportSelector } from './selector';
import { loadMatches, getReportCount, removeExpiredEvent } from './action';
import { VALIDATE_CODE } from '@/components/handshakes/betting/constants.js';

import EventItem from './EventItem';
import PexCreateBtn from './PexCreateBtn';

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
      modalFillContent: '',
    };
  }

  componentDidMount() {
    this.props.dispatch(loadMatches());
    this.props.dispatch(getReportCount());
  }

  onCountdownComplete = (eventId) => {
    this.props.dispatch(removeExpiredEvent({ eventId }));
    this.closeOrderPlace();
    this.props.dispatch(getReportCount());
  }

  openOrderPlace = (selectedOutcome) => {
    this.openFilter(selectedOutcome);
    this.modalOrderPlace.open();
  }

  closeOrderPlace = () => {
    this.modalOrderPlace.close();
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

  handleBetFail = () => {
      this.modalOuttaMoney.open();
  }

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

  renderBetMode = (props, state) => {
    return (
      <ModalDialog className="BetSlipContainer" close onRef={(modal) => { this.modalOrderPlace = modal; }}>
        <BetMode
          selectedOutcome={state.selectedOutcome}
          selectedMatch={state.selectedMatch}
          openPopup={(click) => { this.openOrderPlace = click; }}
          onCancelClick={this.closeOrderPlace}
          handleBetFail={this.handleBetFail}
          onSubmitClick={(isFree) => {
            this.closeOrderPlace();
            isFree ? this.modalLuckyFree.open() : this.modalLuckyReal.open();
          }}
        />
      </ModalDialog>
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

  renderLuckyReal = () => (
    <ModalDialog onRef={(modal) => { this.modalLuckyReal = modal; }}>
      <LuckyReal onButtonClick={() => this.modalLuckyReal.close()} />
    </ModalDialog>
  )

  renderLuckyFree = () => (
    <ModalDialog onRef={(modal) => { this.modalLuckyFree = modal; }}>
      <LuckyFree onButtonClick={() => this.modalLuckyFree.close()} />
    </ModalDialog>
  )

  renderLuckyLanding = () => (
    <ModalDialog className="modal" onRef={(modal) => { this.modalLuckyPoolRef = modal; return null; }}>
      <LuckyLanding onButtonClick={() => {
          this.modalLuckyPoolRef.close();
        }}
      />
    </ModalDialog>
  )

  renderOuttaMoney = () => {
    return (
      <ModalDialog className="outtaMoneyModal" close onRef={(modal) => { this.modalOuttaMoney = modal; }}>
        <div className="outtaMoneyContainer">
          <img src={OuttaMoney} alt="" />
          <div className="outtaMoneyTitle">You're outta… money!</div>
          <div className="outtaMoneyMsg">
            To keep forecasting, you’ll need to top-up your wallet.
          </div>
          <button className="btn btn-block btn-primary" onClick={this.showPopupCreditCard}>Top up my wallet</button>
        </div>
      </ModalDialog>
    );
  };

  afterWalletFill = () => {
    this.modalFillRef.close();
  }

  showPopupCreditCard = () => {
    this.modalOuttaMoney.close();
    const { messages } = this.props.intl;
    this.setState({
      modalFillContent:
        (
          <FeedCreditCard
            buttonTitle={messages.create.cash.credit.title}
            callbackSuccess={this.afterWalletFill}
          />
        ),
    }, () => {
      this.modalFillRef.open();

      gtag.event({
        category: taggingConfig.creditCard.category,
        action: taggingConfig.creditCard.action.showPopupPrediction
      });
    });
  }

  renderCreditCard = () => {
    const { messages } = this.props.intl;
    const { modalFillContent } = this.state;
    return (
      <Modal title={messages.create.cash.credit.title} onRef={modal => this.modalFillRef = modal} onClose={this.closeFillCoin}>
        {modalFillContent}
      </Modal>
    );
  }

  closeFillCoin = () => {
    this.setState({ modalFillContent: '' });
  }

  renderComponent = (props, state) => {
    return (
      <div className={Prediction.displayName}>
        <Loading isLoading={props.isLoading} />
        <PexCreateBtn />
        {this.renderEventList(props)}
        {this.renderBetMode(props, state)}
        {this.renderViewAllEvent(props, state)}
        {this.renderLuckyReal()}
        {this.renderLuckyFree()}
        {this.renderLuckyLanding()}
        {this.renderOuttaMoney()}
        {this.renderCreditCard()}
        {props.countReport > 0 && <ReportPopup />}
      </div>
    );
  };

  render() {
    return this.renderComponent(this.props, this.state);
  }
}

export default injectIntl(connect(
  (state) => {
    return {
      countReport: countReportSelector(state),
      eventList: eventSelector(state),
      isSharePage: isSharePage(state),
      isLoading: isLoading(state),
      showedLuckyPool: showedLuckyPoolSelector(state),
    };
  },
)(Prediction));
