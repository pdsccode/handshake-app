import React from 'react';
import propTypes from 'prop-types';
import SwipeableList from '@/components/SwipeableList/SwipeableList';

function buildOutcomeItem(outcome) {
  return (
    <div className="OutcomeItem">{outcome.name}</div>
  );
}

function OutcomeList(props) {
  const { event, onClick } = props;
  const { outcomes } = event;
  return (
    <div className="OutcomeList">
      <SwipeableList
        event={event}
        data={outcomes}
        buildItem={buildOutcomeItem}
        onClick={onClick}
      />
    </div>
  );
}

OutcomeList.propTypes = {
  event: propTypes.object,
  onClick: propTypes.func,
};

OutcomeList.defaultProps = {
  event: null,
  onClick: undefined,
};

export default OutcomeList;
