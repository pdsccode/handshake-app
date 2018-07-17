import React from 'react';
import propTypes from 'prop-types';
import SwipeableList from '@/components/SwipeableList/SwipeableList';

function buildOutcomeItem(outcome) {
  return (
    <div className="OutcomeItem">{outcome.name}</div>
  );
}

export default function OutcomeList(props) {
  const { outcomeList } = props;
  return (
    <div className="OutcomeList">
      <SwipeableList
        data={outcomeList}
        buildItem={buildOutcomeItem}
      />
    </div>
  );
}

OutcomeList.propsType = {
  outcomeList: propTypes.array,
};
