import React from 'react';
import PropTypes from 'prop-types';
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
  }

  onItemSelected(item) {
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

  componentDidMount() {
    const { defaultId, source } = this.props;
    if (defaultId && source && source.length > 0) {
      const itemDefault = source.find(item => item.id === defaultId);
      this.setState({ text: itemDefault.value, idActive: itemDefault.id });
    }
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
  className: PropTypes.string,
  onItemSelected: PropTypes.func,
  defaultId: PropTypes.any,
  source: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.any,
    value: PropTypes.string,
    style: PropTypes.object,
  })).isRequired,
};

export default Dropdown;
