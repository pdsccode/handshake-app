import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { URL } from '@/config';

const sidebarMap = [
  { path: URL.BUSINESS.INDEX, label: 'Dashboard', exactly: true },
  { path: URL.BUSINESS.APPLICATION_DASHBOARD, label: 'Business information' },
  { path: URL.BUSINESS.PO_DASHBOARD, label: 'Funding requests' },
];

class Sidebar extends React.Component {
  static propTypes = {
    location: PropTypes.object,
  }
  constructor(props) {
    super(props);
    this.state = { selected: '' };
  }

  render() {
    return (
      <div className="app-sidebar-container">
        <div className="app-sidebar">
          <ul>
            {sidebarMap.map((item) => (
              <li key={item.path} className={`${
                item.exactly
                ? this.props?.location?.pathname === item.path ? 'selected'
                : ''
                : this.props?.location?.pathname?.startsWith(item.path) ? 'selected'
                : ''
              }`}><Link to={item.path}>{item.label}</Link></li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default Sidebar;
