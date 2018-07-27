import React from 'react';
import PropTypes from 'prop-types';
import ShareSocial from '@/components/core/presentation/ShareSocial';

class ShareMarket extends React.Component {
  static propTypes = {
    event: PropTypes.object,
    shareURL: PropTypes.string,
  };

  static defaultProps = {
    event: {},
    shareURL: null,
  };

  renderCheckmark = () => (
    <span className="checkmark">
      <div className="checkmark_circle" />
      <div className="checkmark_stem" />
      <div className="checkmark_kick" />
    </span>
  );

  renderMessage = (props) => {
    const { event } = props;
    const { name } = event;
    return (
      <div className="ShareEventMessage">
        Your event <strong>{name}</strong> was successfully created!
      </div>
    );
  }

  renderShares = (props) => {
    const { shareURL } = props;
    return (
      <div className="ShareEventToBuddies">
        <div className="ShareEventToBuddiesTitle">
          Invite your buddies to bet
        </div>
        <ShareSocial shareUrl={shareURL} />
      </div>
    );
  }

  renderComponent = (props) => {
    return (
      <div className="ShareMarketContainer">
        {this.renderCheckmark()}
        {this.renderMessage(props)}
        {this.renderShares(props)}
      </div>
    );
  }

  render() {
    return this.renderComponent(this.props);
  }
}

export default ShareMarket;
