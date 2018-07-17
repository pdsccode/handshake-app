import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Swipeable from 'react-swipeable';
import { Link } from 'react-router-dom';
import MultiLanguage from '@/components/core/controls/MultiLanguage';
import Image from '@/components/core/presentation/Image';

import predictionIcon from '@/assets/images/categories/chip.svg';
import cashIcon from '@/assets/images/categories/exchange.svg';

import './NavigationBar.scss';

export default class NavigationBar extends Component {
  static displayName = 'NavigationBar';
  static propTypes = {
    className: PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  buildMenuData = () => {
    return [
      {
        id: 'prediction',
        name: 'prediction',
        icon: predictionIcon,
        url: 'prediction',
        isActive: true,
      },
      {
        id: 'cash',
        name: 'cash',
        icon: cashIcon,
        url: '',
        isActive: true,
      },
      {
        id: 'swap',
        name: 'swap',
        icon: null,
        url: '',
        isActive: true,
      },
    ];
  }

  renderLanguageDropDown = () => {
    return (
      <div className="multilanguage-block">
        <MultiLanguage />
      </div>
    );
  }

  renderMenuItem = (item) => {
    return (
      <div className="NavigationBarItem" key={item.id}>
        <Link to={item.url} activeClassName="Active">
          {item.icon && <Image src={item.icon} alt={item.name} />}
          <span>{item.name}</span>
        </Link>
      </div>
    );
  }

  renderMenuList = () => {
    const data = this.buildMenuData();
    return (
      <Swipeable className="NavigationBarList">
        {
          data.map((item) => {
            return this.renderMenuItem(item);
          })
        }
      </Swipeable>
    );
  }

  renderComponent = (props, state) => {
    const cls = classNames(NavigationBar.displayName, {
      [props.classNames]: !!props.classNames,
    });

    return (
      <div className={cls}>
        {this.renderMenuList(props, state)}
        {this.renderLanguageDropDown(props, state)}
      </div>
    );
  }

  render() {
    return this.renderComponent(this.props, this.state);
  }
}
