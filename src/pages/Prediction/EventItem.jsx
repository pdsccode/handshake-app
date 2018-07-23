import React from 'react';
import PropTypes from 'prop-types';
import Countdown from '@/components/Countdown/Countdown';
import Image from '@/components/core/presentation/Image';
import commentIcon from '@/assets/images/icon/comment.svg';
import OutcomeList from './OutcomeList';

function renderEventName(event) {
  return (
    <div className="EventName">
      {event.name}
    </div>
  );
}

function renderEventNumberOfPlayers(event) {
  const s = event.total_users > 1 ? 'ninjas are' : 'ninja is';
  return (
    <div className="EventNumberOfPlayer">
      {`${event.total_users} ${s} playing`}
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

function renderEventMessages() {
  return (
    <div className="EventMessage">
      <span className="EventMessageIcon"><Image src={commentIcon} /></span>
      <div className="EventMessageText">Comments</div>
    </div>
  );
}

function renderOutcomeList(event, onClick) {
  return (
    <OutcomeList event={event} onClick={onClick} />
  );
}

function renderDetails(event) {
  return (
    <div className="EventDetails">
      <div className="EvenFirstGroup">
        {renderEvenTimeLeft(event)}
        {renderEventTotalBets(event)}
      </div>
      {renderEventMessages()}
    </div>
  );
}

function EventItem({ event,onClick }) {
  return (
    <div className="EventItem">
      {renderEventName(event)}
      {renderEventNumberOfPlayers(event)}
      {renderOutcomeList(event, onClick)}
      {renderDetails(event)}
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
