import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './styles.scss';

const scopeCss = (className) => `internal-admin-sidebar-${className}`;

export default class Sidebar extends Component {
  constructor() {
    super();
    this.state = {
      selectedId: null,
    };
  }
  onMenuSelect = (idMenu) => {
    this.setState({ selectedId: idMenu });
    const { onMenuSelect } = this.props;
    if (typeof onMenuSelect === 'function') {
      onMenuSelect(idMenu);
    }
  }

  renderMenu = () => {
    const { menus } = this.props;
    const { selectedId } = this.state;
    return Object.entries(menus || {}).map(([id, menu]) => (
      <div key={id} onClick={() => this.onMenuSelect(id)} className={`${scopeCss('item')} ${selectedId === id ? 'selected' : ''}`}>
        <span>{menu?.name}</span>
      </div>
    ));
  }
  render() {
    return (
      <div className={scopeCss('container')}>
        <div className={scopeCss('header')}>Admin Dashboard</div>
        <div className={scopeCss('body')}>{this.renderMenu()}</div>
      </div>
    );
  }
}

Sidebar.defaultProps = {
  onMenuSelect: null,
};

Sidebar.propTypes = {
  menus: PropTypes.object.isRequired,
  onMenuSelect: PropTypes.func,
};
