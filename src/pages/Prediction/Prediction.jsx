import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import BetMode from '@/components/handshakes/betting/Feed/OrderPlace/BetMode';
import ModalDialog from '@/components/core/controls/ModalDialog';
import Loading from '@/components/Loading';
import LuckyReal from '@/components/handshakes/betting/LuckyPool/LuckyReal/LuckyReal';
import LuckyLanding from '@/pages/LuckyLanding/LuckyLanding';

import GA from '@/services/googleAnalytics';

import { eventSelector, isLoading, showedLuckyPoolSelector } from './selector';
import { loadMatches, updateShowedLuckyPool } from './action';
import EventItem from './EventItem';

import './Prediction.scss';
import LuckyFree from '@/components/handshakes/betting/LuckyPool/LuckyFree/LuckyFree';

class Prediction extends React.Component {
  static displayName = 'Prediction';
  static propTypes = {
    eventList: PropTypes.array,
    showedLuckyPool: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
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
    //this.handleScroll = this.handleScroll;
  }

  componentDidMount() {
    const { dispatch } = this.props;
    window.addEventListener('scroll', this.handleScroll);
    dispatch(loadMatches());
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  openOrderPlace(selectedOutcome) {
    this.openFilter(selectedOutcome);
    this.modalOrderPlace.open();
  }

  closeOrderPlace() {
    this.modalOrderPlace.close();
  }

  showLuckyPool() {
    const { showedLuckyPool } = this.props;

    if (showedLuckyPool === false) {
      console.log('Action Lucky Pool:', showedLuckyPool);
      this.props.dispatch(updateShowedLuckyPool());
      setTimeout(() => {
        this.modalLuckyPoolRef.open();

      }, 2 * 1000);
    }
  }

  handleScroll = () => {
    //this.showLuckyPool();
  }

  handleClickEventItem = (id, e, props, itemData) => {
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
      GA.clickChooseAnEvent(event.name, itemData.name);
    } catch (err) {}
  };

  renderEventList = (props) => {
    if (!props.eventList || !props.eventList.length) return null;
    return (
      <div className="EventList">
        {props.eventList.map((event) => {
          return <EventItem key={event.id} event={event} onClick={this.handleClickEventItem} />;
        })}
      </div>
    );
  };

  renderShareToWin = () => {
    return (
      <div className="ShareToWin">
        <div className="ShareToWinTitle">
          PLAY TO <span>WIN 10 ETH</span>
        </div>
      </div>
    );
  }

  renderComponent = (props, state) => {
    return (
      <div className={Prediction.displayName}>
        <Loading isLoading={props.isLoading} />
        {this.renderShareToWin()}
        {this.renderEventList(props)}
        <ModalDialog close={true} onRef={(modal) => { this.modalOrderPlace = modal; }}>
          <BetMode
            selectedOutcome={state.selectedOutcome}
            selectedMatch={state.selectedMatch}
            render={state.isShowOrder}
            openPopup={(click)=> {this.openOrderPlace = click}}
            onSubmitClick={(isFree)=> {
              this.closeOrderPlace();
              isFree ? this.modalLuckyFree.open() : this.modalLuckyReal.open();
            }}
            onCancelClick={()=>{
              this.closeOrderPlace();
            }}
          />
        </ModalDialog>
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
      eventList: eventSelector(state),
      isLoading: isLoading(state),
      showedLuckyPool: showedLuckyPoolSelector(state),
    };
  },
)(Prediction);
