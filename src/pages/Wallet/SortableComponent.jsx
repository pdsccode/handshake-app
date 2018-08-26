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

import iconMove from '@/assets/images/wallet/icons/icon-move.svg';

const DragHandle = SortableHandle(() => <img className="iconMove" src={iconMove} />); // This can be any component you want

const SortableItem = SortableElement(({item, isSortable, onItemClick, onMoreClick, onAddressClick}) => {
  
  return (
    <div className="sortable-item">      
      <WalletItem onMoreClick={onMoreClick} onAddressClick={onAddressClick} onItemClick={onItemClick} key={Math.random()} wallet={item} isSortable={isSortable} />
      {isSortable ? 
        <DragHandle />
      :""}
    </div>
  );
});

const SortableList = SortableContainer(({items, isSortable, onItemClick, onMoreClick, onAddressClick}) => {
  return (
    <div className="sortable-row">
      {items.map((item, index) => (
        <SortableItem onMoreClick={() => onMoreClick(item)} onAddressClick={() => onAddressClick(item)} onItemClick={() => onItemClick(item)} isSortable={isSortable} key={`item-${index}`} index={index} item={item} />
      ))}
    </div>
  );
});

class SortableComponent extends Component {
  state = {
    items: this.props.items,
    isSortable: this.props.isSortable
  };
  onSortEnd = ({oldIndex, newIndex}) => {
    const {items} = this.state;

    this.setState({
      items: arrayMove(items, oldIndex, newIndex),
    }, ()=>{
      // call update list item
      this.props.onSortableSuccess(this.state.items);
    });
  };

  componentDidUpdate(){ 
    if (this.props.isSortable != this.state.isSortable){
      this.setState({isSortable: this.props.isSortable});
    }
    if (!this.props.isSortable && this.props.items != this.state.items){
      this.setState({items: this.props.items});
    }
  }

  onItemClick = (item) => {    
    this.props.onItemClick(item);
  }
  onMoreClick = (item) => {    
    this.props.onMoreClick(item);
  }
  onAddressClick = (item) => {    
    this.props.onAddressClick(item);
  }

  render() {    
    const {items, isSortable} = this.state;
    return <SortableList onMoreClick={this.onMoreClick} onAddressClick={this.onAddressClick} onItemClick={this.onItemClick} isSortable={isSortable} items={items} onSortEnd={this.onSortEnd} useDragHandle={true} />;
  }
}
SortableComponent.propTypes = {
  items: PropTypes.array,  
  isSortable: PropTypes.bool,

  settingWallet: PropTypes.any,  
  onMoreClick: PropTypes.func,
  onWarningClick: PropTypes.func,
  onAddressClick: PropTypes.func,
  onItemClick: PropTypes.func,
  onSortableSuccess: PropTypes.func,
  
};
export default injectIntl(SortableComponent);