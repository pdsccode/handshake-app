import React, {Component} from 'react';
import {render} from 'react-dom';
import PropTypes from 'prop-types';
import {injectIntl} from 'react-intl';
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
  arrayMove,
} from 'react-sortable-hoc';

import WalletItem from './WalletItem';
import './ListWalletItem.scss';

const DragHandle = SortableHandle(() => <div className="icon-short"></div>); // This can be any component you want

const SortableItem = SortableElement(({item}) => {
  return (
    <div className="sortable-item">      
      <WalletItem key={Math.random()} wallet={item} onMoreClick={() => this.onMoreClick(item)} onWarningClick={() => this.onWarningClick(item)} onAddressClick={() => this.onAddressClick(item)} />
      <DragHandle />
    </div>
  );
});

const SortableList = SortableContainer(({items}) => {
  return (
    <div className="sortable-row">
      {items.map((item, index) => (
        <SortableItem key={`item-${index}`} index={index} item={item} />
      ))}
    </div>
  );
});

class SortableComponent extends Component {
  state = {
    items: this.props.items
  };
  onSortEnd = ({oldIndex, newIndex}) => {
    const {items} = this.state;

    this.setState({
      items: arrayMove(items, oldIndex, newIndex),
    });
  };
  render() {
    console.log(this.state.items);
    const {items} = this.state;

    return <SortableList items={items} onSortEnd={this.onSortEnd} useDragHandle={true} />;
  }
}
SortableComponent.propTypes = {
  items: PropTypes.array,  
};
export default injectIntl(SortableComponent);