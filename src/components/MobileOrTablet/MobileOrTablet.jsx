import React from 'react';
// style
import './MobileOrTablet.scss';

class MobileOrTablet extends React.PureComponent {
  render() {
    return (
      <div className="mobile-tablet">
        <p className="text-center">Please access website on mobile or table!</p>
      </div>
    );
  }
}

export default MobileOrTablet;
