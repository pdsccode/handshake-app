import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
// component
import Image from '@/components/core/presentation/Image';
// style
import ExpandArrowSVG from '@/assets/images/icon/expand-arrow.svg';
import './Dropdown.scss';

class Dropdown extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      text: props.placeholder,
      isShow: false,
      idActive: -1,
    };
    // bind
    this.toogle = ::this.toogle;
    this.onItemSelected = ::this.onItemSelected;
    this.setDefaultItem = ::this.setDefaultItem;
  }
  // will store item selecting
  itemSelecting = {};
  isDirtyDefault = false;

  onItemSelected(item) {
    this.itemSelecting = item;
    this.setState({ text: item.value, idActive: item.id });
    this.toogle();
    // call back
    this.props.hasOwnProperty('onItemSelected') && this.props.onItemSelected(item);
  }

  toogle() {
    this.setState(state => ({
      isShow: !state.isShow
    }));
  }

  setDefaultItem(nextProps=null) {
    const { defaultId, source } = nextProps ? nextProps : this.props;
    if (nextProps && !isEqual(nextProps.source, this.props.source)) {
      this.isDirtyDefault = false;
    }
    const { idActive } = this.state;
    if (!this.isDirtyDefault && defaultId && source && source.length > 0 && idActive !== defaultId) {
      const itemDefault = source.find(item => item.id === defaultId);
      this.setState({ text: itemDefault.value, idActive: itemDefault.id });
      this.itemSelecting = itemDefault;
      this.isDirtyDefault = true;
      // call back
      this.props.hasOwnProperty('afterSetDefault') && this.props.afterSetDefault(itemDefault);
    }
  }

  componentDidMount() {
    const { defaultId, source } = this.props;
    this.setDefaultItem();
    this.props.hasOwnProperty('onRef') && this.props.onRef(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setDefaultItem(nextProps);
  }

  componentWillUnmount() {
    this.props.hasOwnProperty('onRef') && this.props.onRef(undefined);
  }

  render() {
    const { className, source } = this.props;
    const { text, isShow, idActive } = this.state;
    return (
      <div className={`dropdown dropdown-custom ${className || ''}`}>
        <button type="button" className={`btn ${isShow ? 'show' : ''}`} onClick={this.toogle}>
          {text}
          <Image src={ExpandArrowSVG} alt="expand arrow" />
        </button>
        <ul className={`dropdown-custom-menu ${isShow ? 'show' : 'hide'}`}>
          {
            source.map(item => (
              <li 
                key={item.id} 
                className={`dropdown-custom-item ${idActive === item.id ? 'active': ''}`}
                style={item.style || null}
                onClick={ () => this.onItemSelected(item) }>
                {item.value}
              </li>
            ))
          }
        </ul>
      </div>
    );
  }
}

Dropdown.propTypes = {
  placeholder: PropTypes.string,
  onRef: PropTypes.func,
  className: PropTypes.string,
  onItemSelected: PropTypes.func,
  defaultId: PropTypes.any,
  source: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.any,
    value: PropTypes.string,
    style: PropTypes.object,
  })).isRequired,
  afterSetDefault: PropTypes.func,
};

export default Dropdown;
