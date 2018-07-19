import React from 'react';
import PropTypes from 'prop-types';
import Countdown from '@/components/Countdown/Countdown';
import Image from '@/components/core/presentation/Image';
import telegramIcon from '@/assets/images/icon/telegram.svg';
import OutcomeList from './OutcomeList';

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
      <span className="EventMessageNumber">40,371</span>
      <span className="EventMessageText">messages</span>
    </div>
  );
}

function renderOutcomeList(event, onClick) {
  return (
    <OutcomeList event={event} onClick={onClick} />
  );
}

function EventItem({ event, onClick }) {
  return (
    <div className="EventItem">
      {renderOutcomeList(event, onClick)}
      {renderEventName(event)}
      {renderEventNumberOfPlayers(event)}
      {renderEvenTimeLeft(event)}
      {renderEventTotalBets(event)}
      {renderEventMessages(event)}
    </div>
  );
}

EventItem.propTypes = {
  event: PropTypes.object.isRequired,
  onClick: PropTypes.func,
};

EventItem.defaultProps = {
  onClick: undefined,
};

export default EventItem;
