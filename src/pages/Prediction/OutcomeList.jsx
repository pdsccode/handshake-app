import React from 'react';
import propTypes from 'prop-types';
import SwipeableList from '@/components/SwipeableList/SwipeableList';
import { generatedBackgroundCss } from '@/utils/css.js';
import './OutcomeList.scss';


const BACKGROUND_COLORS = [
  '#000000',
  '#FF2D55',
  '#9C27B0',
  '#007AFF',
  '#FF9500',
  '#009688',
  '#843CF6',
  '#381CE2',
  '#9D61FD',
  '#D5E969',
];

function buildOutcomeItem(outcome) {
  const styleCss = {
    background: generatedBackgroundCss(null, BACKGROUND_COLORS),
  };
  return (
    <div className="OutcomeItem" style={styleCss}>{outcome.name}</div>
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
