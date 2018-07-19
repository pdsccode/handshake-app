import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Swipeable from 'react-swipeable';

import './SwipeableList.scss';

export default class SwipeableList extends Component {
  static displayName = 'SwipeableList';
  static propTypes = {
    className: PropTypes.string,
    data: PropTypes.array.isRequired,
    event: PropTypes.object,
    onClick: PropTypes.func,
    buildItem: PropTypes.func,
    selectedID: PropTypes.number,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedID: props.selectedID,
    };
  }

  onClickItem = (id, e, props, itemData) => {
    this.setState({
      selectedID: id,
    });
    if (props.onClick) {
      props.onClick(id, e, props, itemData);
    }
  }

  renderItem = (itemData, props, state) => {
    const cls = classNames('SwipeableItem', {
      Selected: state.selectedID === itemData.id,
    });
    if (!itemData.id && itemData.id !== 0) {
      console.error('Item need to have an id');
    }

    return (
      <div
        className={cls}
        key={itemData.id}
        onClick={(e) => this.onClickItem(itemData.id, e, props, itemData)}
      >
        {props.buildItem(itemData)}
      </div>
    );
  }

  renderComponent = (props, state) => {
    const cls = classNames(SwipeableList.displayName, {
      [props.classNames]: !!props.classNames,
    });

    return (
      <Swipeable className={cls}>
        {
          (props.data || []).map((item) => {
            return this.renderItem(item, props, state);
          })
        }
      </Swipeable>
    );
  }

  render() {
    return this.renderComponent(this.props, this.state);
  }
}
