import React, { Component } from 'react';
import './styles.scss';

const scopeCss = (className) => `internal-admin-header-${className}`;

export default class Header extends Component {
  render() {
    return (
      <div className={scopeCss('container')}>
        Header
      </div>
    );
  }
}
