import React from 'react';
import PropTypes from 'prop-types';
import Countdown from '@/components/Countdown/Countdown';
import Image from '@/components/core/presentation/Image';
import telegramIcon from '@/assets/images/icon/telegram.svg';
import OutcomeList from './OutcomeList';
import './EventItem.scss';

function renderEventName(event) {
  return (
    <div className="EventName">
      {event.name}
    </div>
  );
}

function renderEventNumberOfPlayers(event) {
  return (
    <div className="EventNumberOfPlayer">
      {`${event.total_users} Ninja are playing`}
    </div>
  );
}

function renderEvenTimeLeft(event) {
  return (
    <div className="EventTimeLeft">
      <span className="EventTimeLeftText">Time left</span>
      <span className="EventTimeLeftValue">
        <Countdown endTime={event.date} />
      </span>
    </div>
  );
}

function renderEventTotalBets(event) {
  return (
    <div className="EventTotalBet">
      <span className="EventTotalBetText">Total bets</span>
      <span className="EventTotalBetValue">{`${event.total_bets} ETH`}</span>
    </div>
  );
}

function renderEventMessages(event) {
  return (
    <div className="EventMessage">
      <span className="EventMessageIcon">
        <Image src={telegramIcon} />
      </span>
      <div className="NumberContainer">
        <div className="EventMessageNumber">40,371</div>
        <div className="EventMessageText">messages</div>
      </div>

    </div>
  );
}

function renderOutcomeList(event) {
  return (
    <OutcomeList outcomeList={event.outcomes} />
  );
}

function renderDetails(event) {
  return (
    <div className="EventDetails">
      <div className="EvenFirstGroup">
        {renderEvenTimeLeft(event)}
        {renderEventTotalBets(event)}
      </div>
      {renderEventMessages(event)}
    </div>
  );
}

function EventItem({ event }) {
  return (
    <div className="EventItem">
      {renderOutcomeList(event)}
      {renderEventName(event)}
      {renderEventNumberOfPlayers(event)}
      {renderDetails(event)}
    </div>
  );
}

EventItem.propTypes = {
  event: PropTypes.object.isRequired,
};

export default EventItem;
