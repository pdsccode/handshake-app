import React from 'react';
import PropTypes from 'prop-types';
import ShareSocial from '@/components/core/presentation/ShareSocial';

import ShareLink from '@/assets/images/icon/icon_share.svg';
import FacebookSVG from '@/assets/images/icon/icon_facebook.svg';
import TwitterSVG from '@/assets/images/icon/icon_twitter.svg';

class ShareMarket extends React.Component {
  static propTypes = {
    event: PropTypes.object,
    shareURL: PropTypes.string,
  };

  static defaultProps = {
    event: {
      hid: null,
      id: 135,
      name: 'Măng non win',
      public: 0,
      result: -1,
      total_amount: null,
      total_dispute_amount: null,
    },
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
        Your event <strong>{`"${name}"`}</strong> was successfully created!
      </div>
    );
  }

  renderShares = (props) => {
    const { shareURL } = props;
    const socialList = [
      {
        img: FacebookSVG,
        title: 'FACEBOOK',
      }, {
        img: TwitterSVG,
        title: 'TWITTER',
      },
      {
        img: ShareLink,
        title: 'COPY',
      },
    ];
    return (
      <div className="ShareEventToBuddies">
        <div className="ShareEventToBuddiesTitle">
          Invite your buddies to bet
        </div>
        <ShareSocial shareUrl={shareURL} socialList={socialList} />
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
