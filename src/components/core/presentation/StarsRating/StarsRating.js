/**
 * StarsRating Component.
*/
import React from 'react';
import PropTypes from 'prop-types';
import Helper from '@/services/helper';
// style
import './StarsRating.scss';

const mapping = {
  0: 'empty',
  0.25: 'quarter',
  0.5: 'half',
  0.75: 'three-fourths',
  1: 'full',
}

class StarsRating extends React.PureComponent {
  constructor(props) {
    super(props);
    this.startNum = props.startNum || 5;
  }

  get htmlStar() {
    const { starPoint } = this.props;
    // round rating point: [0, 0.25] => 0.25; (0.25, 0.5] => 0.5; (0.5, 0.75] => 0.75; (0.75, 1] => 1;
    const roundStarPoint = Math.ceil(starPoint * 4) / 4;

    const starts = [];

    for (let i = 0; i < this.startNum; i++) {
      let diff = roundStarPoint - i;
      diff = Math.max(diff, 0);
      diff = Math.min(diff, 1);
      const classStart = mapping[diff];
      starts.push(<span key={i} className={classStart}>☆</span>);
    }
    return starts;
  }

  render() {
    const {
      className, starPoint, startNum, ...newProps
    } = this.props;
    return (
      <div className={`stars-rating ${className || ''}`} {...newProps}>
        {this.htmlStar}
      </div>
    );
  }
}

StarsRating.propTypes = {
  starPoint: PropTypes.number.isRequired,
  startNum: PropTypes.number,
  className: PropTypes.string,
};

export default StarsRating;
