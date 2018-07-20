import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import BettingFilter from '@/components/handshakes/betting/Feed/Filter';
import ModalDialog from '@/components/core/controls/ModalDialog';
import Loading from '@/components/Loading';
import LuckyReal from '@/components/handshakes/betting/LuckyPool/LuckyReal/LuckyReal';
import GA from '@/services/googleAnalytics';

import { eventSelector, isLoading } from './selector';
import { loadMatches } from './action';
import EventItem from './EventItem';

import './Prediction.scss';

class Prediction extends React.Component {
  static displayName = 'Prediction';
  static propTypes = {
    eventList: PropTypes.array,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    eventList: [],
  };
  state = {
    isShowOrder: false,
    selectedOutcome: null,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(loadMatches());
  }

  openOrderPlace(selectedOutcome) {
    this.openFilter(selectedOutcome);
    this.modalOrderPlace.open();
  }

  closeOrderPlace() {
    this.modalOrderPlace.close();
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
    this.setState({
      isShowOrder: true,
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
          SHARE TO <span>WIN 10 ETH</span>
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
        <ModalDialog onRef={(modal) => { this.modalOrderPlace = modal; }}>
          <BettingFilter
            selectedOutcome={state.selectedOutcome}
            selectedMatch={state.selectedMatch}
            render={state.isShowOrder}
            openPopup={(click)=> {this.openFilter = click}}
            onSubmitClick={()=> {
              this.closeOrderPlace();
              this.modalLuckyReal.open();
            }}
            onCancelClick={()=>{
              this.closeOrderPlace();
            }}
          />
        </ModalDialog>
        <ModalDialog onRef={(modal) => { this.modalLuckyReal = modal; }}>
          <LuckyReal onButtonClick={() => this.modalLuckyReal.close() } />
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
    };
  },
)(Prediction);
