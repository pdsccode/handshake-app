import React from 'react';
import PropTypes from 'prop-types';
import cn from '@sindresorhus/class-names';
import Image from '@/components/core/presentation/Image';

class ListHorizontal extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    idActive: PropTypes.any,
    list: PropTypes.array,
    onItemClick: PropTypes.func,
    onRef: PropTypes.func,
  }

  static defaultProps = {
    className: '',
    idActive: -1,
    list: [],
    onItemClick: () => {},
    onRef: () => {},
  }

  constructor(props) {
    super(props);
    this.state = {
      idActive: this.props.idActive || -1,
      list: this.props.list,
      className: this.props.className,
    };

    this.list = ::this.list;
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.idActive !== prevState.idActive) {
      return { idActive: nextProps.idActive };
    }
    return null;
  }

  onItemClick(item) {
    this.setState({
      idActive: item.id,
    });
    this.props.onItemClick(item);
  }

  list() {
    return this.state.list.map(item => (
      <div
        key={item.id}
        className={cn('horizontal-list-item', { active: item.id === this.state.idActive })}
        onClick={() => this.onItemClick(item)}
        ref={this.props.onRef}
      >
        <Image src={item.image} alt={item.name} />
        <span>{item.name}</span>
      </div>
    ));
  }

  render() {
    return (
      <div className={cn('horizontal-list', this.state.className)}>
        {this.list()}
      </div>
    );
  }
}

export default ListHorizontal;
